import { render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import NewTripPointButtonView from './view/new-trip-point-button-view.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic er82e23rdsafsd212qw';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const siteHeaderElement = document.querySelector('.page-header');
const siteTripControlElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteTripMainElement = siteHeaderElement.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const siteTripBoardElement = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const newTripPointButtonComponent = new NewTripPointButtonView();

const boardPresenter = new BoardPresenter(
  siteTripBoardElement,
  pointsModel,
  filterModel,
);
const filterPresenter = new FilterPresenter(
  siteTripControlElement,
  filterModel,
);

const handleNewTripPointFormClose = () => {
  newTripPointButtonComponent.element.disabled = false;
};

const handleNewTripPointButtonClick = () => {
  boardPresenter.createPoint(handleNewTripPointFormClose);
  newTripPointButtonComponent.element.disabled = true;
};

filterPresenter.init();
boardPresenter.init();
pointsModel.init()
  .then(() => {
    render(newTripPointButtonComponent, siteTripMainElement);
    newTripPointButtonComponent.setClickHandler(handleNewTripPointButtonClick);
  });
