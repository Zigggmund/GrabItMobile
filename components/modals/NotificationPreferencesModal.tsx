import { NotificationPreferencesDto } from '@/services/api/services/dto/notification.dto';

import { useEffect, useState } from 'react';
import { Modal, Pressable, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUpdatePreferences } from '@/hooks/notification/useUpdatePreferences';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

interface Props {
  visible: boolean;
  onClose: () => void;
  preferences: NotificationPreferencesDto | undefined;
}

export default function NotificationPreferencesModal({ visible, onClose, preferences }: Props) {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const update = useUpdatePreferences();

  const [emailEnabled, setEmailEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [browserEnabled, setBrowserEnabled] = useState(false);
  const [inboxEnabled, setInboxEnabled] = useState(true);

  useEffect(() => {
    if (preferences) {
      setEmailEnabled(preferences.email_enabled);
      setPushEnabled(preferences.mobile_push_enabled);
      setBrowserEnabled(preferences.browser_push_enabled);
      setInboxEnabled(preferences.inbox_enabled);
    }
  }, [preferences, visible]);

  const handleSave = () => {
    update.mutate(
      {
        email_enabled: emailEnabled,
        mobile_push_enabled: pushEnabled,
        browser_push_enabled: browserEnabled,
        inbox_enabled: inboxEnabled,
      },
      { onSuccess: onClose },
    );
  };

  const rows: { label: string; value: boolean; onChange: (v: boolean) => void }[] = [
    { label: l.notifEmailEnabled, value: emailEnabled, onChange: setEmailEnabled },
    { label: l.notifPushEnabled, value: pushEnabled, onChange: setPushEnabled },
    { label: l.notifBrowserEnabled, value: browserEnabled, onChange: setBrowserEnabled },
    { label: l.notifInboxEnabled, value: inboxEnabled, onChange: setInboxEnabled },
  ];

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#00000066',
          justifyContent: 'flex-end',
          paddingBottom: insets.bottom,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <View
          style={{
            backgroundColor: colors.theme.white.bright,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
          }}
        >
          <CustomText
            highlight
            className="text-22 font-bold mb-6 text-center"
            style={{ color: colors.theme.blue.dark }}
          >
            {l.notifSettings}
          </CustomText>

          <View className="gap-1">
            {rows.map(({ label, value, onChange }) => (
              <View
                key={label}
                className="flex-row items-center justify-between py-3 px-1"
                style={{
                  borderBottomWidth: 1,
                  borderColor: colors.theme.white.primary,
                }}
              >
                <CustomText className="text-16" style={{ color: colors.theme.blue.primary }}>
                  {label}
                </CustomText>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{
                    true: colors.base.orange.primary,
                    false: colors.theme.white.primary,
                  }}
                  thumbColor={colors.base.neutral.whiteBright}
                />
              </View>
            ))}
          </View>

          <View className="mt-6">
            <CustomButton
              type="highlighted"
              text={l.btnSave}
              disabled={update.isPending}
              onPress={handleSave}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}