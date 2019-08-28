import {DayElement} from './../day-element';
import {DaysList} from './../days-list';
import {EventsList} from './../events-list';
import {Event} from './../event';
import {EventEdit} from './../event-edit';
import {NoPoints} from './../no-points';
import {Sort} from './../sort';
import {render, unrender} from './../utils';
import {getRoutePointData} from "../data";

export class TripController {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this._sort = new Sort();
    this._daysList = new DaysList(events);
    this._dayElement = new DayElement(events);
    this._eventsList = new EventsList();
    this._noPoints = new NoPoints();
  }

  init() {
    render(this._container, this._sort.getElement());
    render(this._container, this._daysList.getElement());

    Array.from(this._daysList.getElement().children).map((el) => render(el, this._eventsList.getElement()))

    this._events.forEach((routPoint, it) => this._renderEvent(routPoint, it))

    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));
  }

  _onSortClick(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    this._eventsList.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `by-event`:
        this._events.slice()
          .sort((a, b) => {
            if (a.event.toLowerCase() < b.event.toLowerCase()) {
              return -1;
            } else if (a.event.toLowerCase() > b.event.toLowerCase()) {
              return 1;
            } else {
              return 0;
            }
          })
          .forEach((routPoint, it) => this._renderEvent(routPoint, it));
        break;
      case `by-time`:
        this._events.slice()
          .sort((a, b) => a.startTime - b.startTime)
          .forEach((routPoint, it) => this._renderEvent(routPoint, it));
        break;
      case `by-price`:
        this._events.slice()
          .sort((a, b) => a.price - b.price)
          .forEach((routPoint, it) => this._renderEvent(routPoint, it));
        break;
    }
  }

  _clearEventContainer() {
    unrender(this._eventsList.getElement());
    unrender(this._dayElement.getElement());
    unrender(this._daysList.getElement());
    unrender(this._sort.getElement());
  }

  _renderNoEventMessage() {
    render(this._container, this._noPoints.getElement(this._events));
  }

  _renderEvent(event, index) {
    const eventComponent = new Event(event);
    const eventEditComponent = new EventEdit(event, index);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape`) {
        this._eventsList.getElement().replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
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
        this._eventsList.getElement().replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
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
        if (!this._eventsList.getElement().children.length) {
          this._clearEventContainer();
          this._renderNoEventMessage();
        }
      });

    eventComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._eventsList.getElement().replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
        addEventListener(`keydown`, onEscKeyDown);
      });

    eventEditComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._eventsList.getElement().replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
        removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._eventsList.getElement(), eventComponent.getElement(event, index));
  }
}
