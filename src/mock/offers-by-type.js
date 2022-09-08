import { typesOfEvents } from '../const';
import { getRandomArray, getRandomInteger } from '../utils';

export const generateOffersByType = () => ({
  type: typesOfEvents[getRandomInteger(0, 8)],
  offers: getRandomArray(1, 6, 2)
});
