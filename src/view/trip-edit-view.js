import he from 'he';
import { BLANK_POINT } from '../const';
import { getLastWord, getOffersByType, humanizeDateByDDMMYY, humanizeDateByTime } from '../utils/point';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createEventTypeTemplate = (event, currentType) => (
  `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          ${event.map((item) => `<div class="event__type-item">
            <input id="event-type-${item.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.type}">
            <label class="event__type-label  event__type-label--${item.type}" for="event-type-${item.type}-1">${item.type}</label>
          </div>`).join('')}

        </fieldset>
      </div>
    </div>`
);

const createPlaceTemplate = (destinations) => (
  `<datalist id="destination-list-1">
    ${destinations.map((item) => `<option value="${item.name}">${item.name}</option>`).join('')}
  </datalist>`
);

const createOffersTemplate = (offersByType, offers, isDisabled) => (
  `<div class="event__available-offers">
  ${offersByType.map((offer) =>
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${getLastWord(offer.title)}-${offer.id}"
        type="checkbox"
        name="event-offer-${offer.title}"
        ${offers.includes(offer.id) ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
        data-id-offer="${offer.id}"
      >
      <label class="event__offer-label" for="event-offer-${getLastWord(offer.title)}-${offer.id}">
        <span class="event__offer-title">Add ${offer.title}</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  ).join('')}
  </div>`
);

const createDestinationTemplate = (currentDestination) => (
  `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${currentDestination.description}</p>

    ${currentDestination.pictures.length > 0 ? `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${currentDestination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)}
      </div>
    </div>` : ''}
</section>`
);

const createTripEditTemplate = (data, allDestinations, allOffers) => {
  const { basePrice, dateFrom, dateTo, type, destination, offers, isDisabled, isSaving, isDeleting } = data;

  const offersByType = getOffersByType(allOffers, type);
  const dateFromDDMMYYFormat = humanizeDateByDDMMYY(dateFrom);
  const dateToDDMMYYFormat = humanizeDateByDDMMYY(dateTo);
  const dateFromInTimeFormat = humanizeDateByTime(dateFrom);
  const dateToInTimeFormat = humanizeDateByTime(dateTo);

  const currentDestination = destination ? allDestinations.find((item) => item.id === destination) : '';

  const eventTypeTemplate = createEventTypeTemplate(allOffers, type);

  const placeTemplate = createPlaceTemplate(allDestinations);

  const offersTemplate = createOffersTemplate(offersByType.offers, offers, isDisabled);

  const destinationTemplate = currentDestination ? createDestinationTemplate(currentDestination) : '';

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">

            ${eventTypeTemplate}

          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input
              class="event__input
              event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              list="destination-list-1"
              value="${he.encode(currentDestination ? currentDestination.name : '')}"
              ${isDisabled ? 'disabled' : ''}
            >
            ${placeTemplate}
          </div>


          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input
              event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${dateFromDDMMYYFormat} ${dateFromInTimeFormat}"
              ${isDisabled ? 'disabled' : ''}
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
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-1"
              type="text"
              name="event-price"
              value="${basePrice}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <button
            class="event__save-btn  btn  btn--blue"
            type="submit"
            ${isDisabled ? 'disabled' : ''}
          >
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            class="event__reset-btn"
            type="reset"
            ${isDisabled ? 'disabled' : ''}
          >
            ${isDeleting ? 'Deleting...' : 'Delete'}
          </button>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              ${offersTemplate}

          </section>

          ${destinationTemplate}

        </section>
      </form>
    </li>`
  );
};

export default class TripEditView extends AbstractStatefulView {
  #datepicker = null;
  #allDestinations = null;
  #allOffers = null;

  constructor(point = BLANK_POINT, allDestinations, allOffers) {
    super();
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
    this._state = TripEditView.parseTripToState(point);

    this.#setInnerHandlers();
    this.#setFromDatepicker();
    this.#setToDatepicker();
  }

  get template() {
    return createTripEditTemplate(this._state, this.#allDestinations, this.#allOffers);
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

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setFromDatepicker();
    this.#setToDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  #eventChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #placeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.value !== '') {
      this.updateElement({
        destination: this.#allDestinations.find((destination) => evt.target.value === destination.name).id,
      });
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const newOffers = this._state.offers.slice();
    const idOffer = Number(evt.target.dataset.idOffer);
    if (evt.target.checked) {
      newOffers.push(idOffer);
    } else {
      newOffers.splice(newOffers.indexOf(idOffer), 1);
    }
    this.updateElement({
      offers: newOffers,
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
      .addEventListener('input', this.#placeChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offerChangeHandler);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(TripEditView.parseStateToTrip(this._state));
  };

  static parseTripToState = (point) => (
    {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    }
  );

  static parseStateToTrip = (state) => {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };
}
