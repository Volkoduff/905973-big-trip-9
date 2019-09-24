import {DaysList} from './../days-list';
import {EventsList} from './../events-list';
import {Day} from './../day';
import {RouteInfo} from './../route-info';
import {Sort} from './../sort';
import {DefaultEvent} from './../default-event';
import {NoPoints} from './../no-points';
import {PointController, Mode} from "./point-controller";
import {SortController} from "./sort-controller";
import {render, unrender} from './../utils';
import moment from "moment";

const NO_DATES = `no-dates`;
export const RenderSortMode = {
  DEFAULT: `default`,
  DURATION: `duration-sorted`,
  PRICE: `price-sorted`,
};

export class TripController {
  constructor(container, infoContainer, onDataChange) {
    this._container = container;
    this._infoContainer = infoContainer;
    this._sort = new Sort();
    this._daysList = new DaysList();
    this._eventsList = new EventsList();
    this._subscriptions = [];
    this._noPoints = new NoPoints();
    this._onDataChange = onDataChange;
    this._onChangeView = this._onChangeView.bind(this);
    this._dayIndex = null;
    this._eventsPerDayMap = null;
  }

  renderTrip(mode = RenderSortMode.DEFAULT) {
    this._reRenderSort();
    this._reRenderDayList();
    switch (mode) {
      case RenderSortMode.DEFAULT:

        this._renderEventsInTheirDays();
        break;
      case RenderSortMode.DURATION:
        this._renderDurationSorted();
    }
    this._dayIndex = null;
  }

  setEvents(events, destinations, offers) {
    this._destinations = destinations;
    this._events = events;
    this._offers = offers;
    this._getDataToTheProperMapStructure();
    this.renderTrip(this._currentSort);
    this._renderHeaderComponents();
  }

  renderFilteredFutureEvents() {
    this._reRenderSort();
    this._reRenderDayList();
    this._renderDayContainer();
    this._sortController = new SortController(this._sort, this._eventsPerDayMap);
    this._sortController.getFilteredFutureEvents()
      .forEach((event) => this._renderEvent(event, this._day, this._destinations, this._offers));
    render(this._day, this._eventsList);
  }

  renderFilteredPastEvents() {
    this._reRenderSort();
    this._reRenderDayList();
    this._renderDayContainer();
    this._sortController = new SortController(this._sort, this._eventsPerDayMap);
    this._sortController.getFilteredFinishedEvents()
      .forEach((event) => this._renderEvent(event, this._day, this._destinations, this._offers));
    render(this._day, this._eventsList);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

  getEvents() {
    return this._events;
  }

  renderNewEvent(destinations, allOffers) {
    let event = DefaultEvent.getDefaultEvent(this._events, destinations, allOffers);
    this.pointController = new PointController(this._container, event, this._onDataChange, this._onChangeView, this._eventsList, this._sort, this.onDeleteCheck.bind(this), Mode.ADD_NEW, destinations, this._offers);
    this._subscriptions.push(this.pointController.setDefaultView.bind(this.pointController));
  }

  _renderHeaderComponents() {
    if (this._routeInfo) {
      unrender(this._routeInfo.getElement());
      this._routeInfo.removeElement();
    }
    this._renderRouteInfo();
  }

  _renderEventsInTheirDays() {
    for (let date of this._eventsPerDayMap.keys()) {
      this._dayIndex++;
      this._day = new Day(date, this._dayIndex).getElement(); // создаем новый день и передаем ему ключ(дату)
      render(this._daysList.getElement(), this._day);
      this._eventsList = new EventsList().getElement();
      this._eventsPerDayMap.get(date).forEach((event) => {
        this._renderEvent(event, this._day, this._destinations, this._offers);
      });
      render(this._day, this._eventsList);
    }
  }

  _renderRouteInfo() {
    this._routeInfo = new RouteInfo(this._eventsPerDayMap);
    render(this._infoContainer, this._routeInfo.getElement(), `afterbegin`);
  }

  _renderDayContainer() {
    this.condition = NO_DATES;
    this._day = new Day(this.condition).getElement();
    this._eventsList = new EventsList().getElement();
    render(this._container, this._daysList.getElement());
    render(this._daysList.getElement(), this._day);
  }

  _onSortClick(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    unrender(this._daysList.getElement());
    this._daysList.removeElement();
    this._sortController = new SortController(this._sort, this._eventsPerDayMap);
    switch (evt.target.dataset.sortType) {
      case `by-event`:
        this.renderTrip();
        break;
      case `by-time`:
        this._currentSort = RenderSortMode.DURATION;
        this.renderTrip(this._currentSort);
        break;
      case `by-price`:
        this._renderPriceSorted();
        break;
    }
  }
  _renderPriceSorted() {
    this._currentSort = RenderSortMode.PRICE;
    this._renderDayContainer();
    this._sortController.getSortedByPriceEvents()
      .forEach((event) => this._renderEvent(event, this._day, this._destinations, this._offers));
    render(this._day, this._eventsList);
  }
  _renderDurationSorted() {
    this._currentSort = RenderSortMode.DURATION;
    this._renderDayContainer();
    this._sortController.getSortedByDurationEvents()
      .forEach((event) => this._renderEvent(event, this._day, this._destinations, this._offers));
    render(this._day, this._eventsList);
  }

  onDeleteCheck() {
    if (!this._events.length) {
      render(this._container, this._noPoints.getElement(this._events));
      unrender(this._sort.getElement());
      this._areEventsEmpty = true;
    }
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _renderEvent(event, container, destinations, allOffers) {
    this.pointController = new PointController(container, event, this._onDataChange, this._onChangeView, this._eventsList, this._sort, this.onDeleteCheck.bind(this), Mode.DEFAULT, destinations, allOffers);
    this._subscriptions.push(this.pointController.setDefaultView.bind(this.pointController));
  }

  // Обработка данных в Мапу НАЧАЛОСЬ
  _getDataToTheProperMapStructure() {
    this._eventsPerDayMap = new Map();
    this._getUniqueSortedDates().forEach((date) => this._eventsPerDayMap
      .set(date, this._getMapFilledProperValues(date)));
  }
  _getUniqueSortedDates() {
    const sortedTime = this._events
      .sort((a, b) => a.startTime - b.startTime)
      .map((obj) => moment(obj.startTime).format(`MMM DD`));
    return [...new Set(sortedTime)];
  }
  _getMapFilledProperValues(key) {
    const properEvents = [];
    this._events.forEach((event) => {
      if (this._getDate(key) === this._getDate(event.startTime)) {
        properEvents.push(event);
      }
    });
    return properEvents;
  }
  _getDate(ms) {
    return new Date(ms).getDate();
  }
  // Обработка данных в Мапу ЗАКОНЧИЛОСЬ

  _renderSort() {
    this._sort = new Sort();
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));
    render(this._container, this._sort.getElement());
  }

  _reRenderSort() {
    unrender(this._sort.getElement());
    this._sort.removeElement();
    this._renderSort();
  }

  _reRenderDayList() {
    this._unRenderDayList();
    render(this._container, this._daysList.getElement());
  }

  _unRenderDayList() {
    unrender(this._daysList.getElement());
    this._daysList.removeElement();
  }
}
