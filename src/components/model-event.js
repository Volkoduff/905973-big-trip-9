import moment from "moment";

export default class ModelEvent {
  constructor(data = {}) {
    this.id = data[`id`];
    this.price = data[`base_price`];
    this.startTime = new Date(data[`date_from`]);
    this.endTime = new Date(data[`date_to`]);
    this.destination = data[`destination`];
    this.offers = data[`offers` || []];
    this.event = data[`type`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  static parseEvent(data) {
    return new ModelEvent(data);
  }

  static parseEvents(data) {
    return data.map(ModelEvent.parseEvent);
  }

  static parseOffers(data) {
    return data;
  }

  static parseDestinations(data) {
    return data;
  }

  static toRAW(data) {
    return {
      'base_price': data.price,
      'date_from': moment(data.startTime).toISOString(),
      'date_to': moment(data.endTime).toISOString(),
      'destination': data.destination,
      'offers': data.offers,
      'type': data.event,
      'is_favorite': data.isFavorite,
    };
  }
}
