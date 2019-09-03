import {AbstractComponent} from './abstract-conponent';

export class DestinationDescription extends AbstractComponent {
  constructor(description, destination) {
    super();
    this._description = description;
    this._destination = destination;
  }

  getTemplate() {
    return `<div><h3 class="event__section-title  event__section-title--destination">Destination</h3><p class="event__destination-description">${this._description
      .filter((el) => el.destination === this._destination)
      .map((el) => el.description)}</p></div>`;
  }
}
