import {AbstractComponent} from './abstract-conponent';

export class EventDetailsWrap extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="event__details"></section>`;
  }
}
