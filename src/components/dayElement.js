import {AbstractComponent} from './abstract-conponent';

export class DayElement extends AbstractComponent {
  constructor(startTime) {
    super();
    this._startTime = startTime;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
      <div class="day__info">
      <span class="day__counter">1</span>
      <time class="day__date" datetime="2019-03-18">
      ${new Date(Math.min
        .call(null, ...Array.from(this._startTime)
        .map((el) => el.startTime))).toString()
        .slice(4, 10)}
        </time>
    </div>
    </li>`;
  }
}
