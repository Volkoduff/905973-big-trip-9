import {AddEvent} from './../add-event';

export class AddEventController {
  constructor(container, events) {
    this._container = container;
    this._events = events;
  }

  init() {
    this._addNewEvent = new AddEvent(this._events[0]);
    this._addNewEvent.createNewEvent(this._container);
  }

  get newEvent() {
    return this._addNewEvent;
  }

  getDefaultEventData() {
    this.event = this._events.pop();
    this.defaultEvent = {
      startTime: ``,
      endTime: ``,
      price: 0,
      transferEvents: this.event.transferEvents,
      activityEvents: this.event.activityEvents,
      offers: this.event.offers,
      destinationOptions: this.event.destinationOptions,
      id: `0000`,
    };
    return this.event;
    // return this.defaultEvent;
  }

}
