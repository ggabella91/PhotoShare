export const calculateElapsedTime = (pastDate: Date): string => {
  const elapsedTimeMillis = Date.now() - pastDate.getTime();

  const elapsedSeconds = elapsedTimeMillis / 1000;

  if (elapsedSeconds < 60) {
    return 'Just now';
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  if (elapsedMinutes < 60) {
    return elapsedMinutes === 1
      ? '1 minute ago'
      : `${elapsedMinutes} minutes ago`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  if (elapsedHours < 24) {
    return elapsedHours === 1 ? '1 hour ago' : `${elapsedHours} hours ago`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);

  if (elapsedDays < 7) {
    return elapsedDays === 1 ? 'Yesterday' : `${elapsedDays} days ago`;
  }

  const elapsedWeeks = Math.floor(elapsedDays / 7);

  if (elapsedWeeks < 4) {
    return elapsedWeeks === 1 ? '1 week ago' : `${elapsedWeeks} weeks ago`;
  }

  const elapsedMonths = Math.floor(elapsedWeeks / 4);

  if (elapsedMonths < 12) {
    return elapsedMonths === 1 ? '1 month ago' : `${elapsedMonths} months ago`;
  }

  const elapsedYears = Math.floor(elapsedMonths / 12);

  return elapsedYears === 1 ? '1 year ago' : `${elapsedYears} years ago`;
};
