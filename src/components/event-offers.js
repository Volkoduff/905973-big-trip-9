import {AbstractComponent} from './abstract-conponent';

export class EventOffers extends AbstractComponent {
  constructor(event, {_offers, _index}) {
    super();
    this._event = event;
    this._offers = _offers;
    this._id = _index;
  }

  getTemplate() {
    return `<div class="event__available-offers">
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
      </div>`).join(``))}`;
  }
}
