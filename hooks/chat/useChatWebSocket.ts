import { useCallback, useEffect, useRef } from 'react';

import * as SecureStore from 'expo-secure-store';

import { mapMessage } from '@/hooks/chat/mapChat';
import { ChatService } from '@/services/api/services/chatService';
import { WsIncomingEvent } from '@/services/api/services/dto/chat.dto';
import { MessageEntity } from '@/types/entities/ChatType';

interface RNWebSocketConstructor {
  new (
    url: string,
    protocols?: string | string[],
    options?: { headers?: Record<string, string> },
  ): WebSocket;
}

interface Options {
  conversationId: string;
  onMessage: (msg: MessageEntity) => void;
  onReconnect?: (lastMessageId: string | null) => void;
  enabled?: boolean;
}

const BASE_DELAY_MS = 2_000;
const MAX_RETRIES = 5;

export function useChatWebSocket({
  conversationId,
  onMessage,
  onReconnect,
  enabled = true,
}: Options) {
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const lastIdRef = useRef<string | null>(null);
  const unmountedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMessageRef = useRef(onMessage);
  const onReconnectRef = useRef(onReconnect);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);
  useEffect(() => {
    onReconnectRef.current = onReconnect;
  }, [onReconnect]);

  const connect = useCallback(async () => {
    if (unmountedRef.current) return;

    const token = await SecureStore.getItemAsync('accessToken');
    if (!token) return;

    const url = ChatService.getWsUrl(conversationId);
    // RN/Hermes WebSocket accepts a 3rd options arg not present in browser type defs
    const RNWS = WebSocket as unknown as RNWebSocketConstructor;
    const ws = new RNWS(url, [], {
      headers: { Authorization: `Bearer ${token}` },
    });
    wsRef.current = ws;

    ws.onopen = () => {
      retryCountRef.current = 0;
    };

    ws.onmessage = event => {
      try {
        const data: WsIncomingEvent = JSON.parse(event.data as string);
        if (
          (data.kind === 'message' || data.kind === 'system') &&
          data.message
        ) {
          const entity = mapMessage(data.message);
          lastIdRef.current = entity.id;
          onMessageRef.current(entity);
        }
      } catch {
        // ignore malformed frames
      }
    };

    ws.onerror = () => {
      // onerror always precedes onclose in RN — let onclose handle retry
    };

    ws.onclose = () => {
      if (unmountedRef.current) return;
      if (retryCountRef.current >= MAX_RETRIES) return;

      const delay = BASE_DELAY_MS * Math.pow(2, retryCountRef.current);
      retryCountRef.current += 1;

      timerRef.current = setTimeout(async () => {
        onReconnectRef.current?.(lastIdRef.current);
        await connect();
      }, delay);
    };
  }, [conversationId]);

  const sendTyping = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'typing' }));
    }
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', content }));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    unmountedRef.current = false;
    void connect();

    return () => {
      unmountedRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [conversationId, enabled, connect]);

  return { sendTyping, sendMessage };
}
