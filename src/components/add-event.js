import {AbstractComponent} from './abstract-conponent';
import {EventRenderUtils} from './event-render-utils';
import {render, unrender} from './utils';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import moment from "moment";

const capitalizeFirstLetter = (word) => word[0].toUpperCase() + word.slice(1);

export class AddEvent extends AbstractComponent {
  constructor({transferEvents, activityEvents, description, destinationOptions, destinationComparator, eventComparator, id, offers, photos}) {
    super();
    this._transferEvents = transferEvents;
    this._event = `bus`;
    this._photos = photos;
    this._offers = offers;
    this._description = description;
    this._activityEvents = activityEvents;
    this._destinationComparator = destinationComparator;
    this._eventComparator = eventComparator;
    this._destinationOptions = destinationOptions;
    this._destination = ``;
    this._eventRenderUtils = new EventRenderUtils();
    this._price = 0;
    this._id = id;
    this.init();
  }

  init() {
    [...this.getElement().querySelectorAll(`.event__input--time`)]
      .forEach((input) => flatpickr(input, {
        altInput: true,
        altFormat: `d.j.Y H:i`,
        allowInput: false,
        // defaultDate: this.dueDate,
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        minuteIncrement: 1,
        dateFormat: `Y-m-d H:i`, // Формат входящей даты
      }));
  }

  onClickTypeChange(evt, context) {
    this._eventRenderUtils.onClickChangeEventType(evt, context);
  }

  onChangeDestinationChange(evt, context) {
    this._eventRenderUtils._onChangeDestination(evt, context);
  }

  createNewEvent(container) {
    document.querySelector(`.trip-main__event-add-btn`)
      .addEventListener(`click`, () => {
        if (this.getElement()) {
          render(container.getElement(), this.getElement(), `beforebegin`);
        }
      });
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        unrender(this.getElement());
      });
  }

  getTemplate() {
    return `<form class="trip-events__item  event  event--edit" action="#" method="post">
           <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${this._id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${this._event}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${this._id}" name="event-type" value="${this._event}" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${this._transferEvents.map((transferEvent) => `<div class="event__type-item">
                  <input id="event-type-${transferEvent}-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${transferEvent.toLowerCase()}"
                  ${transferEvent === this._event ? `checked` : ``} >
                  <label class="event__type-label  event__type-label--${transferEvent}" for="event-type-${transferEvent}-${this._id}">${capitalizeFirstLetter(transferEvent)}</label>
                </div>`).join(``)}
            </fieldset>
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${this._activityEvents.map((activityEvent) => `<div class="event__type-item">
                  <input id="event-type-${activityEvent}-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${activityEvent.toLowerCase()}"
                  ${activityEvent === this._event ? `checked` : ``} >
                  <label class="event__type-label  event__type-label--${activityEvent}" for="event-type-${activityEvent}-${this._id}">${capitalizeFirstLetter(activityEvent)}</label>
                </div>`).join(``)}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${this._id} ${this._destinationComparator(this._event) ? this._destinationComparator(this._event) : this._destination}" list="destination-list-${this._id}">
           ${this._event !== `sightseeing` ? this._eventComparator(this._event) : this._destinationComparator(this._event)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${this._id}"
           type="text" name="event-destination"
           list="destination-list-${this._id}"
           value="${this._destination}">
          <datalist id="destination-list-${this._id}">
          ${this._destinationOptions.map((option) => `<option value="${option}"></option>`).join(``)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${this._id}">
            From
          </label>
          <input class="event__input
            event__input--time"
           id="event-start-time-${this._id}" type="text"
          name="event-start-time"
           value="${moment(this._startTime).format(`YYYY-MM-DD HH:mm`)}">
          —
          <label class="visually-hidden" for="event-end-time-${this._id}">
            To
          </label>
          <input class="event__input  event__input--time"
          id="event-end-time-${this._id}"
          type="text"
          name="event-end-time"
          value="${moment(this._endTime).format(`YYYY-MM-DD HH:mm`)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${this._id}">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-${this._id}" type="text" name="event-price" value="${this._price}">
        </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Cancel</button>
            </header>
          </form>`;
  }
}
