import ModelEvent from "./model-event";

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

const EVENTS_STORE_KEY = `events-store-key`;
const DESTINATION_STORE_KEY = `destination-store-key`;
const ALL_OFFERS_STORE_KEY = `all-offers-store-key`;

export default class Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
  }

  getEvents() {
    if (Provider._isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          events.map((event) => this._store
            .setItem(EVENTS_STORE_KEY, {key: event.id, item: ModelEvent.toRAW(event)}));
          return events;
        });
    } else {
      const rawEventsMap = this._store.getAll(EVENTS_STORE_KEY);
      const rawEvents = objectToArray(rawEventsMap);
      const events = ModelEvent.parseEvents(rawEvents);
      return Promise.resolve(events);
    }
  }

  getDestinations() {
    if (Provider._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          destinations.map((destination) => this._store
            .setItem(DESTINATION_STORE_KEY, {key: destination.name, item: destination}));
          return destinations;
        });
    } else {
      const destinations = objectToArray(this._store.getAll(DESTINATION_STORE_KEY));
      return Promise.resolve(destinations);
    }
  }

  getOffers() {
    if (Provider._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          offers.map((offer) => this._store
            .setItem(ALL_OFFERS_STORE_KEY, {key: offer.type, item: offer}));
          return offers;
        });
    } else {
      const allOffers = objectToArray(this._store.getAll(ALL_OFFERS_STORE_KEY));
      return Promise.resolve(allOffers);
    }
  }

  createEvent({data}) {
    if (Provider._isOnline()) {
      return this._api.createEvent({data})
        .then((event) => {
          this._store.setItem(EVENTS_STORE_KEY, {key: data.id, item: ModelEvent.toRAW(event)});
          return event;
        });
    } else {
      this._store.setItem(EVENTS_STORE_KEY, {key: data.id, item: data});
      return Promise.resolve(ModelEvent.parseEvent(data));
    }
  }

  updateEvent({id, data}) {
    if (Provider._isOnline()) {
      return this._api.updateEvent({id, data})
        .then((event) => {
          this._store.setItem(EVENTS_STORE_KEY, {key: event.id, item: ModelEvent.toRAW(event)});
          return event;
        });
    } else {
      this._store.setItem(EVENTS_STORE_KEY, {key: data.id, item: data});
      return Promise.resolve(ModelEvent.parseEvent(data));
    }
  }

  deleteEvent({id}) {
    if (Provider._isOnline()) {
      return this._api.deleteEvent({id})
        .then(() => {
          this._store.removeItem(EVENTS_STORE_KEY, {key: id});
        });
    } else {
      this._store.removeItem(EVENTS_STORE_KEY, {key: id});
      return Promise.resolve(true);
    }
  }

  syncEvents() {
    return this._api.syncEvents(objectToArray(this._store.getAll(EVENTS_STORE_KEY)));
  }

  static _isOnline() {
    return window.navigator.onLine;
  }
}
