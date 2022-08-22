import TripFilterView from './view/trip-filter-view.js';
import { render } from './render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteTripControlElement = siteHeaderElement.querySelector('.trip-controls__filters');

const siteMainElement = document.querySelector('.page-main');
const siteTripBoardElement = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter(siteTripBoardElement, pointsModel);

render(new TripFilterView(), siteTripControlElement);

boardPresenter.init();
