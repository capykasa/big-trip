import { getRandomArray, getRandomInteger } from '../utils';

const offersByType = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const generateOffersByType = () => ({
  type: offersByType[getRandomInteger(0, 8)],
  offers: getRandomArray(0, 6, 2)
});
