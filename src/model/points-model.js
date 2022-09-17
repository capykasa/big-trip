import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #destinations = [];
  #offers = [];
  #collectedPoints = [];

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  init = async () => {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      this.#destinations = await this.#pointsApiService.destinations;
      this.#offers = await this.#pointsApiService.offers;
    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  };

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

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      basePrice: point['base_price'],
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };
}
