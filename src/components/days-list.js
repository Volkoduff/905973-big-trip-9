import {AbstractComponent} from './abstract-conponent';

export class DaysList extends AbstractComponent {
  constructor(tripPoints) {
    super();
    this._tripPoints = tripPoints;
    this._date = 1;
  }

  _dayCounter() {
    return this._date++;
  }

  _dateSort() {
    return this._tripPoints.sort((a, b) => a.startTime - b.startTime);
  }

  _uniqueDates() {
    return [...new Set(this._dateSort().map((el) => el.startTime))];
  }

  getTemplate() {
    return `<ul class="trip-days">${this._uniqueDates().map((date) => `<li class="trip-days__item day"><div
    class="day__info"><span
    class="day__counter">${this._dayCounter()}</span><time class="day__date" datetime="2019-03-18">
      ${new Date(date).toString().slice(4, 10)}
      </time></div></li>`).join(``)}</ul>`;
  }
}
