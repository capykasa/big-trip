import { SortType } from '../const.js';
import { render, RenderPosition } from '../framework/render.js';
import { sortByDate, sortByPrice } from '../utils/point.js';
import ListEmptyView from '../view/list-empty.js';
import TripEventsListView from '../view/trip-events-list.js';
import TripSortView from '../view/trip-sort-view.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #destinationModel = null;
  #offersModel = null;

  #pointListContainer = new TripEventsListView();
  #listEmptyComponent = new ListEmptyView();
  #tripSortComponent = new TripSortView();

  #complatedPoints = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(boardContainer, pointsModel, destinationModel, offersModel) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
  }

  get points() {
    const complatedPoints = [];

    this.#pointsModel.getPoints().forEach((point) => {
      const destination = this.#destinationModel.getDestination(point.destination);
      const offers = this.#offersModel.getOffers(point.offers);

      complatedPoints.push({ ...point, destination, offers });
    });

    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...complatedPoints].sort(sortByDate);
      case SortType.PRICE:
        return [...complatedPoints].sort(sortByPrice);
    }

    return complatedPoints;
  }

  init = () => {
    this.#renderBoard();
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListContainer.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #clearPoints = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints();
  };

  #renderSort = () => {
    render(this.#tripSortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
    this.#tripSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderListEmpty = () => {
    render(this.#listEmptyComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderBoard = () => {
    render(this.#pointListContainer, this.#boardContainer);

    if (this.points.length === 0) {
      this.#renderListEmpty();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  };
}
