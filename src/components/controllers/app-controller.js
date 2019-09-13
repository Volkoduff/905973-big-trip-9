import {TripController} from './../controllers/trip-controller';
import {AbstractComponent} from './../abstract-conponent';
import {Statistics} from './../stats';
import {NavigationMenu} from './../navigation-menu';
import {Filter} from './../filter';
import {routePointData, filterData, menuData} from './../data';
import {render} from './../utils';

export class AppController extends AbstractComponent {
  constructor(infoContainer, tripEventsContainer, controlsContainer) {
    super();
    this._controlsContainer = controlsContainer;
    this._tripController = new TripController(tripEventsContainer, routePointData(), infoContainer);
    this._tripEventsContainer = tripEventsContainer;
  }

  init() {
    this._tripController.init();
    this._navigationMenu = new NavigationMenu(menuData);
    this._filter = new Filter(filterData);
    render(this._controlsContainer, this._navigationMenu.getElement());
    render(this._controlsContainer, this._filter.getElement());

    this._statistics = new Statistics();
    render(this._tripEventsContainer, this._statistics.getElement(), `afterend`);
    this._statistics.hide();

    [...this._navigationMenu.getElement().children]
      .forEach((tripTab) => tripTab.addEventListener(`click`, (evt) => this._onClickTabOpen(evt)));
  }

  _onClickTabOpen(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    switch (evt.target.textContent) {
      case `Stats`:
        evt.target.previousElementSibling.classList.remove(`trip-tabs__btn--active`);
        evt.target.classList.add(`trip-tabs__btn--active`);
        this._tripController.hide();
        this._statistics.show();
        break;
      case `Table`:
        evt.target.nextElementSibling.classList.remove(`trip-tabs__btn--active`);
        evt.target.classList.add(`trip-tabs__btn--active`);
        this._tripController.show();
        this._statistics.hide();
    }
  }

}
