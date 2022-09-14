import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now'
};

const createListEmptyTemplate = (filterType) => {
  const NoPointsTextValue = NoPointsTextType[filterType];

  return (
    `<p class="trip-events__msg">
    ${NoPointsTextValue}
    </p>`
  );
};

export default class ListEmptyView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createListEmptyTemplate(this.#filterType);
  }
}
