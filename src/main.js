import AppController from './components/controllers/app-controller';

const appController = new AppController();
appController.init();

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  AppController.syncTasks();
});
