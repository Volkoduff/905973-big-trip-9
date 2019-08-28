import {DaysList} from './../days-list';
import {EventsList} from './../events-list';
import {Event} from './../event';
import {EventEdit} from './../event-edit';
import {NoPoints} from './../no-points';
import {Sort} from './../sort';
import {render, unrender} from './../utils';

export class TripController {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this._sort = new Sort();
    this._daysList = new DaysList(events);
    this._eventsList = new EventsList();
    this._noPoints = new NoPoints();
    this._dayIndex = 0;
  }

  init() {
    render(this._container, this._sort.getElement());
    render(this._container, this._daysList.getElement());
    Array.from(this._daysList.getElement().children).map((el) => render(el, this._renderEventList(el)));
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt).call());
  }

  _getUniqueDatesArray() {
    this._sorted = this._events.sort((a, b) => a.startTime - b.startTime);
    return [...new Set(this._sorted.map((el) => el.startTime))];
  }

  _renderEventList(container) {
    this._eventsList = new EventsList().getElement();
    this._events
      .filter((el) => new Date(el.startTime).getDate() === new Date(this._getUniqueDatesArray()[this._dayIndex]).getDate())
      .forEach((routPoint, it) => this._renderEvent(routPoint, it, container));
    this._dayIndex++;
    return this._eventsList;
  }

  _onSortClick(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    this._eventsList.innerHTML = ``;
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

  _clearEventContainer(container) {
    unrender(container);
    unrender(this._sort.getElement());
  }

  _renderNoEventMessage() {
    render(this._container, this._noPoints.getElement(this._events));
  }

  _renderEvent(event, index, container) {
    const eventComponent = new Event(event);
    const eventEditComponent = new EventEdit(event, index);

    const onEscKeyDown = (evt) => {

      if (evt.key === `Escape`) {
        this.container.children[1].replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
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
        container.children[1].replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
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
        if (!container.children[1].children.length) {
          this._clearEventContainer(container);
        }
        if (!this._daysList.getElement().children.length) {
          this._renderNoEventMessage(container);
        }
      });

    eventComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        container.children[1].replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
        addEventListener(`keydown`, onEscKeyDown);
      });

    eventEditComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        container.children[1].replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
        removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._eventsList, eventComponent.getElement(event, index));
  }

}
