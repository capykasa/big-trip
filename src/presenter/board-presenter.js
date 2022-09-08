import { SortType } from '../const.js';
import { render, RenderPosition } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import { sortByDate, sortByPrice } from '../utils/point.js';
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
  #complatedPoints = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sourcedBoardPoints = [];

  constructor(boardContainer, pointsModel) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#boardDestination = [...this.#pointsModel.destination];
    this.#boardOffers = [...this.#pointsModel.offers];

    this.#complatedPoints = this.#buildPoints(this.#boardPoints);

    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    this.#renderBoard();
  };

  #buildPoints = (points) => {
    const complatedPoints = [];
    points.forEach((point) => {
      const destination = this.#boardDestination.find(
        (item) => item.id === point.destination
      );
      const offers = this.#boardOffers.filter(
        (item) => point.offers.some((offerId) => offerId === item.id)
      );

      complatedPoints.push({ ...point, destination, offers });
    });
    return complatedPoints;
  };

  #handlePointChange = (updatedPoint) => {
    this.#complatedPoints = updateItem(this.#complatedPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => {
      presenter.resetView();
    }
    );
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListContainer.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.#complatedPoints.forEach((point) => this.#renderPoint(point));
  };

  #clearPoints = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #sortTasks = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.#boardPoints.sort(sortByDate);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortByPrice);
        break;
      default:
        this.#boardPoints = [...this.#sourcedBoardPoints];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTasks(sortType);
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

    if (this.#boardPoints.length === 0) {
      this.#renderListEmpty();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  };
}
