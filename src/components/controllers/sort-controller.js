import moment from "moment";

export default class SortController {
  constructor(sort, eventsPerDayMap) {
    this._sort = sort;
    this._eventsPerDayMap = eventsPerDayMap;
  }

  _cleaningForSort() {
    this._sort.getElement().querySelector(`.trip-sort__item--day`).innerHTML = ``;
  }

  _getEventsFromMap(map) {
    this._eventPoints = [];
    for (let events of map.values()) {
      this._eventPoints.push(...events);
    }
    return this._eventPoints;
  }

  getSortedByPriceEvents() {
    this._cleaningForSort();
    this._getEventsFromMap(this._eventsPerDayMap);
    return this._eventPoints
      .sort((a, b) => b.price - a.price);
  }

  getSortedByDurationEvents() {
    this._cleaningForSort();
    this._getEventsFromMap(this._eventsPerDayMap)
      .forEach((event) => {
        event.duration = event.endTime - event.startTime;
      });
    return this._eventPoints
      .sort((a, b) => b.duration - a.duration);
  }

  getFilteredFutureEvents() {
    return this._getEventsFromMap(this._eventsPerDayMap)
      .filter((el) => moment(el.startTime).isAfter(moment(), `day`));
  }

  getFilteredFinishedEvents() {
    return this._getEventsFromMap(this._eventsPerDayMap)
      .filter((el) => moment(el.endTime).isBefore(moment(), `day`));
  }
}
