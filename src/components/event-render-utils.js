import {AbstractComponent} from './abstract-component';
import {EventIcon} from './event-icon';
import {EventPlaceholder} from './event-placeholder';
import {EventOffers} from './event-offers';
import {EventDetailsWrap} from './event-details-wrap';
import {EventOffersWrap} from './event-offers-wrap';
import {EventDetailsOffersTitle} from './event-details-offers-title';
import {DestinationDescription} from './destination-description';
// import {EventDetailsDescriptionTitle} from './event-details-description-title';
import {render, unrender} from './utils';

// const capitalizeFirstLetter = (word) => word[0].toUpperCase() + word.slice(1);

export class EventRenderUtils extends AbstractComponent {
  constructor() {
    super();
    // this._eventDetailsDescriptionTitle = new EventDetailsDescriptionTitle();
    this._eventDetailsWrap = new EventDetailsWrap();
    this._eventOffersWrap = new EventOffersWrap();
    this._eventDetailsOffersTitle = new EventDetailsOffersTitle();

  }

  capitalizeFirstLetter(word) {
    return word[0].toUpperCase() + word.slice(1);
  }

  onClickChangeEventType(evt, context) {
    this._events = context;
    this._renameInputValuesAccordingCheckedCheckbox(evt);
    this._renderIcon();
    this._renderPlaceholder();
    this._renderOffers();
  }

  _markCheckedCheckbox(evt) {

    [...this._events.getElement().querySelectorAll(`.event__type-input`)]
      .forEach((input) => {
        input.checked = false;
      });
    evt.target.checked = true;
  }

  _renameInputValuesAccordingCheckedCheckbox(evt) {
    this._markCheckedCheckbox(evt);
    this._event = evt.target.value;
    this._events.getElement().querySelector(`.event__type-toggle`).value = this._event;
  }

  _renderIcon() {
    const iconWrap = this._events.getElement().querySelector(`.event__type`);
    unrender(iconWrap.querySelector(`.event__type-icon`));
    const eventIcon = new EventIcon(this._event);
    render(iconWrap, eventIcon.getElement());
  }

  _renderOffers() {
    this._offersWrap = this._events.getElement().querySelector(`.event__section--offers`);
    this._newOffers = new EventOffers(this._event, this._events);
    if (this._offersWrap) {
      this._reRenderOffers();
    } else {
      this._renderOffersInNewWrap();
    }
  }

  _reRenderOffers() {
    const currentOffers = this._offersWrap.querySelector(`.event__available-offers`);
    unrender(currentOffers);
    render(this._offersWrap, this._newOffers.getElement());
  }

  _renderDetailsWrap() {
    const headerSection = this._events.getElement().querySelector(`.event__header`);
    render(headerSection, this._eventDetailsWrap.getElement(), `afterend`);
  }

  _renderOffersInNewWrap() {
    this._renderDetailsWrap();
    render(this._eventDetailsWrap.getElement(), this._eventOffersWrap.getElement());
    render(this._eventOffersWrap.getElement(), this._eventDetailsOffersTitle.getElement());
    this._newOffers = new EventOffers(this._event, this._events);
    render(this._eventDetailsOffersTitle.getElement(), this._newOffers.getElement(), `afterend`);
  }

  _renderPlaceholder() {
    const placeholderWrap = this._events.getElement().querySelector(`.event__field-group`);
    unrender(placeholderWrap.querySelector(`.event__label`));
    const eventPlaceholder = new EventPlaceholder(this._event, this._events);
    render(placeholderWrap, eventPlaceholder.getElement(), `afterbegin`);
  }

  _renderDescription(event) {
    const descriptionWrap = event.getElement().querySelector(`.event__section--destination`);
    if (descriptionWrap) {
      unrender(event.getElement().querySelector(`.event__section-title--destination`));
      unrender(event.getElement().querySelector(`.event__destination-description`));
      const description = new DestinationDescription(event._description, this._destination).getElement();
      render(descriptionWrap, description, `afterbegin`);
    } else {
      this._renderDetailsWrap();
      const description = new DestinationDescription(event._description, this._destination).getElement();
      render(this._eventDetailsWrap.getElement(), description);
    }
  }

  _onChangeDestination(evt, event) {
    this._destination = evt.target.value;
    this._renderDescription(event);
  }
}
