import AbstractComponent from './abstract-component';

export default class RouteInfo extends AbstractComponent {
  constructor(dataArray) {
    super();
    this._dataArray = dataArray;
    this._init();
  }

  _init() {
    this._getMoneySumToMarkup();
    this._getDestinations();
  }

  _getMoneySumToMarkup() {
    const mainPrices = document.querySelectorAll(`.event__price-value`);
    const offerPrices = document.querySelectorAll(`.event__offer-price`);
    const totalMoneyAmountElement = document.querySelector(`.trip-info__cost-value`);
    totalMoneyAmountElement.textContent = this._getSumOfTextContent(mainPrices) + this._getSumOfTextContent(offerPrices);
  }

  _getSumOfTextContent(elementsList) {
    let result = 0;
    if (elementsList.length) {
      result = elementsList.length > 1 ? Array.from(elementsList).map((el) => parseFloat(el.textContent))
        .reduce((accumulator, a) => accumulator + a) : parseFloat(elementsList[0].textContent);
    }
    return result;
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
      if (events.length > 1) {
        events.forEach((event) => this._destinations.push(event.destination.name));
      } else if (events.length) {
        this._destinations.push(events[0].destination.name);
      }
    }
  }

  _renderDestinationInConditions() {
    let result = ``;
    if (!this._destinations.length) {
      return result;
    }
    if (this._destinations.length === 1) {
      result = this._destinations;
    } else if (this._destinations.length < 3) {
      result = this._destinations.reduce((a, b) => a.concat(` &mdash; ${b}`));
    } else {
      result = this._destinations.slice(0, 1).concat(` &mdash; ... &mdash; `)
        .concat(this._destinations.slice(-1)).join(``);
    }
    return result;
  }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">
    ${this._renderDestinationInConditions()}
      </h1>
    <p class="trip-info__dates">
    ${this._getDates().length > 1 ? `${this._getDates().shift()}&nbsp;—&nbsp;${this._getDates().pop()}` : this._getDates()}
      
    </p>
  </div>`;
  }
}
