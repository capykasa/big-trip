import dayjs from 'dayjs';
import { getRandomArray, getRandomInteger } from '../utils';
import { offersByType } from './offers-by-type';

const generateDate = () => {
  const maxDaysGap = 47;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'hour').toDate();
};

export const generatePoint = () => ({
  basePrice: getRandomInteger(700, 4000),
  dateFrom: generateDate(),
  dateTo: generateDate(),
  destination: getRandomInteger(0, 2),
  id: getRandomInteger(0, 9),
  offers: getRandomArray(0, 6, 3),
  type: offersByType[getRandomInteger(0, 8)],
});
