import Observable from '../framework/observable.js';
import { generateDestination } from '../mock/destination.js';

export default class DestinationModel extends Observable {
  #destination = generateDestination();

  getDestination(id) {
    return this.#destination.find(
      (item) => item.id === id);
  }
}
