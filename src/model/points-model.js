import Observable from '../framework/observable.js';
import DestinationModel from './destination-model.js';
import OffersModel from './offers-model.js';
import { generatePoint } from '../mock/point.js';

export default class PointsModel extends Observable {
  #destinationModel = new DestinationModel();
  #offersModel = new OffersModel();

  #points = Array.from({ length: 30 }, generatePoint);
  #collectedPoints = [];

  getPoints() {
    if (this.#collectedPoints.length === 0) {
      this.#points.forEach((point) => {
        const destination = this.#destinationModel.getDestination(point.destination);
        const offers = this.#offersModel.getOffers(point.offers);

        this.#collectedPoints.push({ ...point, destination, offers });
      });
    }

    return this.#collectedPoints;
  }

  updatePoint = (updateType, update) => {
    const index = this.#collectedPoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#collectedPoints = [
      ...this.#collectedPoints.slice(0, index),
      update,
      ...this.#collectedPoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addPoint = (updateType, update) => {
    this.#collectedPoints = [
      update,
      ...this.#collectedPoints,
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#collectedPoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#collectedPoints = [
      ...this.#collectedPoints.slice(0, index),
      ...this.#collectedPoints.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
