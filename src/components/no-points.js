import {AbstractComponent} from './abstract-conponent';

export class NoPoints extends AbstractComponent {
  getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
}
