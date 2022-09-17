import { remove, render, RenderPosition } from '../framework/render.js';
import ListEmptyView from '../view/list-empty-view.js';
import LoadingView from '../view/loading-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripSortView from '../view/trip-sort-view-view.js';
import PointPresenter from './point-presenter.js';
import { sortByDate, sortByPrice } from '../utils/point.js';
import { filter } from '../utils/filter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import PointNewPresenter from './point-new-presenter.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #pointListContainer = new TripEventsListView();
  #loadingComponent = new LoadingView();
  #listEmptyComponent = null;
  #tripSortComponent = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor(boardContainer, pointsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointListContainer.element, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;

    const points = this.#buildPoints(this.#pointsModel.points, this.#pointsModel.destinations, this.#pointsModel.offers);
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDate);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints;
  }

  init = () => {
    this.#renderBoard();
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback);
  };

  #buildPoints = (points, destinations, offers) => {
    const collectedPoints = [];
    points.forEach((point) => {
      const destination = destinations.find(
        (item) => item.id === point.destination
      );
      const currentOffers = offers.filter(
        (item) => point.offers.some((offerId) => offerId === item.id)
      );

      collectedPoints.push({ ...point, destination, currentOffers });
    });

    return collectedPoints;
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListContainer.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({ resetRenderedTaskCount: true });
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#tripSortComponent = new TripSortView(this.#currentSortType);
    this.#tripSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#tripSortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderListEmpty = () => {
    this.#listEmptyComponent = new ListEmptyView(this.#filterType);
    render(this.#listEmptyComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #clearBoard = ({ resetSortType = false } = {}) => {
    this.#pointNewPresenter.destroy();

    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#tripSortComponent);
    remove(this.#loadingComponent);
    remove(this.#listEmptyComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderBoard = () => {
    render(this.#pointListContainer, this.#boardContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;

    if (this.points.length === 0) {
      this.#renderListEmpty();
      return;
    }

    this.#renderSort();
    this.#renderPoints(points);
  };
}
