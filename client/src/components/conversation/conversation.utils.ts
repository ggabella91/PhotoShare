export const calculateElapsedTime = (pastDate: string): string => {
  const elapsedTimeMillis = Date.now() - Date.parse(pastDate);

  const elapsedSeconds = elapsedTimeMillis / 1000;

  if (elapsedSeconds < 60) {
    return 'Now';
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}m`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  if (elapsedHours < 24) {
    return `${elapsedHours}h`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);

  if (elapsedDays < 7) {
    return `${elapsedDays}d`;
  }

  const elapsedWeeks = Math.floor(elapsedDays / 7);

  return `${elapsedWeeks}w`;
};
