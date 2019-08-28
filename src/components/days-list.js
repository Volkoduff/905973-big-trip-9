import {AbstractComponent} from './abstract-conponent';

export class DaysList extends AbstractComponent {
  constructor(tripPoint) {
    super();
    this._tripPoint = tripPoint;
    this._date = 1;
  }

  _dayCounter() {
    return this._date++;
  }
  getTemplate() {
    return `<ul class="trip-days">${this._tripPoint.map((obj) => `<li class="trip-days__item day"><div
    class="day__info"><span
    class="day__counter">${this._dayCounter()}</span><time class="day__date" datetime="2019-03-18">
      ${new Date(obj.date).toString().slice(4, 10)}
      </time></div></li>`).join(``)}</ul>`;
  }
}
