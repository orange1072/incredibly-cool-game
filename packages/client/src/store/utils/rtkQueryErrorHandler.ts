/**
 * Утилита для извлечения сообщения об ошибке из RTK Query actions
 */
export const getErrorMessage = (
  action: unknown,
  defaultMessage = 'Unknown error'
): string => {
  if (typeof action === 'object' && action !== null) {
    if ('error' in action) {
      const error = action.error;
      if (typeof error === 'string') {
        return error;
      }
      if (error && typeof error === 'object' && 'message' in error) {
        return (error.message as string) || defaultMessage;
      }
    }
  }
  return defaultMessage;
};
