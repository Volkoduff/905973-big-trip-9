import {AbstractComponent} from './abstract-conponent';

export class EventDetailsDescriptionTitle extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `<h3 class="event__section-title  event__section-title--destination">Destination</h3>`;
  }
}
