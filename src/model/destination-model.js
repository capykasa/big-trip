import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';

export default class DestinationModel extends Observable {
  destinationsApiService = null;
  #destinations = [];

  constructor(destinationsApiService) {
    super();
    this.destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      this.#destinations = await this.destinationsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  };
}
