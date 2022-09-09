import { places } from '../const';
import { getRandomInteger } from '../utils/common';

export const generateDestination = () => ([
  {
    id: 0,
    description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    name: places[getRandomInteger(0, 2)],
    pictures: [
      {
        src: 'img/photos/1.jpg',
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: 1,
    description: 'beautiful city, a true asian pearl, with crowded streets.',
    name: places[getRandomInteger(0, 2)],
    pictures: [
      {
        src: 'img/photos/3.jpg',
        description: 'Manotuls building'
      }
    ]
  },
  {
    id: 2,
    description: 'city with crowded streets.',
    name: places[getRandomInteger(0, 2)],
    pictures: [
      {
        src: 'img/photos/5.jpg',
        description: 'Litstand building'
      }
    ]
  }
]);
