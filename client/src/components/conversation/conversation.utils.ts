export const renderElapsedTime = (pastDate: string): string => {
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

export const shouldRenderTimeStamp = (
  lastMesssageTime: string,
  currentMessageTime: string
) => {
  const timeDifferenceInHours =
    (Date.parse(currentMessageTime) - Date.parse(lastMesssageTime)) /
    (1000 * 60 * 60);

  if (timeDifferenceInHours > 1) return true;

  return false;
};

export const renderTimeStamp = (dateString: string) => {
  const date = new Date(dateString);
  const dateTime = date.getTime();
  const currentDate = new Date();
  const [currentWeekDay] = currentDate.toDateString().split(' ');
  const currentTime = currentDate.getTime();
  const elapsedTime = currentTime - dateTime;

  const [weekDay, month, monthDay, year] = date.toDateString().split(' ');

  const elapsedTimeDays = elapsedTime / (1000 * 60 * 60 * 24);
  const dateYear = date.getFullYear();
  const currentYear = new Date(currentTime).getFullYear();

  const dateHours = date.getHours();
  const dateMinutes = date.getMinutes();
  const formattedTime = getTimeAMOrPM(dateHours, dateMinutes);

  if (dateYear < currentYear) {
    const year = date.getFullYear();
    const displayYear = year < 2000 ? year : year % 2000;

    return `${date.getDate()}/${date.getMonth()}/${displayYear}, ${formattedTime}`;
  } else if (elapsedTimeDays > 6) {
    return `${month} ${
      monthDay.startsWith('0') ? monthDay.slice(1) : monthDay
    }, ${year}, ${formattedTime}`;
  } else if (elapsedTimeDays > 1) {
    return `${weekDay} ${formattedTime}`;
  } else {
    return `${currentWeekDay !== weekDay ? `${weekDay} ` : ''}${formattedTime}`;
  }
};

const getTimeAMOrPM = (dateHours: number, dateMinutes: number) => {
  const paddedMinutes = dateMinutes < 10 ? `0${dateMinutes}` : `${dateMinutes}`;

  if (dateHours > 12) {
    return `${dateHours % 12}:${paddedMinutes} PM`;
  } else {
    return `${dateHours === 0 ? 12 : dateHours}:${paddedMinutes} AM`;
  }
};
