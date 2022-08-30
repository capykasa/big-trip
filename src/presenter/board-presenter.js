import { render, RenderPosition } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import ListEmptyView from '../view/list-empty.js';
import TripEventsListView from '../view/trip-events-list.js';
import TripSortView from '../view/trip-sort-view.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #pointListContainer = new TripEventsListView();
  #listEmptyComponent = new ListEmptyView();
  #tripSortComponent = new TripSortView();

  #boardPoints = [];
  #boardDestination = [];
  #boardOffers = [];
  #pointPresenter = new Map();

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

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => {
      presenter.resetView();
    }
    );
  };

  #renderPoint = (point, destination, offers) => {
    const pointPresenter = new PointPresenter(this.#pointListContainer.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, destination, offers);
    this.#pointPresenter.set(point.id, pointPresenter);
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

  #clearPoints = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderSort = () => {
    render(this.#tripSortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderListEmpty = () => {
    render(this.#listEmptyComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderBoard = () => {
    render(this.#pointListContainer, this.#boardContainer);

    if (this.#boardPoints.length === 0) {
      this.#renderListEmpty();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  };
}
