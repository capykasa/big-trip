import dayjs from 'dayjs';
import { typesOfEvents } from '../const';
import { getRandomArray, getRandomInteger } from '../utils/common';

const generateDate = () => {
  const maxDaysGap = 1447;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'minutes').toDate();
};

export const generatePoint = () => ({
  basePrice: getRandomInteger(700, 4000),
  dateFrom: generateDate(),
  dateTo: generateDate(),
  destination: getRandomInteger(0, 2),
  id: getRandomInteger(0, 900),
  offers: getRandomArray(0, 6, 3),
  type: typesOfEvents[getRandomInteger(0, 8)],
});
