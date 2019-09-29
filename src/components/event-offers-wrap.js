import {AbstractComponent} from './abstract-component';

export class EventOffersWrap extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="event__section  event__section--offers"></section>`;
  }
}
