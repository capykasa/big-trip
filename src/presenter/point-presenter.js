import { remove, render, replace } from '../framework/render.js';
import TripPointView from '../view/trip-point.js';
import TripEditView from '../view/trip-edit-view.js';

export default class PointPresenter {
  #pointListContainer = null;
  #changeData = null;

  #tripPointComponent = null;
  #tripEditComponent = null;

  #point = null;
  #destination = null;
  #offers = null;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (point, destination, offers) => {
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripEditComponent = this.#tripEditComponent;

    this.#tripPointComponent = new TripPointView(point, destination, offers);
    this.#tripEditComponent = new TripEditView(point, destination, offers);

    this.#tripPointComponent.setEditClickHandler(this.#handleEditClick);
    this.#tripEditComponent.setEditClickHandler(this.#handlePointClick);
    this.#tripEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if (prevTripPointComponent === null || prevTripEditComponent === null) {
      render(this.#tripPointComponent, this.#pointListContainer);
      return;
    }

    if (this.#pointListContainer.contains(prevTripPointComponent.element)) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#pointListContainer.contains(prevTripEditComponent.element)) {
      replace(this.#tripEditComponent, prevTripEditComponent);
    }

    remove(prevTripPointComponent);
    remove(prevTripEditComponent);
  };

  destroy = () => {
    remove(this.#tripPointComponent);
    remove(this.#tripEditComponent);
  };

  #replaceCardToForm = () => {
    replace(this.#tripEditComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #replaceFormToCard = () => {
    replace(this.#tripPointComponent, this.#tripEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handlePointClick = () => {
    this.#replaceFormToCard();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(point);
    this.#replaceFormToCard();
  };
}
