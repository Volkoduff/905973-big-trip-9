import {getMenuTemplate} from './components/menu';
import {getFilterTemplate} from './components/filter';
import {getRouteInfoTemplate} from './components/route-info';
import {getSortTemplate} from './components/sort';
import {getEventWrapTemplate} from './components/event-wrap';
import {EventEdit} from './components/event-edit';
import {Event} from './components/event';
import {render, deleteElement} from './components/utils';
import {getRoutePointData, routePointData, filterData, menuData} from './components/data';

const renderTemplate = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const renderWrapEventTemplate = (container, data) => {
  container.insertAdjacentHTML(`beforeend`, getEventWrapTemplate(data));
};

const renderMenu = (container, data) => {
  container.insertAdjacentHTML(`afterend`, getMenuTemplate(data));
};

const renderFilter = (container, data) => {
  container.insertAdjacentHTML(`beforeend`, getFilterTemplate(data));
};

const renderInfo = (container, data) => {
  container.insertAdjacentHTML(`afterbegin`, getRouteInfoTemplate(data));
};

const controlsContainer = document.querySelector(`.trip-main__trip-controls`);
const elementBeforeMenu = controlsContainer.querySelector(`h2`);
renderMenu(elementBeforeMenu, menuData);
renderFilter(controlsContainer, filterData);

const infoContainer = document.querySelector(`.trip-main__trip-info`);
renderInfo(infoContainer, routePointData());

const tripEventsContainer = document.querySelector(`.trip-events`);
renderTemplate(tripEventsContainer, getSortTemplate());
renderWrapEventTemplate(tripEventsContainer, getRoutePointData());

const eventWrap = document.querySelector(`.trip-events__list`);
const renderRoutePoint = (routPointData, index) => {
  const event = new Event(routPointData);
  const eventEdit = new EventEdit(routPointData, index);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape`) {
      eventWrap.replaceChild(event.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventEdit.getElement()
  .querySelector(`.event__input`)
  .addEventListener(`focus`, () => {
    removeEventListener(`keydown`, onEscKeyDown);
  });

  eventEdit.getElement()
  .querySelector(`.event__input`)
  .addEventListener(`blur`, () => {
    addEventListener(`keydown`, onEscKeyDown);
  });

  eventEdit.getElement()
  .querySelector(`.event__reset-btn`)
  .addEventListener(`click`, () => {
    // removeEventListener(`keydown`, onEscKeyDown);
    deleteElement(eventEdit.getElement());
    eventEdit.removeElement();
  });

  event.getElement()
  .querySelector(`.event__rollup-btn`)
  .addEventListener(`click`, () => {
    eventWrap.replaceChild(eventEdit.getElement(), event.getElement());
    addEventListener(`keydown`, onEscKeyDown);
  });

  eventEdit.getElement()
  .querySelector(`.event__rollup-btn`)
  .addEventListener(`click`, () => {
    eventWrap.replaceChild(event.getElement(), eventEdit.getElement());
    removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventWrap, event.getElement(index), `beforeend`);
};

routePointData().forEach((routPoint, it) => renderRoutePoint(routPoint, it));

const getSummOfTextContent = (elementsList) => elementsList.length > 1 ? Array.from(elementsList)
.map((el) => parseFloat(el.textContent))
.reduce((accumulator, a) => accumulator + a) : parseFloat(elementsList.textContent);

const getMoneySummToMarkup = () => {
  const mainPrices = document.querySelectorAll(`.event__price-value`);
  const offerPrices = document.querySelectorAll(`.event__offer-price`);
  const totalmoneyAmountElement = document.querySelector(`.trip-info__cost-value`);
  totalmoneyAmountElement.textContent = getSummOfTextContent(mainPrices) + getSummOfTextContent(offerPrices);
};

getMoneySummToMarkup();
