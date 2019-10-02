import {render, Action, ButtonText, Position, FilterName, MenuTab} from './../utils';
import TripController from './../controllers/trip-controller';
import AbstractComponent from '../abstract-component';
import Statistics from './../stats';
import NavigationMenu from './../navigation-menu';
import Filter from './../filter';
import API from '../api';
import ModelEvent from "../model-event";
import Models from '../Models';
import Provider from '../provider';
import Store from '../store';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;
const controlsContainer = document.querySelector(`.trip-main__trip-controls`);
const tripEventsContainer = document.querySelector(`.trip-events`);

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({storage: localStorage});
const provider = new Provider({api, store});

export default class AppController extends AbstractComponent {
  constructor() {
    super();
    this.onDataChange = this.onDataChange.bind(this);
  }

  init() {
    this.tripController = new TripController(tripEventsContainer, this.onDataChange);
    this.tripController.renderLoadingPlug();
    this.models = new Models();
    provider.getDestinations()
      .then((destinations) => {
        this.models.destinations = destinations;
      })
      .then(() => provider.getOffers()
        .then((offers) => {
          this.models.offers = offers;
        }))
      .then(() => provider.getEvents()
        .then((events) => this.tripController.setEvents(events, this.models))
        .then(() => this.tripController.unRenderLoadingPlug())
        .then(() => this._renderTrip()));
  }

  onDataChange(actionType, events, element) {
    this._setDefaultFilterActive();
    switch (actionType) {
      case Action.UPDATE:
        element.lock();
        element.changeSaveButtonText(ButtonText.SAVING);
        provider.updateEvent({
          id: events.id,
          data: ModelEvent.toRAW(events),
        }).then(() => provider.getEvents())
          .then((data) => this.tripController.setEvents(data, this.models))
          .catch(() => {
            element.unLock();
            element.shake();
            element.changeSaveButtonText(ButtonText.SAVE);
          });
        break;
      case Action.DELETE:
        element.lock();
        element.changeDeleteButtonText(ButtonText.DELETING);
        provider.deleteEvent({
          id: events.id,
        }).then(() => provider.getEvents())
          .then((data) => this.tripController.setEvents(data, this.models))
          .catch(() => {
            element.unLock();
            element.shake();
            element.changeDeleteButtonText(ButtonText.DELETE);
          });
        break;
      case Action.CREATE:
        element.lock();
        element.changeSaveButtonText(ButtonText.SAVING);
        provider.createEvent({
          data: ModelEvent.toRAW(events),
        }).then(() => element.stopCreatingNewEvent())
          .then(() => provider.getEvents())
          .then((data) => this.tripController.setEvents(data, this.models))
          .catch(() => {
            element.unLock();
            element.shake();
            element.changeSaveButtonText(ButtonText.SAVE);
          });
    }
  }

  _renderTrip() {
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

  _activateTab(tabTitle) {
    this._navigationMenu.getElement().querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);
    const menuTabs = this._navigationMenu.getElement().querySelectorAll(`.trip-tabs__btn`);
    menuTabs[[...menuTabs].findIndex((tab) => tab.textContent === tabTitle)].classList.add(`trip-tabs__btn--active`);
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
        this.tripController.renderFilteredEvents(FilterName.FUTURE);
        break;
      case FilterName.PAST:
        this.tripController.renderFilteredEvents(FilterName.PAST);
        break;
    }
  }

  static syncTasks() {
    provider.syncEvents();
  }
}
