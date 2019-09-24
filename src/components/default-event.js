import {AbstractComponent} from './abstract-conponent';
import moment from "moment";

export class DefaultEvent extends AbstractComponent {

  static getDefaultEvent(events = [], destinations, allOffers) {
    const newId = events.length;
    return {
      destination: destinations[0],
      offers: allOffers[0],
      startTime: moment().format(),
      endTime: moment().format(),
      id: newId,
      price: `0`,
      event: `bus`,
    };
  }
}
