import { render } from '../render.js';
import TripEditView from '../view/trip-edit-view.js';
import TripEventsListView from '../view/trip-events-list.js';
import TripPointView from '../view/trip-point.js';
import TripSortView from '../view/trip-sort-view.js';

export default class BoardPresenter {
  tripEventsListComponent = new TripEventsListView();

  init = (boardContainer, pointsModel) => {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
    this.boardPoints = [...this.pointsModel.getPoints()];
    this.boardDestination = [...this.pointsModel.getDestination()];
    this.boardOffers = [...this.pointsModel.getOffers()];

    render(new TripSortView(), this.boardContainer);

    render(this.tripEventsListComponent, this.boardContainer);
    render(new TripEditView(), this.tripEventsListComponent.getElement());

    for (let i = 0; i < this.boardPoints.length; i++) {
      const destination = this.destination.find(
        (item) => item.id === this.boardPoints[i].destination
      );
      const offers = this.offers.filter(
        (item) => this.boardPoints[i].offers.some((offerId) => offerId === item.id)
      );

      render(new TripPointView(this.boardPoints[i], destination, offers), this.tripEventsListComponent.getElement());
    }
  };
}
