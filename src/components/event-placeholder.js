import {AbstractComponent} from './abstract-conponent';
import {EventToPretext} from './event-edit';

export class EventPlaceholder extends AbstractComponent {
  constructor(event, index) {
    super();
    this._event = event;
    this._id = index;
  }

  getTemplate() {
    return `<label class="event__label  event__type-output" for="event-destination-${this._id} ${EventToPretext[this._event]}">
           ${EventToPretext[this._event]}
          </label>`;
  }
}
