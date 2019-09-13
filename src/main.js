import {AppController} from './components/controllers/app-controller';

const controlsContainer = document.querySelector(`.trip-main__trip-controls`);
const infoContainer = document.querySelector(`.trip-main__trip-info`);
const tripEventsContainer = document.querySelector(`.trip-events`);

const appController = new AppController(infoContainer, tripEventsContainer, controlsContainer);
appController.init();
