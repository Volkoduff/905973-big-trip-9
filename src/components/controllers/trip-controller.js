import {DaysList} from './../days-list';
import {EventsList} from './../events-list';
import {Day} from './../day';
import {RouteInfo} from './../route-info';
import {Sort} from './../sort';
import {DefaultEvent} from './../default-event';
import {NoPoints} from './../no-points';
import {render, unrender} from './../utils';
import {PointController, Mode} from "./point-controller";
import moment from "moment";

export class TripController {
  constructor(container, events, infoContainer) {
    this._container = container;
    this._infoContainer = infoContainer;
    this._events = events;
    this._defaultEvent = new DefaultEvent(events);
    this._sort = new Sort();
    this._daysList = new DaysList();
    this._eventsList = new EventsList();
    this._subscriptions = [];
    this._noPoints = new NoPoints();
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._dayIndex = null;
    this._eventsPerDay = null;
  }

  init() {
    this._getDailyEventsMap();
    this._renderDayList();
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));
    this._renderRouteInfo();
    this._renderNewEvent();
  }

  _renderRouteInfo() {
    this._routeInfo = new RouteInfo(this._eventsPerDay);
    render(this._infoContainer, this._routeInfo.getElement(), `afterbegin`);
  }

  // Обработка данных в Мапу НАЧАЛОСЬ
  _getDailyEventsMap() {
    this._eventsPerDay = new Map();
    this._getUniqueSortedDates().forEach((date) => this._eventsPerDay
      .set(date, this._getMapFilledProperValues(date)));
    // return this._eventsPerDay;
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

  _randomId() {
    return Math.floor(Math.random() * Date.now()).toString().slice(7);
  }

  _cleaningForSort() {
    this._sort.getElement().querySelector(`.trip-sort__item--day`).innerHTML = ``;
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));
    render(this._container, this._sort.getElement());
  }

  _getEventsPerDays() {
    render(this._daysList.getElement(), this._day); // Рендерим день в контэйнер
    this._eventsList = new EventsList().getElement();
  }

  _renderDayList() {
    this._sort = new Sort();
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));
    render(this._container, this._sort.getElement());
    render(this._container, this._daysList.getElement());
    for (let date of this._eventsPerDay.keys()) {
      this._dayIndex++;
      this._day = new Day(date, this._dayIndex).getElement(); // создаем новый день и передаем ему ключ(дату)
      this._getEventsPerDays();
      this._eventsPerDay.get(date).forEach((event) => {
        this._randomId();
        this._renderEvent(event, this._randomId(), this._day);
      });
      render(this._day, this._eventsList);
    }
    this._dayIndex = null;
  }

  // Сортировка
  _getEventsInList() {
    this._cleaningForSort();
    this.condition = `no-dates`;
    this._day = new Day(this.condition).getElement();
    render(this._container, this._daysList.getElement());
    render(this._daysList.getElement(), this._day); // Рендерим день в контэйнер
    this._eventsList = new EventsList().getElement();
    this._array = [];
    for (let events of this._eventsPerDay.values()) {
      this._array.push(...events);
    }
  }

  _renderSortedEventsByPrice() {
    this._getEventsInList();
    this._array
      .sort((a, b) => b.price - a.price)
      .forEach((event) => this._renderEvent(event, this._randomId(), this._day));
    render(this._day, this._eventsList);
  }

  _renderSortedEventsByDuration() {
    this._getEventsInList();
    this._array.forEach((event) => {
      event.duration = event.endTime - event.startTime;
    });
    this._array
      .sort((a, b) => b.duration - a.duration)
      .forEach((event) => this._renderEvent(event, this._randomId(), this._day));
    render(this._day, this._eventsList);
  }

  _onSortClick(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    unrender(this._daysList.getElement()); // Создается видимо несколько sort, избыточное создание где-то (Нужно отрефакторить)
    this._daysList.removeElement();
    unrender(this._sort.getElement());
    // this._sort.removeElement();
    switch (evt.target.dataset.sortType) {
      case `by-event`:
        this._renderDayList();
        break;
      case `by-time`:
        this._renderSortedEventsByDuration();
        break;
      case `by-price`:
        this._renderSortedEventsByPrice();
        break;
    }
  }
  // Сортировка


  onDeleteCheck() {
    if (!this._events.length) {
      render(this._container, this._noPoints.getElement(this._events));
      unrender(this._sort.getElement());
    }
  }

  _onDataChange(newData, oldData) {
    const index = this._events.findIndex((event) => event === oldData);
    if (newData === null && index !== -1) {
      this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
    } else if (oldData === null) {
      this._events = [newData, ...this._events];
    } else {
      this._events[index] = newData;
    }
    this._events[this._events.findIndex((el) => el === oldData)] = newData;
    unrender(this._sort.getElement());
    this._sort.removeElement();

    this._getDailyEventsMap();
    this._reRenderDayList();
    this._reRenderRouteInfo();
  }

  _reRenderRouteInfo() {
    unrender(this._routeInfo.getElement());
    this._routeInfo.removeElement();
    this._renderRouteInfo();
  }
  _reRenderDayList() {
    unrender(this._daysList.getElement());
    this._daysList.removeElement();
    this._renderDayList();
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _renderEvent(event, index, container) {
    const pointController = new PointController(container, event, index, this._onDataChange, this._onChangeView, this._eventsList, this._sort, this.onDeleteCheck.bind(this), Mode.DEFAULT);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _renderNewEvent() {
    let event = this._defaultEvent.getDefaultEvent();
    // eslint-disable-next-line no-new
    new PointController(null, event, null, this._onDataChange, this._onChangeView, this._eventsList, this._sort, this.onDeleteCheck.bind(this), Mode.ADD_NEW);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

}
