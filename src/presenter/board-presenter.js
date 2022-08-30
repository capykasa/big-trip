import { render, RenderPosition, replace } from '../framework/render.js';
import ListEmptyView from '../view/list-empty.js';
import TripEditView from '../view/trip-edit-view.js';
import TripEventsListView from '../view/trip-events-list.js';
import TripPointView from '../view/trip-point.js';
import TripSortView from '../view/trip-sort-view.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #tripEventsListComponent = new TripEventsListView();
  #listEmptyComponent = new ListEmptyView();
  #tripSortComponent = new TripSortView();

  #boardPoints = [];
  #boardDestination = [];
  #boardOffers = [];

  constructor(boardContainer, pointsModel) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#boardDestination = [...this.#pointsModel.destination];
    this.#boardOffers = [...this.#pointsModel.offers];

    this.#renderBoard();
  };

  #renderPoint = (point, destination, offers) => {
    const tripPointComponent = new TripPointView(point, destination, offers);
    const tripEditComponent = new TripEditView(point, destination, offers);

    const replaceCardToForm = () => {
      replace(tripEditComponent, tripPointComponent);
    };

    const replaceFormToCard = () => {
      replace(tripPointComponent, tripEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    tripPointComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    tripEditComponent.setEditClickHandler(() => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    tripEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });


    render(tripPointComponent, this.#tripEventsListComponent.element);
  };

  #renderPoints = () => {
    this.#boardPoints.forEach((point) => {
      const destination = this.#boardDestination.find(
        (item) => item.id === point.destination
      );
      const offers = this.#boardOffers.filter(
        (item) => point.offers.some((offerId) => offerId === item.id)
      );

      this.#renderPoint(point, destination, offers);
    });
  };

  #renderSort = () => {
    render(this.#tripSortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderListEmpty = () => {
    render(this.#listEmptyComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderBoard = () => {
    render(this.#tripEventsListComponent, this.#boardContainer);

    if (this.#boardPoints.length === 0) {
      this.#renderListEmpty();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  };
}
