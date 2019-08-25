import {getMenuTemplate} from './components/menu';
import {getFilterTemplate} from './components/filter';
import {getRouteInfoTemplate} from './components/route-info';
import {TripController} from './components/controllers/trip-controller';
import {routePointData, filterData, menuData} from './components/data';

const renderMenu = (container, objects) => {
  container.insertAdjacentHTML(`afterend`, getMenuTemplate(objects));
};

const renderFilter = (container, objects) => {
  container.insertAdjacentHTML(`beforeend`, getFilterTemplate(objects));
};

const renderInfo = (container, objects) => {
  container.insertAdjacentHTML(`afterbegin`, getRouteInfoTemplate(objects));
};

const controlsContainer = document.querySelector(`.trip-main__trip-controls`);
const elementBeforeMenu = controlsContainer.querySelector(`h2`);
renderMenu(elementBeforeMenu, menuData);
renderFilter(controlsContainer, filterData);

const infoContainer = document.querySelector(`.trip-main__trip-info`);
renderInfo(infoContainer, routePointData());

const tripEventsContainer = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsContainer, routePointData());
tripController.init();

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
