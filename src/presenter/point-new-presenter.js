import { remove, render, RenderPosition } from '../framework/render.js';
import TripEditView from '../view/trip-edit-view.js';
import { BLANK_POINT, UpdateType, UserAction } from '../const.js';
import { getRandomInteger } from '../utils/common.js';

export default class PointNewPresenter {
  #pointListContainer = null;
  #changeData = null;
  #tripEditComponent = null;
  #destroyCallback = null;

  #destinations = null;
  #offers = null;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback, destinations, offers) => {
    this.#destroyCallback = callback;
    this.#destinations = destinations;
    this.#offers = offers;

    if (this.#tripEditComponent !== null) {
      return;
    }

    this.#tripEditComponent = new TripEditView(BLANK_POINT, destinations, offers);
    this.#tripEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#tripEditComponent.setEditClickHandler(this.#handleDeleteClick);
    this.#tripEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#tripEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (this.#tripEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#tripEditComponent);
    this.#tripEditComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      { id: getRandomInteger(10, 999), ...point },
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
