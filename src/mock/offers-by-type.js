import { TYPES_OF_EVENTS } from '../const';
import { getRandomArray, getRandomInteger } from '../utils';

export const generateOffersByType = () => ({
  type: TYPES_OF_EVENTS[getRandomInteger(0, 8)],
  offers: getRandomArray(0, 6, 2)
});
