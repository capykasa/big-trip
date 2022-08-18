import { createElement } from '../render';
import { humanizeDateByDays, humanizeDateByYYYYMMDD, humanizeDateByTime } from '../utils';

const createTripPointTemplate = (task, destination, offers) => {
  const { basePrice, dateFrom, dateTo, type } = task;
  const { name } = destination;

  const dateInDaysFormat = humanizeDateByDays(dateFrom);
  const dateInYYYYMMDDFormat = humanizeDateByYYYYMMDD(dateFrom);
  const dateFromInTimeFormat = humanizeDateByTime(dateFrom);
  const dateToInTimeFormat = humanizeDateByTime(dateTo);

  const createOffer = (offer) => (
    `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
  );


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
      ${offers.length > 0
      ? offers.map((offer) => createOffer(offer))
      : ''}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
};

export default class TripPointView {
  constructor(point, destination, offers) {
    this.point = point;
    this.destination = destination;
    this.offers = offers;
  }

  getTemplate() {
    return createTripPointTemplate(this.point, this.destination, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
