export function formatTime(isoTime?: string): string {
  if (!isoTime) {
    return '';
  }

  const date = new Date(isoTime);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
