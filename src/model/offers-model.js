import Observable from '../framework/observable.js';
import { generateOffers } from '../mock/offers.js';

export default class OffersModel extends Observable {
  #offers = generateOffers();

  getOffers(idList) {
    return this.#offers.filter(
      (item) => idList.some((offerId) => offerId === item.id));
  }
}
