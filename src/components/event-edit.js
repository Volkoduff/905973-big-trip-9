import {AbstractComponent} from './abstract-conponent';
import {EventRenderUtils} from './event-render-utils';
import {NoPoints} from "./no-points";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import moment from "moment";

const capitalizeFirstLetter = (word) => word[0].toUpperCase() + word.slice(1);

export class EventEdit extends AbstractComponent {
  constructor({event, photos, startTime, endTime, price, offers, destination, destinationOptions, description, eventComparator, destinationComparator, transferEvents, activityEvents, isFavorite}, index, container, sort) {
    super();
    this._noPoints = new NoPoints();
    this._event = event;
    this._sort = sort;
    this._container = container;
    this._photos = photos;
    this._startTime = startTime;
    this._endTime = endTime;
    this._destinationOptions = destinationOptions;
    this._price = price;
    this._description = description;
    this._offers = offers;
    this._destination = destination;
    this._eventComparator = eventComparator;
    this._destinationComparator = destinationComparator;
    this._transferEvents = transferEvents;
    this._activityEvents = activityEvents;
    this._isFavorite = isFavorite;
    this._id = index;
    this._eventRenderUtils = new EventRenderUtils();
    this.init();
  }

  onClickTypeChange(evt, context) {
    this._eventRenderUtils.onClickChangeEventType(evt, context);
  }

  onChangeDestinationChange(evt, context) {
    this._eventRenderUtils._onChangeDestination(evt, context);
  }

  // _markCheckedCheckbox(evt) {
  //   [...this.getElement().querySelectorAll(`.event__type-input`)]
  //     .forEach((input) => {
  //       input.checked = false;
  //     });
  //   evt.target.checked = true;
  // }
  // _renameInputValuesAccordingCheckedCheckbox(evt) {
  //   this._markCheckedCheckbox(evt);
  //   this._event = evt.target.value;
  //   this.getElement().querySelector(`.event__type-toggle`).value = this._event;
  // }
  //
  // _renderIcon() {
  //   const iconWrap = this.getElement().querySelector(`.event__type`);
  //   unrender(iconWrap.querySelector(`.event__type-icon`));
  //   const eventIcon = new EventIcon(this._event);
  //   render(iconWrap, eventIcon.getElement());
  // }
  // _renderOffers() {
  //   const offersWrap = this.getElement().querySelector(`.event__section`);
  //   unrender(offersWrap.querySelector(`.event__available-offers`));
  //   const offers = new EventOffers(this._offers, this._event, this._id);
  //   render(offersWrap, offers.getElement());
  // }
  // _renderPlaceholder() {
  //   const placeholderWrap = this.getElement().querySelector(`.event__field-group`);
  //   unrender(placeholderWrap.querySelector(`.event__label`));
  //   const eventPlaceholder = new EventPlaceholder(this._event, this._destination, this._eventComparator, this._destinationComparator, this._id);
  //   render(placeholderWrap, eventPlaceholder.getElement(), `afterbegin`);
  // }
  // _renderDescription() {
  //   const descriptionWrap = this.getElement().querySelector(`.event__section--destination`);
  //   unrender(this.getElement().querySelector(`.event__section-title--destination`));
  //   unrender(this.getElement().querySelector(`.event__destination-description`));
  //   const description = new DestinationDescription(this._description, this._destination).getElement();
  //   render(descriptionWrap, description, `afterbegin`);
  // }
  // onClickChangeEventType(evt) {
  //   this._renameInputValuesAccordingCheckedCheckbox(evt);
  //   this._renderIcon();
  //   this._renderPlaceholder();
  //   this._renderOffers();
  // }
  //
  // _onchangeDestination(evt) {
  //   this._destination = evt.target.value;
  //   this._renderDescription();
  // }


  init() {
    [...this.getElement().querySelectorAll(`.event__input--time`)]
      .forEach((input) => flatpickr(input, {
        altInput: true,
        altFormat: `d.j.Y H:i`,
        allowInput: false,
        defaultDate: this._event.dueDate,
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        minuteIncrement: 1,
        dateFormat: `Y-m-d H:i`, // Формат входящей даты
      }));
  }

  getTemplate() {
    return `<li class="trip-events__item">
    <form class="event  event--edit" action="#" method="post">
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
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-${this._id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-${this._id}">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
          ${this._offers.length > 0 ? `<section class="event__section  event__section--offers">
<h3 class="event__section-title  event__section-title--offers">Offers</h3>
<div class="event__available-offers">
${this._offers
      .filter((offer) => offer.type === this._event)
      .map((el) => el.offers
        .map((offer) => `<div class="event__offer-selector">
              <input class="event__offer-checkbox
              visually-hidden"
              id="event-offer-${offer.id(offer.name)}-${this._id}" type="checkbox" name="event-offer-${offer.id(offer.name)}" ${offer.isChecked ? `checked` : ``}>
<label class="event__offer-label" for="event-offer-${offer.id(offer.name)}-${this._id}">
  <span class="event__offer-title">${offer.name}</span>
  +
  €&nbsp;<span class="event__offer-price">${offer.price}</span>
  </label>
  </div>`).join(``))}
        </section>` : ``}
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${this._description
      .filter((el) => el.destination === this._destination)
      .map((el) => el.description)}</p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${Array.from(this._photos).map(() => `<img class="event__photo" src="http://picsum.photos/300/150?r=${Math.random()}" alt="Event photo">`).join(``)}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`;
  }
}
