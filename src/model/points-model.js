import { generateDestination } from '../mock/destination.js';
import { generateOffers } from '../mock/offrs.js';
import { generatePoint } from '../mock/point.js';

export default class PointsModel {
  points = Array.from({ length: 3 }, generatePoint);
  destination = generateDestination();
  offers = generateOffers();

  getPoints = () => this.points;
  getDestination = () => this.destination;
  getOffers = () => this.offers;
}
