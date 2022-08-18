import { getRandomArray, getRandomInteger } from '../utils';

export const generatePoint = () => ({
  basePrice: 1100,
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: getRandomInteger(0, 3),
  id: 0,
  offers: getRandomArray(0, 6, 3),
  type: 'bus',
});
