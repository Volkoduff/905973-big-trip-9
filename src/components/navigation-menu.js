import {AbstractComponent} from './abstract-conponent';

export class NavigationMenu extends AbstractComponent {
  constructor(menu) {
    super();
    this._menu = menu;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
  ${this._menu.names.map((name, index) =>
    `<a class="trip-tabs__btn ${index === 0 ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`).join(``)}
  </nav>`;
  }
}
