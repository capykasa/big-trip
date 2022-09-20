import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDateByDays, humanizeDateByYYYYMMDD, humanizeDateByTime, getOffersByType, getCurrentOffers } from '../utils/point';

const createTripPointTemplate = (point, allOffers) => {
  const { basePrice, dateFrom, dateTo, type, destination, offers } = point;
  const { name } = destination;

  const offersByType = getOffersByType(allOffers, type);
  const currentOffers = getCurrentOffers(offersByType.offers, offers);
  const dateInDaysFormat = humanizeDateByDays(dateFrom);
  const dateInYYYYMMDDFormat = humanizeDateByYYYYMMDD(dateFrom);
  const dateFromInTimeFormat = humanizeDateByTime(dateFrom);
  const dateToInTimeFormat = humanizeDateByTime(dateTo);

  const createOffer = (items) => (
    items.map((item) => (
      `<li class="event__offer">
          <span class="event__offer-title">${item.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${item.price}</span>
        </li>`)).join(''));


  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateInYYYYMMDDFormat}">${dateInDaysFormat}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${dateFromInTimeFormat}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateFrom}">${dateToInTimeFormat}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${createOffer(currentOffers)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
};

export default class TripPointView extends AbstractView {
  #point = null;
  #allOffers = null;

  constructor(point, allOffers) {
    super();
    this.#point = point;
    this.#allOffers = allOffers;
  }

  get template() {
    return createTripPointTemplate(this.#point, this.#allOffers);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };
}
