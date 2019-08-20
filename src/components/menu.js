export const getMenuTemplate = (menu) =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  ${menu.names.map((name, index) =>
    `<a class="trip-tabs__btn ${index === 0 ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`).join(``)}
  </nav>`;
