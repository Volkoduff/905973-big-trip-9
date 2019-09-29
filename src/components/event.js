import {AbstractComponent} from './abstract-component';
import moment from "moment";
import {getDuration, EventToPretext} from './utils';

const AMOUNT_OF_DISPLAYED_OFFERS = 3;

export class Event extends AbstractComponent {
  constructor({event, startTime, endTime, price, offers, destination}) {
    super();
    this._event = event;
    this._startTime = startTime;
    this._endTime = endTime;
    this._price = price;
    this._offers = offers;
    this._destination = destination;
  }

  getTemplate() {
    return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${this._event}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${EventToPretext[this._event]} ${this._destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${moment(this._startTime).format(`DD.MM.YYYY HH:mm`)}">${moment(this._startTime).format(`HH:mm`)}</time>
          &mdash;
          <time class="event__end-time" datetime="${moment(this._endTime).format(`DD.MM.YYYY HH:mm`)}">${moment(this._endTime).format(`HH:mm`)}</time>
        </p>
        <p class="event__duration">${getDuration(this._startTime, this._endTime)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${this._price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${this._offers
        .filter((offer) => offer.accepted === true)
        .map((offer) => `<li class="event__offer">
                  <span class="event__offer-title">${offer.title}</span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                 </li>`).slice(0, AMOUNT_OF_DISPLAYED_OFFERS).join(``)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
  }
}
