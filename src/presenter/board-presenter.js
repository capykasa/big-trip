import { render } from '../render.js';
import TripEditView from '../view/trip-edit-view.js';
import TripEventsListView from '../view/trip-events-list.js';
import TripPointView from '../view/trip-point.js';
import TripSortView from '../view/trip-sort-view.js';

export default class BoardPresenter {
  tripEventsListComponent = new TripEventsListView();

  init = (boardContainer) => {
    this.boardContainer = boardContainer;

    render(new TripSortView(), this.boardContainer);

    render(this.tripEventsListComponent, this.boardContainer);
    render(new TripEditView(), this.tripEventsListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new TripPointView(), this.tripEventsListComponent.getElement());
    }
  };
}
