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
    this.routePointData = routePointData();
    this._controlsContainer = controlsContainer;
    this._tripController = new TripController(tripEventsContainer, this.routePointData, infoContainer);
    this._tripEventsContainer = tripEventsContainer;
  }

  init() {
    this._tripController.init();
    this._navigationMenu = new NavigationMenu(menuData);

    [...this._navigationMenu.getElement().children]
      .forEach((tripTab) => tripTab.addEventListener(`click`, (evt) => this._onClickMenuSwitch(evt)));
    render(this._controlsContainer, this._navigationMenu.getElement());

    this._filter = new Filter(filterData);
    const filterElements = this._filter.getElement().querySelectorAll(`.trip-filters__filter`);
    filterElements.forEach((el) => el.addEventListener(`click`, (evt) => {
      this._onClickFilterSwitch(evt);
    }));
    render(this._controlsContainer, this._filter.getElement());


    this._statistics = new Statistics();
    render(this._tripEventsContainer, this._statistics.getElement(), `afterend`);
    this._statistics.hide();

  }

  _onClickMenuSwitch(evt) {
    if (evt.target.tagName !== `A` && evt.target.tagName !== `Button`) {
      return;
    }
    switch (evt.target.textContent) {
      case `Stats`:
        evt.target.previousElementSibling.classList.remove(`trip-tabs__btn--active`);
        evt.target.classList.add(`trip-tabs__btn--active`);
        this._tripController.hide();
        this._statistics.show();
        this._statistics.createCharts(this._tripController.getEvents());
        break;
      case `Table`:
        evt.target.nextElementSibling.classList.remove(`trip-tabs__btn--active`);
        evt.target.classList.add(`trip-tabs__btn--active`);
        this._tripController.show();
        this._statistics.hide();
        break;
      case `New event`:
      // debugger
      // this._tripController.show();
      // this._statistics.hide();
      // break;
    }
  }

  _onClickFilterSwitch(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    switch (evt.target.textContent) {
      case `everything`:
        this._tripController.renderEvents();
        break;
      case `future`:
        this._tripController.renderFilteredFutureEvents();
        break;
      case `past`:
        this._tripController.renderFilteredPastEvents();
        break;
    }
  }
}