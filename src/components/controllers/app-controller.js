import {TripController} from './../controllers/trip-controller';
import {AbstractComponent} from './../abstract-conponent';
import {Statistics} from './../stats';
import {NavigationMenu} from './../navigation-menu';
import {Filter} from './../filter';
import {filterData, menuData} from './../data';
import {render, unrender} from './../utils';
import {API} from "../api";
import {ModelEvent} from "../model-event";


const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;

export class AppController extends AbstractComponent {
  constructor(tripEventsContainer, controlsContainer) {
    super();
    this._controlsContainer = controlsContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {
    this.infoContainer = document.querySelector(`.trip-main__trip-info`);
    this._tripController = new TripController(this._tripEventsContainer, this.infoContainer, this._onDataChange);

    this.api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

    this.api.getDestinations()
      .then((destinations) => {
        this._destinations = destinations;
      });
    this.api.getOffers()
      .then((destinations) => {
        this._offers = destinations;
      });
    this.api.getEvents()
      .then((events) => this._tripController.setEvents(events, this._destinations, this._offers))
      .then(() => this._tripController.renderNewEvent(this._destinations));

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

  _onDataChange(newData, oldData) {
    const index = this._tripController.getEvents().findIndex((event) => event === oldData);
    if (newData === null && index !== -1) {
      this.api.deleteEvent({
        id: oldData.id
      })
        .then(() => this.api.getEvents())
          .then((events) => this._tripController.setEvents(events, this._destinations, this._offers));
    } else if (oldData === null) {
      this.api.createEvent({
        // id: newData.id,
        data: ModelEvent.toRAW(newData)
      })
        .then(() => this.api.getEvents()
          .then((events) => this._tripController.setEvents(events, this._destinations, this._offers)));
    } else {
      this.api.updateEvent({
        id: newData.id,
        data: ModelEvent.toRAW(newData)
      })
        .then(() => this.api.getEvents()
          .then((events) => this._tripController.setEvents(events, this._destinations, this._offers)));
    }

    // Возможно настало время перенести сорт в отдельный контроллер
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
        this._tripController.renderTrip();
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
