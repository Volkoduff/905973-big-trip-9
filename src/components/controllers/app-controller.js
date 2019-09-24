import {TripController} from './../controllers/trip-controller';
import {AbstractComponent} from './../abstract-conponent';
import {Statistics} from './../stats';
import {NavigationMenu} from './../navigation-menu';
import {Filter} from './../filter';
import {render} from './../utils';
import {API} from "../api";
import {ModelEvent} from "../model-event";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;

export class AppController extends AbstractComponent {
  constructor(tripEventsContainer, controlsContainer) {
    super();
    this.controlsContainer = controlsContainer;
    this.tripEventsContainer = tripEventsContainer;
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {
    this.infoContainer = document.querySelector(`.trip-main__trip-info`);
    this.tripController = new TripController(this.tripEventsContainer, this.infoContainer, this._onDataChange);

    this.api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

    this.api.getDestinations()
      .then((destinations) => {
        this.destinations = destinations;
      });
    this.api.getOffers()
      .then((offers) => {
        this.offers = offers;
      });
    this.api.getEvents()
      .then((events) => this.tripController.setEvents(events, this.destinations, this.offers))
      .then(() => this.tripController.renderNewEvent(this.destinations, this.offers));

    this._navigationMenu = new NavigationMenu();

    [...this._navigationMenu.getElement().children]
      .forEach((tripTab) => tripTab.addEventListener(`click`, (evt) => this._onClickMenuSwitch(evt)));
    render(this.controlsContainer, this._navigationMenu.getElement());

    this._filter = new Filter();
    const filterElements = this._filter.getElement().querySelectorAll(`.trip-filters__filter`);
    filterElements.forEach((el) => el.addEventListener(`click`, (evt) => {
      this._onClickFilterSwitch(evt);
    }));
    render(this.controlsContainer, this._filter.getElement());

    this._statistics = new Statistics();
    render(this.tripEventsContainer, this._statistics.getElement(), `afterend`);
    this._statistics.hide();
  }

  _onDataChange(newData, oldData) {
    this._currentEvents = this.tripController.getEvents();

    if (!Array.isArray(this._currentEvents)) {
      this.index = 1;
    } else {
      this.index = this._currentEvents.findIndex((event) => event === oldData);
    }
    if (newData === null && this.index !== -1) {
      this.api.deleteEvent({
        id: oldData.id
      })
        .then(() => this.api.getEvents())
          .then((events) => this.tripController.setEvents(events, this.destinations, this.offers));
    } else if (oldData === null) {
      this.api.createEvent({
        data: ModelEvent.toRAW(newData)
      })
        .then(() => this.api.getEvents())
          .then((events) => this.tripController.setEvents(events, this.destinations, this.offers));
    } else {
      this.api.updateEvent({
        id: newData.id,
        data: ModelEvent.toRAW(newData)
      })
        .then(() => this.api.getEvents())
          .then((events) => this.tripController.setEvents(events, this.destinations, this.offers));
    }
  }

  _onClickMenuSwitch(evt) {
    if (evt.target.tagName !== `A` && evt.target.tagName !== `Button`) {
      return;
    }
    switch (evt.target.textContent) {
      case `Stats`:
        evt.target.previousElementSibling.classList.remove(`trip-tabs__btn--active`);
        evt.target.classList.add(`trip-tabs__btn--active`);
        this.tripController.hide();
        this._statistics.show();
        this._statistics.createCharts(this.tripController.getEvents());
        break;
      case `Table`:
        evt.target.nextElementSibling.classList.remove(`trip-tabs__btn--active`);
        evt.target.classList.add(`trip-tabs__btn--active`);
        this.tripController.show();
        this._statistics.hide();
        break;
      case `New event`:
      // debugger
      // this.tripController.show();
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
        this.tripController.renderTrip();
        break;
      case `future`:
        this.tripController.renderFilteredFutureEvents();
        break;
      case `past`:
        this.tripController.renderFilteredPastEvents();
        break;
    }
  }
}
