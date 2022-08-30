import dayjs from 'dayjs';

const humanizeDateByDays = (dueDate) => dayjs(dueDate).format('D MMM');
const humanizeDateByYYYYMMDD = (dueDate) => dayjs(dueDate).format('YYYY-M-D');
const humanizeDateByDDMMYY = (dueDate) => dayjs(dueDate).format('DD/MM/YY');
const humanizeDateByTime = (dueDate) => dayjs(dueDate).format('H:mm');

const isFuturePoint = (dueDate) => dueDate && dayjs().isBefore(dueDate, 'm');

const getWeightForSort = (itemA, itemB) => {
  if (itemA === null && itemB === null) {
    return 0;
  }

  if (itemA === null) {
    return 1;
  }

  if (itemB === null) {
    return -1;
  }

  return null;
};

const sortByDate = (pointA, pointB) => {
  const weight = getWeightForSort(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

const sortByPrice = (pointA, pointB) => {
  const weight = getWeightForSort(pointA.basePrice, pointB.basePrice);

  return weight ?? dayjs(pointA.basePrice).diff(dayjs(pointB.basePrice));
};

export {
  humanizeDateByDays,
  humanizeDateByYYYYMMDD,
  humanizeDateByDDMMYY,
  humanizeDateByTime,
  isFuturePoint,
  sortByDate,
  sortByPrice
};
