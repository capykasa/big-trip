import { render, replace } from '../framework/render.js';
import TripPointView from '../view/trip-point.js';
import TripEditView from '../view/trip-edit-view.js';

export default class PointPresenter {
  #pointListContainer = null;

  #tripPointComponent = null;
  #tripEditComponent = null;

  #point = null;
  #destination = null;
  #offers = null;

  constructor(pointListContainer) {
    this.#pointListContainer = pointListContainer;
  }

  init = (point, destination, offers) => {
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;

    this.#tripPointComponent = new TripPointView(point, destination, offers);
    this.#tripEditComponent = new TripEditView(point, destination, offers);

    this.#tripPointComponent.setEditClickHandler(this.#handleEditClick);
    this.#tripEditComponent.setEditClickHandler(this.#handlePointClick);
    this.#tripEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    render(this.#tripPointComponent, this.#pointListContainer);
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

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
  };
}
