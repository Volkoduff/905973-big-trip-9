import {AbstractComponent} from './abstract-conponent';
import moment from "moment";

export class DefaultEvent extends AbstractComponent {

  static getDefaultEvent(events) {
    const newId = events.length;
    const defaultEvent = Object.assign({}, events[0]);
    if (defaultEvent) {
      defaultEvent.destination = {
        pictures: null,
        src: null,
        name: ``,
        description: ``,
      };
      defaultEvent.startTime = moment();
      defaultEvent.id = newId;
      defaultEvent.endTime = moment();
      defaultEvent.price = `0`;
      defaultEvent.event = `bus`;
    }
    return defaultEvent;
  }
}
