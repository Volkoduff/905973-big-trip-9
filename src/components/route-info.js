import {AbstractComponent} from './abstract-conponent';

export class RouteInfo extends AbstractComponent {
  constructor(dataArray) {
    super();
    this._dataArray = dataArray;
  }
  _getDates() {
    const keys = [];
    for (let key of this._dataArray.keys()) {
      keys.push(key);
    }
    return keys;
  }
  _getDestinations() {
    this._destinations = [];
    for (let events of this._dataArray.values()) {
      events.forEach((event) => this._destinations.push(event.destination));
    }
    return [...new Set(this._destinations)];
  }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">
    ${this._getDestinations().length < 3 ?
    this._getDestinations().reduce((a, b) => a.concat(` &mdash; ${b}`)) :
    this._getDestinations().slice(0, 1).concat(` &mdash; ... &mdash; `)
        .concat(this._getDestinations().slice(-1)).join(``)}
      </h1>
    <p class="trip-info__dates">
    ${this._getDates().length > 1 ? `${Math.min(...this._getDates())}&nbsp;—&nbsp;${(Math.max(...this._getDates()))}` : this._getDates()}
      
    </p>
  </div>`;
  }
}
