// Singleton-сервис для показа toast-уведомлений из любой точки приложения,
// включая коллбэки MutationCache (вне React-дерева).

// Провайдер регистрирует свою функцию через toastService.register(),
// остальной код вызывает toastService.error() / .success() / .info().

export type ToastType = 'error' | 'success' | 'info';

type ShowFn = (message: string, type: ToastType) => void;

let _show: ShowFn | null = null;

export const toastService = {
  /** Вызывается внутри AppToast при монтировании */
  register(fn: ShowFn | null) {
    _show = fn;
  },

  error(message: string) {
    _show?.(message, 'error');
  },
  success(message: string) {
    _show?.(message, 'success');
  },
  info(message: string) {
    _show?.(message, 'info');
  },
};
