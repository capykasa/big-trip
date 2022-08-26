import dayjs from 'dayjs';

const humanizeDateByDays = (dueDate) => dayjs(dueDate).format('D MMM');
const humanizeDateByYYYYMMDD = (dueDate) => dayjs(dueDate).format('YYYY-M-D');
const humanizeDateByDDMMYY = (dueDate) => dayjs(dueDate).format('DD/MM/YY');
const humanizeDateByTime = (dueDate) => dayjs(dueDate).format('H:mm');

const isFuturePoint = (dueDate) => dueDate && dayjs().isBefore(dueDate, 'm');

export {
  humanizeDateByDays,
  humanizeDateByYYYYMMDD,
  humanizeDateByDDMMYY,
  humanizeDateByTime,
  isFuturePoint
};
