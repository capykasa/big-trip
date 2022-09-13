import { render } from './framework/render.js';
import FilterView from './view/trip-filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import { generateFilter } from './mock/filters.js';
import OffersModel from './model/offers-model.js';
import DestinationModel from './model/destination-model.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteTripControlElement = siteHeaderElement.querySelector('.trip-controls__filters');

const siteMainElement = document.querySelector('.page-main');
const siteTripBoardElement = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const destinationModel = new DestinationModel();
const offersModel = new OffersModel();
const boardPresenter = new BoardPresenter(
  siteTripBoardElement,
  pointsModel,
  destinationModel,
  offersModel
);

const filters = generateFilter(pointsModel.getPoints());

render(new FilterView(filters), siteTripControlElement);

boardPresenter.init();
