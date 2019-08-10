import {getMenuTemplate} from './components/menu';
import {getFilterTemplate} from './components/filter';
import {getrouteInfoTemplate} from './components/route-info';
import {getSortTemplate} from './components/sort';
import {getEventEditTemplate} from './components/event-edit';
import {getEventWrapTemplate} from './components/event-wrap';
import {getEventTemplate} from './components/event';

const renderTemplate = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const controlsContainer = document.querySelector(`.trip-main__trip-controls`);
const elementBeforeMenu = controlsContainer.querySelector(`h2`);
renderTemplate(elementBeforeMenu, getMenuTemplate(), `afterend`);
renderTemplate(controlsContainer, getFilterTemplate());

const infoContainer = document.querySelector(`.trip-main__trip-info`);
renderTemplate(infoContainer, getrouteInfoTemplate(), `afterbegin`);

const tripEventsContainer = document.querySelector(`.trip-events`);
renderTemplate(tripEventsContainer, getSortTemplate());
renderTemplate(tripEventsContainer, getEventEditTemplate());

const editEventElement = document.querySelector(`.event--edit`);
renderTemplate(editEventElement, getEventWrapTemplate(), `afterend`);

const eventWrap = document.querySelector(`.trip-events__list`);
for (let i = 0; i <= 2; i++) {
  renderTemplate(eventWrap, getEventTemplate());
}
