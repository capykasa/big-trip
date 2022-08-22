import { render } from '../render.js';
import TripEditView from '../view/trip-edit-view.js';
import TripEventsListView from '../view/trip-events-list.js';
import TripPointView from '../view/trip-point.js';
import TripSortView from '../view/trip-sort-view.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #tripEventsListComponent = new TripEventsListView();

  #boardPoints = [];
  #boardDestination = [];
  #boardOffers = [];

  init = (boardContainer, pointsModel) => {
    this.#boardContainer = boardContainer;

    this.#pointsModel = pointsModel;
    this.#boardPoints = [...this.#pointsModel.points];
    this.#boardDestination = [...this.#pointsModel.destination];
    this.#boardOffers = [...this.#pointsModel.offers];

    render(new TripSortView(), this.#boardContainer);

    render(this.#tripEventsListComponent, this.#boardContainer);
    render(new TripEditView(), this.#tripEventsListComponent.element);

    for (let i = 1; i < this.#boardPoints.length; i++) {
      const destination = this.#boardDestination.find(
        (item) => item.id === this.#boardPoints[i].destination
      );
      const offers = this.#boardOffers.filter(
        (item) => this.#boardPoints[i].offers.some((offerId) => offerId === item.id)
      );

      render(new TripPointView(this.#boardPoints[i], destination, offers), this.#tripEventsListComponent.element);
    }
  };
}
