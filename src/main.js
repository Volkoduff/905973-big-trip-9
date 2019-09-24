import {AppController} from './components/controllers/app-controller';

const controlsContainer = document.querySelector(`.trip-main__trip-controls`);
const tripEventsContainer = document.querySelector(`.trip-events`);

const appController = new AppController(tripEventsContainer, controlsContainer);
appController.init();
