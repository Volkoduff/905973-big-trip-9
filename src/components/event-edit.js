import {AbstractComponent} from './abstract-conponent';
import {EventIcon} from './event-icon';
import {EventPlaceholder} from './event-placeholder';
import {EventOffers} from './event-offers';
import {DestinationDescription} from './destination-description';
import {render, unrender, capitalizeFirstLetter} from './utils';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import moment from "moment";

const TRANSFER_EVENTS = [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`];
const ACTIVITY_EVENTS = [`check-in`, `restaurant`, `sightseeing`];

export const EventToPretext = {
  'bus': `Bus to`,
  'check-in': `Check-in in`,
  'drive': `Drive to`,
  'flight': `Flight to`,
  'restaurant': `Restaurant in`,
  'ship': `Ship to`,
  'sightseeing': `Sightseeing in`,
  'taxi': `Taxi to`,
  'train': `Train to`,
  'transport': `Transport to`,
  'trip': `Trip to`,
};

export class EventEdit extends AbstractComponent {
  constructor({event, startTime, endTime, price, destination, offers, id, isFavorite}, container, destinations, allOffers) {
    super();
    this._event = event;
    // this._container = container;
    this._destination = destination;
    this._offers = offers;
    this._startTime = startTime;
    this._endTime = endTime;
    this._price = price;
    this._id = id;
    this._allOffers = allOffers;
    this._destinations = destinations;
    this._isFavorite = isFavorite;
    this._isEventCreating = false;
    this.init();
  }

  init() {
    const startInput = this.getElement().querySelector(`input[name="event-start-time"]`);
    let startFlatpickr = flatpickr(startInput, {
      allowInput: false,
      defaultDate: this._event.dueDate,
      enableTime: true,
      minuteIncrement: 1,
      dateFormat: `d.m.Y H:i`, // Формат входящей даты
      // eslint-disable-next-line camelcase
      time_24hr: true,
      onChange(selectedDates, dateStr) {
        endFlatpickr.set(`minDate`, dateStr);
      },
    });

    const endInput = this.getElement().querySelector(`input[name="event-end-time"]`);
    let endFlatpickr = flatpickr(endInput, {
      allowInput: false,
      defaultDate: this._event.dueDate,
      enableTime: true,
      minuteIncrement: 1,
      dateFormat: `d.m.Y H:i`, // Формат входящей даты
      // eslint-disable-next-line camelcase
      time_24hr: true,
      onChange(selectedDates, dateStr) {
        startFlatpickr.set(`maxDate`, dateStr);
      },
    });
  }

  onClickRenderEvent() {
    if (!this._isEventCreating) {
      this._isEventCreating = true;
      if (!this.newForm) {
        this._createNewEventForm();
      } else {
        EventEdit.show(this.newForm);
      }
      this._disableAddNewButton();
    }
  }
  _disableAddNewButton() {
    const addNewButton = document.querySelector(`.trip-main__event-add-btn`);
    addNewButton.disabled = true;
  }
  _unDisableAddNewButton() {
    const addNewButton = document.querySelector(`.trip-main__event-add-btn`);
    addNewButton.disabled = false;
  }
  _createNewEventForm() {
    this._container = document.querySelector(`.trip-events__trip-sort`);
    this.newForm = this.getElement().querySelector(`form`);
    this._displayAsNewEvent();
    this.newForm.classList.add(`trip-events__item`);
    render(this._container, this.newForm, `afterend`);
  }

  _transformDeleteButton() {
    const deleteButton = this.getElement().querySelector(`.event__reset-btn`);
    deleteButton.textContent = `Cancel`;
    deleteButton.addEventListener(`click`, (evt) => this.cancelNewEvent(evt));
  }

  onClickChangeEventType(evt, mode) {
    this._getProperContext(mode);
    this._setNewValueToForm(evt);
    this._renderIcon();
    this._renderPlaceholder();
    this._renderOffers();
  }

  onchangeDestination(evt, mode) {
    this._getProperContext(mode);
    this._destination = this._destinations
      .filter((destination) => destination.name === evt.target.value)[0];
    this._renderDescription();
  }

  cancelNewEvent(evt) {
    evt.preventDefault();
    this._isEventCreating = false;
    this._hideNewEventDetails();
    EventEdit.hide(this.newForm);
    this._unDisableAddNewButton();
  }

  _hideNewEventDetails() {
    const eventDetails = this.newForm.querySelector(`.event__details`);
    eventDetails.classList.add(`visually-hidden`);
    const eventTypeButton = this.newForm.querySelector(`.event__type-btn`);
    eventTypeButton.addEventListener(`click`, () => EventEdit.show(eventDetails));
  }

  _displayAsNewEvent() {
    const toggleButton = this.getElement().querySelector(`.event__rollup-btn`);
    if (toggleButton !== null) {
      unrender(toggleButton);
      this._transformDeleteButton();
      const favoriteButton = this.getElement().querySelector(`.event__favorite-btn`);
      favoriteButton.classList.add(`visually-hidden`);
      this._hideNewEventDetails();
    }
  }

  static show(element) {
    element.classList.remove(`visually-hidden`);
  }
  static hide(element) {
    element.classList.add(`visually-hidden`);
  }

  _getProperContext(mode) {
    if (mode === `add-new`) {
      this._form = this.newForm;
    } else {
      this._form = this.getElement();
    }
  }
  _setNewValueToForm(evt) {
    this._markCheckedCheckbox(evt);
    this._event = evt.target.value;
    this._form.querySelector(`.event__type-toggle`).value = this._event;
  }
  _markCheckedCheckbox(evt) {
    [...this._form.querySelectorAll(`.event__type-input`)]
      .forEach((input) => {
        input.checked = false;
      });
    evt.target.checked = true;
  }
  _renderIcon() {
    const iconWrap = this._form.querySelector(`.event__type`);
    unrender(iconWrap.querySelector(`.event__type-icon`));
    const eventIcon = new EventIcon(this._event);
    render(iconWrap, eventIcon.getElement());
  }
  _renderOffers() {
    const offersWrap = this._form.querySelector(`.event__section--offers`);
    unrender(offersWrap);
    const detailsSection = this._form.querySelector(`.event__details`);
    if (this._event !== `transport` && this._event !== `sightseeing`) {
      const offers = new EventOffers(this._event, this._allOffers, this._id);
      render(detailsSection, offers.getElement(), `afterbegin`);
    }
  }
  _renderPlaceholder() {
    const placeholderWrap = this._form.querySelector(`.event__field-group`);
    unrender(placeholderWrap.querySelector(`.event__label`));
    const eventPlaceholder = new EventPlaceholder(this._event, this._id);
    render(placeholderWrap, eventPlaceholder.getElement(), `afterbegin`);
  }
  _renderDescription() {
    const detailsSection = this._form.querySelector(`.event__details`);
    const descriptionSection = this._form.querySelector(`.event__section--destination`);
    unrender(descriptionSection);
    const description = new DestinationDescription(this._destination);
    render(detailsSection, description.getElement());
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
              ${TRANSFER_EVENTS.map((transferEvent) => `<div class="event__type-item">
                  <input id="event-type-${transferEvent}-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${transferEvent.toLowerCase()}"
                  ${transferEvent === this._event ? `checked` : ``} >
                  <label class="event__type-label  event__type-label--${transferEvent}" for="event-type-${transferEvent}-${this._id}">${capitalizeFirstLetter(transferEvent)}</label>
                </div>`).join(``)}
            </fieldset>
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${ACTIVITY_EVENTS.map((activityEvent) => `<div class="event__type-item">
                  <input id="event-type-${activityEvent}-${this._id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${activityEvent.toLowerCase()}"
                  ${activityEvent === this._event ? `checked` : ``} >
                  <label class="event__type-label  event__type-label--${activityEvent}" for="event-type-${activityEvent}-${this._id}">${capitalizeFirstLetter(activityEvent)}</label>
                </div>`).join(``)}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${this._id} ${this._event}" list="destination-list-${this._id}">
           ${EventToPretext[this._event]}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${this._id}"
           type="text" name="event-destination"
           list="destination-list-${this._id}"
           value="${this._destination.name}">
          <datalist id="destination-list-${this._id}">
          ${this._destinations.map((destination) => `<option value="${destination.name}"></option>`).join(``)}
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
           value="${moment(this._startTime).format(`DD.MM.YYYY HH:mm`)}">
          —
          <label class="visually-hidden" for="event-end-time-${this._id}">
            To
          </label>
          <input class="event__input  event__input--time"
          id="event-end-time-${this._id}"
          type="text"
          name="event-end-time"
          value="${moment(this._endTime).format(`DD.MM.YYYY HH:mm`)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${this._id}">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-${this._id}" type="number" name="event-price" value="${this._price}">
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
        .map((offer) => `<div class="event__offer-selector">
              <input class="event__offer-checkbox
              visually-hidden"
              id="event-offer-${offer.title}-${this._id}" type="checkbox" name="event-offer-${offer.title}" ${offer.accepted ? `checked` : ``}>
<label class="event__offer-label" for="event-offer-${offer.title}-${this._id}">
  <span class="event__offer-title">${offer.title}</span>
  +
  €&nbsp;<span class="event__offer-price">${offer.price}</span>
  </label>
  </div>`).join(``)}
        </section>` : ``}
          <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${this._destination.description}</p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${this._destination.pictures ? Array.from(this._destination.pictures).map((picture) => `<img class="event__photo" src="${picture.src}"  alt="${picture.description}">`).join(``) : ``}
            
            </div>
          </div>
        </section>
          
      </section>
    </form>
  </li>`;
  }
}
