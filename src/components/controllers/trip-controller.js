import {render, unrender, RenderSortMode, Mode, Position, FilterName} from './../utils';
import DaysList from './../days-list';
import EventsList from './../events-list';
import Day from './../day';
import RouteInfo from './../route-info';
import Sort from './../sort';
import NoPoints from './../no-points';
import PointController from "./point-controller";
import SortController from "./sort-controller";
import moment from "moment";

const NO_DATES = `no-dates`;
const infoContainer = document.querySelector(`.trip-main__trip-info`);
const addNewEventButton = document.querySelector(`.trip-main__event-add-btn`);

export default class TripController {
  constructor(container, onDataChange) {
    this._container = container;
    this._sort = new Sort();
    this._daysList = new DaysList();
    this._eventsList = new EventsList();
    this._subscriptions = [];
    this._noPoints = new NoPoints();
    this._onDataChange = onDataChange;
    this._onChangeView = this._onChangeView.bind(this);
    this._dayIndex = null;
    this._eventsPerDayMap = null;
    this._areEventsEmpty = false;
    addNewEventButton.addEventListener(`click`, () => {
      this._getDefaultEvent();
    });
  }

  setEvents(events, models) {
    this._events = events;
    this._models = models;
    this._subscriptions = [];
    this._getDataMap();
    this._renderCurrentSorting();
  }

  renderTrip() {
    if (!this._areEventsEmpty) {
      unrender(this._noPoints.getElement());
      this._noPoints.removeElement();
      this._reRenderSort();
    }
    this._reRenderDayList();
    this._renderEventsInTheirDays();
    this._renderHeaderComponents();
    this._dayIndex = null;
    this._areEventsEmpty = false;
  }

  renderFilteredEvents(filterType) {
    let filteredEvents;
    this._sortController = new SortController(this._sort, this._eventsPerDayMap);
    this._reRenderSort();
    this._reRenderDayList();
    this._renderDayContainer();
    switch (filterType) {
      case FilterName.FUTURE:
        filteredEvents = this._sortController.getFilteredFutureEvents();
        break;
      case FilterName.PAST:
        filteredEvents = this._sortController.getFilteredFinishedEvents();
        break;
    }
    filteredEvents.forEach((event) => this._renderEvent(event, this._day));
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

  onDeleteCheck() {
    if (this._events.length <= 1) {
      unrender(this._sort.getElement());
      this._sort.removeElement();
      render(this._container, this._noPoints.getElement());
      this._areEventsEmpty = true;
    }
  }

  renderLoadingPlug() {
    const loadingMessageMarkup = `<p class="trip-events__msg">Loading...</p>`;
    this._container.insertAdjacentHTML(Position.BEGIN, loadingMessageMarkup);
  }

  unRenderLoadingPlug() {
    this._container.querySelector(`.trip-events__msg`).remove();
  }

  _getDefaultEvent() {
    const defaultEvent = {
      destination: ``,
      offers: this._models.offers[this._models.offers.findIndex((offers) => offers.type === `bus`)].offers,
      startTime: moment().format(),
      endTime: moment().format(),
      price: ``,
      event: `bus`,
    };
    this._creatingCard = new PointController(this._container, defaultEvent, this._onDataChange, this._onChangeView, this._eventsList, this._sort, this.onDeleteCheck.bind(this), Mode.ADD_NEW, this._models);
    this._onChangeView();
  }

  _renderEvent(event, container) {
    this.pointController = new PointController(container, event, this._onDataChange, this._onChangeView, this._eventsList, this._sort, this.onDeleteCheck.bind(this), Mode.DEFAULT, this._models);
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
      this._day = new Day(date, this._dayIndex).getElement();
      render(this._daysList.getElement(), this._day);
      this._eventsList = new EventsList().getElement();
      const dataPoints = this._eventsPerDayMap.get(date);
      if (Array.isArray(dataPoints)) {
        dataPoints.forEach((event) => this._renderEvent(event, this._day));
      } else {
        this._renderEvent(dataPoints, this._day);
      }
      render(this._day, this._eventsList);
    }
  }

  _renderRouteInfo() {
    this._routeInfo = new RouteInfo(this._eventsPerDayMap);
    render(infoContainer, this._routeInfo.getElement(), Position.BEGIN);
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
    this._unRenderDayList();
    this._renderCurrentSorting(evt.target.dataset.sortType);
  }

  _renderCurrentSorting(mode = RenderSortMode.DEFAULT) {
    switch (mode) {
      case RenderSortMode.DEFAULT:
        this.renderTrip();
        break;
      case RenderSortMode.DURATION:
        this._reRenderDayList();
        this._renderDurationSorted();
        this._renderHeaderComponents();
        this._dayIndex = null;
        break;
      case RenderSortMode.PRICE:
        this._reRenderDayList();
        this._renderPriceSorted();
        this._renderHeaderComponents();
        break;
    }
  }

  _renderPriceSorted() {
    this._renderDayContainer();
    this._sortController = new SortController(this._sort, this._eventsPerDayMap);
    this._sortController.getSortedByPriceEvents()
      .forEach((event) => this._renderEvent(event, this._day));
    render(this._day, this._eventsList);
  }

  _renderDurationSorted() {
    this._renderDayContainer();
    this._sortController = new SortController(this._sort, this._eventsPerDayMap);
    this._sortController.getSortedByDurationEvents()
      .forEach((event) => this._renderEvent(event, this._day));
    render(this._day, this._eventsList);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _getDataMap() {
    this._eventsPerDayMap = new Map();
    if (Array.isArray(this._events)) {
      this._getUniqueSortedDates().forEach((date) => this._eventsPerDayMap.set(date, this._getMapFilledProperValues(date)));
    } else {
      this._eventsPerDayMap.set(this._getDate(), this._events);
    }
  }

  _getDate() {
    return moment(this._events.startTime).format(`MMM DD`);
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
      if (new Date(key).getDate() === new Date(event.startTime).getDate()) {
        properEvents.push(event);
      }
    });
    return properEvents;
  }

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
