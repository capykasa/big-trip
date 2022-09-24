import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { isFuturePoint } from '../utils/point.js';

const createFilterItemTemplate = (filter, currentFilterType, points) => {
  const { type, name } = filter;

  const futurePoints = points.filter((point) => isFuturePoint(point.dateTo));

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${name}"
        class="trip-filters__filter-input
        visually-hidden" type="radio"
        name="trip-filter"
        value="${type}"
        ${type === currentFilterType ? 'checked' : ''}
        ${type === FilterType.EVERYTHING ? `${points.length === 0 ? 'disabled' : ''}` : `${futurePoints.length === 0 ? 'disabled' : ''}`}
      >
      <label
        class="trip-filters__filter-label"
        for="filter-${name}"
      >
        ${name}
      </label>
    </div>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType, points) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType, points))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #points = null;

  constructor(filters, currentFilterType, points) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#points = points;
  }


  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter, this.#points);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}
