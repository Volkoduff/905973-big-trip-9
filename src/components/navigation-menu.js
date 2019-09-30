const MENU_NAMES = [`Table`, `Stats`];
import AbstractComponent from './abstract-component';

export default class NavigationMenu extends AbstractComponent {
  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
  ${MENU_NAMES.map((name, index) =>
    `<a class="trip-tabs__btn ${index === 0 ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`).join(``)}
  </nav>`;
  }
}
