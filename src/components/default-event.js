import {AbstractComponent} from './abstract-conponent';
import moment from "moment";

export class DefaultEvent extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getDefaultEvent() {
    const defaultEvent = Object.assign({}, this._events[0]);
    if (defaultEvent) {
      defaultEvent.destination = ``;
      defaultEvent.startTime = moment();
      defaultEvent.endTime = moment();
      defaultEvent.price = `0`;
      defaultEvent.event = `bus`;
    }
    return defaultEvent;
  }
}
