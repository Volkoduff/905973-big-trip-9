import {AbstractComponent} from './abstract-conponent';

export class EventDetailsOffersTitle extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `<h3 class="event__section-title  event__section-title--offers">Offers</h3>`;
  }
}
