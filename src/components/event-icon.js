import {AbstractComponent} from './abstract-conponent';

export class EventIcon extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }
  getTemplate() {
    return `<img class="event__type-icon" width="17" height="17" src="img/icons/${this._event}.png" alt="Event type icon">`;
  }
}
