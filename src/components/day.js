import {AbstractComponent} from './abstract-conponent';

export class Day extends AbstractComponent {
  constructor(date, day) {
    super();
    this._date = date;
    this._day = day;
  }

  getTemplate() {
    return `<li class="trip-days__item day">
<div class="day__info">${this._date !== `no-dates` ?
    `<span class="day__counter">${this._day}
      </span><time class="day__date" datetime="2019-03-18">
      ${this._date}
      </time>` : ``}
     </div></li>`;
  }
}
