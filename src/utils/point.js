import dayjs from 'dayjs';

const humanizeDateByDays = (dueDate) => dayjs(dueDate).format('D MMM');
const humanizeDateByYYYYMMDD = (dueDate) => dayjs(dueDate).format('YYYY-M-D');
const humanizeDateByDDMMYY = (dueDate) => dayjs(dueDate).format('DD/MM/YY');
const humanizeDateByTime = (dueDate) => dayjs(dueDate).format('H:mm');

const isFuturePoint = (dueDate) => dueDate && dayjs().isBefore(dueDate, 'm');

const getLastWord = (text) => {
  const wordsArray = text.split(' ');
  return wordsArray[wordsArray.length - 1];
};

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

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const getOffersByType = (offers, type) => offers.find((item) => item.type === type);

const getCurrentOffers = (offersByType, currentOffersId) => offersByType.filter((item) => currentOffersId.includes(item.id));

export {
  humanizeDateByDays,
  humanizeDateByYYYYMMDD,
  humanizeDateByDDMMYY,
  humanizeDateByTime,
  isFuturePoint,
  getLastWord,
  sortByDate,
  sortByPrice,
  isDatesEqual,
  getOffersByType,
  getCurrentOffers,
};
