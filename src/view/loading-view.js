import AbstractView from '../framework/view/abstract-view.js';

const createNoTaskTemplate = () => (
  `<div class="trip-events__msg">
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>`
);

export default class LoadingView extends AbstractView {
  get template() {
    return createNoTaskTemplate();
  }
}
