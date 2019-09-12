import {AbstractComponent} from './abstract-conponent';

export class EventPlaceholder extends AbstractComponent {
  constructor(event, {_destination, _eventComparator, _destinationComparator, _index}) {
    super();
    this._event = event;
    this._destination = _destination;
    this._eventComparator = _eventComparator;
    this._destinationComparator = _destinationComparator;
    this._id = _index;
  }

  getTemplate() {
    return `<label class="event__label  event__type-output" for="event-destination-${this._id} ${this._destinationComparator(this._event) ? this._destinationComparator(this._event) : this._destination}" list="destination-list-${this._id}">
           ${this._event !== `sightseeing` ? this._eventComparator(this._event) : this._destinationComparator(this._event)}
          </label>`;
  }
}
