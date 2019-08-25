import {AbstractComponent} from './abstract-conponent';

export class DaysList extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}
