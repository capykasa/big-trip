import { remove, render, replace } from '../framework/render.js';
import TripPointView from '../view/trip-point.js';
import TripEditView from '../view/trip-edit-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;

  #changePoint = null;

  #changeMode = null;

  #tripPointComponent = null;
  #tripEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor(pointListContainer, changePoint, changeMode) {
    this.#pointListContainer = pointListContainer;

    this.#changePoint = changePoint;

    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripEditComponent = this.#tripEditComponent;

    this.#tripPointComponent = new TripPointView(point);
    this.#tripEditComponent = new TripEditView(point);

    this.#tripPointComponent.setEditClickHandler(this.#handleEditClick);
    this.#tripEditComponent.setEditClickHandler(this.#handlePointClick);
    this.#tripEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if (prevTripPointComponent === null || prevTripEditComponent === null) {
      render(this.#tripPointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#tripEditComponent, prevTripEditComponent);
    }

    remove(prevTripPointComponent);
    remove(prevTripEditComponent);
  };

  destroy = () => {
    remove(this.#tripPointComponent);
    remove(this.#tripEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#tripEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #replaceCardToForm = () => {
    replace(this.#tripEditComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToCard = () => {
    replace(this.#tripPointComponent, this.#tripEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#tripEditComponent.reset(this.#point);
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
    this.#changePoint(point);
    this.#replaceFormToCard();
  };
}
