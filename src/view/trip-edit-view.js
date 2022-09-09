import { places, typesOfEvents } from '../const';
import { humanizeDateByDDMMYY, humanizeDateByTime } from '../utils/point';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createTripEditTemplate = (data) => {
  const { basePrice, dateFrom, dateTo, type, destination, offers } = data;
  const { description, name, pictures } = destination;

  const dateFromDDMMYYFormat = humanizeDateByDDMMYY(dateFrom);
  const dateToDDMMYYFormat = humanizeDateByDDMMYY(dateTo);
  const dateFromInTimeFormat = humanizeDateByTime(dateFrom);
  const dateToInTimeFormat = humanizeDateByTime(dateTo);

  const createEventType = (event) => (
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          ${event.map((item) => `<div class="event__type-item">
            <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
            <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${item}</label>
          </div>`).join('')}

        </fieldset>
      </div>
    </div>`
  );

  const createPlace = (selectedCity) => (
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input
        class="event__input
        event__input--destination"
        id="event-destination-1"
        type="text"
        name="event-destination"
        value="${selectedCity}"
        list="destination-list-1"
      >
      <datalist id="destination-list-1">
        ${places.map((item) => `<option value="${item}" ${selectedCity === item ? 'select' : ''}></option>`)}
      </datalist>
    </div>`
  );

  const createOffers = (items) => (
    `<div class="event__available-offers">
    ${items.map((offer) =>
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}" checked>
        <label class="event__offer-label" for="event-offer-${offer.title}-1">
          <span class="event__offer-title">Add ${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
    ).join('')}
    </div>`
  );


  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">

            ${createEventType(typesOfEvents)}

          </div>

          ${createPlace(name)}

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input
              event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${dateFromDDMMYYFormat} ${dateFromInTimeFormat}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input
              event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${dateToDDMMYYFormat} ${dateToInTimeFormat}"
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              ${createOffers(offers)}

          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

              ${pictures.length > 0 ? `<div class="event__photos-container">
                <div class="event__photos-tape">
                  ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)}
                </div>
              </div>` : ''}
          </section>
        </section>
      </form>
    </li>`
  );
};

export default class TripEditView extends AbstractStatefulView {
  #datepicker = null;

  constructor(point) {
    super();
    this._state = TripEditView.parseTripToState(point);

    this.#setInnerHandlers();
    this.#setFromDatepicker();
    this.#setToDatepicker();
  }

  get template() {
    return createTripEditTemplate(this._state);
  }

  reset = (point) => {
    this.updateElement(
      TripEditView.parseTripToState(point),
    );
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setFromDatepicker();
    this.#setToDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
  };

  #eventChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
    });
  };

  #placeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: {
        name: evt.target.value
      },
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(TripEditView.parseStateToTrip(this._state));
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick(TripEditView.parseStateToTrip(this._state));
  };

  #setFromDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('input[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
  };

  #setToDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('input[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#eventChangeHandler);
    this.element.querySelector('.event__field-group--destination')
      .addEventListener('change', this.#placeChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);
  };

  static parseTripToState = (point) => (
    { ...point }
  );

  static parseStateToTrip = (state) => {
    const point = { ...state };

    return point;
  };
}
