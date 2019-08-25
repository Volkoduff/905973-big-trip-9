import {AbstractComponent} from './abstract-conponent';

const getDateTime = (ms) => Array.from(new Date(ms).toTimeString()).slice(0, 5).join(``);
const getHourDifference = (start, end) => new Date(start - end).getHours();
const getMinuteDifference = (start, end) => new Date(start - end).getMinutes();

export class Event extends AbstractComponent {
  constructor({event, startTime, endTime, price, offers, destination, eventComparator, destinationComparator}, index) {
    super();
    this._event = event;
    this._startTime = startTime;
    this._endTime = endTime;
    this._price = price;
    this._offers = offers;
    this._destination = destination;
    this._eventComparator = eventComparator;
    this._destinationComparator = destinationComparator;
    this._element = null;
    this._id = index;
  }

  getTemplate() {
    return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${this._event}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${this._eventComparator(this._event)
        .concat(` ${this._destinationComparator(this._event) !== undefined ? this._destinationComparator(this._event) : this._destination}`)}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${getDateTime(this._startTime)}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${getDateTime(this._endTime)}</time>
        </p>
        <p class="event__duration">${getHourDifference(this._startTime, this._endTime)}H ${getMinuteDifference(this._startTime, this._endTime)}M</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${this._price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${this._offers.map((offer) => `<li class="event__offer">
                  <span class="event__offer-title">${offer.name}</span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                 </li>`).join(``)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
  }
}
