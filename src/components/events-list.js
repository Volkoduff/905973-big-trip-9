import {AbstractComponent} from './abstract-conponent';

export class EventsList extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-events__list"></ul>`;
  }
}
