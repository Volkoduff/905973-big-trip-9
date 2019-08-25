import {DayElement} from './../dayElement.js';
import {DaysList} from './../days-list';
import {EventsList} from './../events-list';
import {Event} from './../event';
import {EventEdit} from './../event-edit';
import {render, unrender} from './../utils';

export class TripController {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this._daysList = new DaysList();
    this._dayElement = new DayElement(events);
    this._eventsList = new EventsList();
  }

  init() {
    render(this._container, this._daysList.getElement());
    render(this._daysList.getElement(), this._dayElement.getElement());
    render(this._dayElement.getElement(), this._eventsList.getElement());
    this._events.forEach((routPoint, it) => this._renderEvent(routPoint, it));
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
        // deleteEventWrapIfEmpty();
      });

    eventComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        debugger
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
