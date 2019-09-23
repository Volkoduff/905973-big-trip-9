import {AbstractComponent} from './abstract-conponent';

export class EventOffers extends AbstractComponent {
  constructor(event, allOffers, index) {
    super();
    this._event = event;
    this.allOffers = allOffers;
    this._id = index;
  }

  getTemplate() {
    return `<section class="event__section  event__section--offers">
<h3 class="event__section-title  event__section-title--offers">Offers</h3>
<div class="event__available-offers">
      ${this.allOffers
            .filter((offerObjects) => offerObjects.type === this._event)
            .map((offersObject) => offersObject.offers
              .map((offer) => `<div class="event__offer-selector">
                    <input class="event__offer-checkbox
                    visually-hidden"
                    id="event-offer-${offer.name}-${this._id}" type="checkbox" name="event-offer-${offer.name}" ${offer.isChecked ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-${offer.name}-${this._id}">
      <span class="event__offer-title">${offer.name}</span>
      +
      €&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
      </div>`).join(``))}</section>`;
  }
}
