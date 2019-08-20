import {getMenuTemplate} from './components/menu';
import {getFilterTemplate} from './components/filter';
import {getrouteInfoTemplate} from './components/route-info';
import {getSortTemplate} from './components/sort';
import {getEventEditTemplate} from './components/event-edit';
import {getEventWrapTemplate} from './components/event-wrap';
import {getEventTemplate} from './components/event';
import {getRoutePointData, routePointData, filterData, menuData} from './components/data';

const TaskConst = {
  EDIT_ROUTE: 1,
};

const renderTemplate = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const renderRouteEditPoint = (container, data) => {
  container.insertAdjacentHTML(`beforeend`, data
    .slice(0, TaskConst.EDIT_ROUTE)
    .map(getEventEditTemplate)
    .join(``));
};

const renderRoutePoints = (container, data) => {
  container.insertAdjacentHTML(`beforeend`, data
    .slice(TaskConst.EDIT_ROUTE)
    .map(getEventTemplate)
    .join(``));
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
  container.insertAdjacentHTML(`afterbegin`, getrouteInfoTemplate(data));
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
renderRouteEditPoint(eventWrap, routePointData());
renderRoutePoints(eventWrap, routePointData());

const getSummOfTextContent = (elementsList) => Array.from(elementsList)
  .map((el) => el.textContent).reduce((a, b) => {
    return parseFloat(a) + parseFloat(b);
  });

const getMoneySummToMarkup = () => {
  const mainPrices = document.querySelectorAll(`.event__price-value`);
  const offerPrices = document.querySelectorAll(`.event__offer-price`);
  const totalmoneyAmountElement = document.querySelector(`.trip-info__cost-value`);
  totalmoneyAmountElement.textContent = getSummOfTextContent(mainPrices) + getSummOfTextContent(offerPrices);
};

getMoneySummToMarkup();
