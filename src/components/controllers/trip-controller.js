import {DaysList} from './../days-list';
import {EventsList} from './../events-list';
import {Event} from './../event';
import {RouteInfo} from './../route-info';
import {EventEdit} from './../event-edit';
import {NoPoints} from './../no-points';
import {Sort} from './../sort';
import {render, unrender} from './../utils';

export class TripController {
  constructor(container, events, infoContainer) {
    this._container = container;
    this._infoContainer = infoContainer;
    this._events = events;
    this._sort = new Sort();
    this._eventsList = new EventsList();
    this._noPoints = new NoPoints();
    this._dayIndex = null;
    this._eventsPerDay = null;
  }

  init() {
    render(this._container, this._sort.getElement());
    this._getEventsPerDayMap();
    this._renderDayList();
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));
    this._routeInfo = new RouteInfo(this._eventsPerDay);
    render(this._infoContainer, this._routeInfo.getElement(), `afterbegin`);
  }

  _getEventsPerDayMap() {
    this._eventsPerDay = new Map();
    this._getUniqueSortedDates().forEach((date) => this._eventsPerDay.set(date, this._fillMapKeysProperValues(date)));
    return this._eventsPerDay;
  }
  _getDate(ms) {
    return new Date(ms).getDate();
  }

  _randomId() {
    return Math.floor(Math.random() * Date.now()).toString().slice(7);
  }

  _fillMapKeysProperValues(key) {
    const properEvents = [];
    this._events.forEach((event) => {
      if (this._getDate(key) === this._getDate(event.startTime)) {
        properEvents.push(event);
      }
    });
    return properEvents;
  }

  _getUniqueSortedDates() {
    const sortedDates = this._events
      .sort((a, b) => a.startTime - b.startTime)
      .map((obj) => obj.startTime);
    return [...new Set(sortedDates)];
  }
  _cleaningForSort() {
    this._sort.getElement().querySelector(`.trip-sort__item--day`).innerHTML = ``;
    render(this._container, this._sort.getElement());
  }

  _getEventsPerDays() {
    render(this._container, this._daysList); // Рендерим день в контэйнер
    this._eventsList = new EventsList().getElement();
  }

  _renderDayList() {
    render(this._container, this._sort.getElement());
    this._events = this._eventsPerDay;
    for (let date of this._events.keys()) {
      this._dayIndex++;
      this._daysList = new DaysList(date, this._dayIndex).getElement(); // создаем новый день и передаем ему ключ(дату)
      this._getEventsPerDays();
      this._events.get(date).forEach((event) => {
        this._randomId();
        this._renderEvent(event, this._randomId(), this._daysList);
      });
      render(this._daysList.querySelector(`.day`), this._eventsList);
    }
    this._dayIndex = null;
  }
  _getEventsInList() {
    this._cleaningForSort();
    this.condition = `no-dates`;
    this._daysList = new DaysList(this.condition).getElement();
    this._getEventsPerDays();
    this._array = [];
    for (let events of this._events.values()) {
      this._array.push(...events);
    }
  }

  _renderSortedEventsByPrice() {
    this._getEventsInList();
    this._array
      .sort((a, b) => b.price - a.price)
      .forEach((event) => this._renderEvent(event, this._randomId(), this._daysList));
    render(this._daysList.querySelector(`.day`), this._eventsList);
  }
  _renderSortedEventsByDuration() {
    this._getEventsInList();
    this._array.map((event) => {
      event.duration = event.endTime - event.startTime;
    });
    this._array
      .sort((a, b) => new Date(b.duration).getMinutes() - new Date(a.duration).getMinutes())
      .forEach((event) => this._renderEvent(event, this._randomId(), this._daysList));
    render(this._daysList.querySelector(`.day`), this._eventsList);
  }

  _onSortClick(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    this._container.innerHTML = ``;
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

  _clearEventContainer(container) {
    unrender(container);
  }

  _renderNoEventMessage() {
    render(this._container, this._noPoints.getElement(this._events));
  }

  _renderEvent(event, index, container) {
    const eventComponent = new Event(event);
    const eventEditComponent = new EventEdit(event, index);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape`) {
        container.querySelector(`.trip-events__list`)
          .replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventEditComponent.getElement()
      .querySelector(`.event__input`)
      .addEventListener(`focus`, () => {
        removeEventListener(`keydown`, onEscKeyDown);
      });

    eventEditComponent.getElement()
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, () => {
        container.querySelector(`.trip-events__list`)
          .replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
        removeEventListener(`keydown`, onEscKeyDown);
      });

    eventEditComponent.getElement()
      .querySelector(`.event__input`)
      .addEventListener(`blur`, () => {
        addEventListener(`keydown`, onEscKeyDown);
      });

    eventEditComponent.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        unrender(eventEditComponent.getElement());
        eventEditComponent.removeElement();
        if (!container.querySelectorAll(`.trip-events__item`).length) {
          unrender(container);
        }
        if (!this._container.querySelectorAll(`.trip-days`).length) {
          this._renderNoEventMessage(container);
          unrender(this._sort.getElement());
        }
      });

    eventComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        container.querySelector(`.trip-events__list`)
          .replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
        addEventListener(`keydown`, onEscKeyDown);
      });

    eventEditComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        container.querySelector(`.trip-events__list`)
          .replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
        removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._eventsList, eventComponent.getElement(event, index));
  }

}
