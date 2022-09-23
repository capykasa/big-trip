import { remove, render, replace } from '../framework/render.js';
import TripPointView from '../view/trip-point-view.js';
import TripEditView from '../view/trip-edit-view.js';
import { UpdateType, UserAction } from '../const.js';
import { isDatesEqual } from '../utils/point.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #changeData = null;
  #changeMode = null;
  #tripPointComponent = null;
  #tripEditComponent = null;

  #point = null;
  #destinations = null;
  #offers = null;
  #mode = Mode.DEFAULT;

  constructor(pointListContainer, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;

    this.#changeData = changeData;

    this.#changeMode = changeMode;
  }

  init = (point, destinations, offers) => {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripEditComponent = this.#tripEditComponent;

    this.#tripPointComponent = new TripPointView(point, destinations, offers);
    this.#tripEditComponent = new TripEditView(point, destinations, offers);

    this.#tripPointComponent.setEditClickHandler(this.#handleEditClick);
    this.#tripEditComponent.setEditClickHandler(this.#handlePointClick);
    this.#tripEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#tripEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevTripPointComponent === null || prevTripEditComponent === null) {
      render(this.#tripPointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#tripPointComponent, prevTripEditComponent);
      this.#mode = Mode.DEFAULT;
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

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#tripEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#tripEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
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
    this.#tripEditComponent.reset(this.#point);
    this.#replaceFormToCard();
  };

  #handleFormSubmit = (update) => {

    const isMinorUpdate =
      !isDatesEqual(this.#point.dateFrom, update.dateFrom) ||
      !isDatesEqual(this.#point.dateTo, update.dateTo) ||
      this.#point.basePrice !== update.basePrice;

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
