import {AbstractComponent} from './abstract-conponent';

export class EventPlaceholder extends AbstractComponent {
  constructor(event, destination, eventComparator, destinationComparator, index) {
    super();
    this._event = event;
    this._destination = destination;
    this._eventComparator = eventComparator;
    this._destinationComparator = destinationComparator;
    this._id = index;
  }

  getTemplate() {
    return `<label class="event__label  event__type-output" for="event-destination-${this._id} ${this._destinationComparator(this._event) ? this._destinationComparator(this._event) : this._destination}" list="destination-list-${this._id}">
           ${this._event !== `sightseeing` ? this._eventComparator(this._event) : this._destinationComparator(this._event)}
          </label>`;
  }
}
