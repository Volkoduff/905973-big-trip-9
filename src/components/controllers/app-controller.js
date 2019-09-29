import {TripController} from './../controllers/trip-controller';
import {AbstractComponent} from '../abstract-component';
import {Statistics} from './../stats';
import {NavigationMenu} from './../navigation-menu';
import {Filter} from './../filter';
import {render, Action, ButtonText, Position} from './../utils';
import {API} from "../api";
import {ModelEvent} from "../model-event";

const FilterName = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

const MenuTab = {
  EVENT_POINTS_TABLE: `Table`,
  STATISTICS: `Stats`
};

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;
const controlsContainer = document.querySelector(`.trip-main__trip-controls`);
const tripEventsContainer = document.querySelector(`.trip-events`);

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

let allDestinations;
let allOffers;

export class AppController extends AbstractComponent {
  constructor() {
    super();
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {
    this.tripController = new TripController(tripEventsContainer, this._onDataChange);
    api.getDestinations()
      .then((destinations) => {
        allDestinations = destinations;
      });
    api.getOffers()
      .then((offers) => {
        allOffers = offers;
      });
    api.getEvents()
      .then((events) => this.tripController.setEvents(events));

    this._renderNavigation();
    this._renderFilters();
    this._renderStatistics();
  }

  _renderStatistics() {
    this._statistics = new Statistics();
    render(tripEventsContainer, this._statistics.getElement(), Position.AFTER);
    this._statistics.hide();
  }

  _renderFilters() {
    this._filter = new Filter();
    const filterElements = this._filter.getElement().querySelectorAll(`.trip-filters__filter`);
    filterElements.forEach((filterElement) => filterElement.addEventListener(`click`, (evt) => this._onClickFilterSwitch(evt)));
    this._setDefaultFilterActive();
    render(controlsContainer, this._filter.getElement());
  }
  _setDefaultFilterActive() {
    this._filter.getElement().querySelector(`#filter-everything`).checked = true;
  }
  _renderNavigation() {
    this._navigationMenu = new NavigationMenu();
    [...this._navigationMenu.getElement().children]
      .forEach((tripTab) => tripTab.addEventListener(`click`, (evt) => this._onClickMenuSwitch(evt)));
    render(controlsContainer, this._navigationMenu.getElement());
  }

  _onDataChange(actionType, events, element) {
    switch (actionType) {
      case Action.UPDATE:
        element.lock();
        element.changeSaveButtonText(ButtonText.SAVING);
        api.updateEvent({
          id: events.id,
          data: ModelEvent.toRAW(events),
        }).then(() => api.getEvents())
          .then((data) => this.tripController.setEvents(data))
          .catch(() => {
            element.unLock();
            element.shake();
            element.changeSaveButtonText(ButtonText.SAVE);
          });
        break;
      case Action.DELETE:
        element.lock();
        element.changeDeleteButtonText(ButtonText.DELETING);
        api.deleteEvent({
          id: events.id,
        }).then(() => api.getEvents())
          .then((data) => this.tripController.setEvents(data))
          .catch(() => {
            element.unLock();
            element.shake();
            element.changeDeleteButtonText(ButtonText.DELETE);
          });
        break;
      case Action.CREATE:
        element.lock();
        element.changeSaveButtonText(ButtonText.SAVING);
        api.createEvent({
          data: ModelEvent.toRAW(events),
        }).then(() => element.stopCreatingNewEvent())
          .then(() => api.getEvents())
          .then((data) => this.tripController.setEvents(data))
          .catch(() => {
            element.unLock();
            element.shake();
            element.changeSaveButtonText(ButtonText.SAVE);
          });
    }
  }

  _onClickMenuSwitch(evt) {
    if (evt.target.tagName !== `A` && evt.target.tagName !== `Button`) {
      return;
    }
    switch (evt.target.textContent) {
      case MenuTab.STATISTICS:
        this._activateTab(MenuTab.STATISTICS);
        this.tripController.hide();
        this._statistics.show();
        this._statistics.createCharts(this.tripController.getEvents());
        break;
      case MenuTab.EVENT_POINTS_TABLE:
        this._activateTab(MenuTab.EVENT_POINTS_TABLE);
        this.tripController.show();
        this._statistics.hide();
        break;
    }
  }

  _activateTab(tabTitle) {
    this._navigationMenu.getElement().querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);
    const menuTabs = this._navigationMenu.getElement().querySelectorAll(`.trip-tabs__btn`);
    menuTabs[[...menuTabs].findIndex((tab) => tab.textContent === tabTitle)].classList.add(`trip-tabs__btn--active`);
  }

  _onClickFilterSwitch(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    this._statistics.hide();
    this.tripController.show();
    this._activateTab(MenuTab.EVENT_POINTS_TABLE);
    switch (evt.target.textContent) {
      case FilterName.EVERYTHING:
        this.tripController.renderTrip();
        break;
      case FilterName.FUTURE:
        this.tripController.renderFilteredFutureEvents();
        break;
      case FilterName.PAST:
        this.tripController.renderFilteredPastEvents();
        break;
    }
  }
}
export {allDestinations, allOffers};
