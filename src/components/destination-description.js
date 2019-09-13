import {AbstractComponent} from './abstract-conponent';

export class DestinationDescription extends AbstractComponent {
  constructor(description, destination) {
    super();
    this._description = description;
    this._destination = destination;
  }

  getTemplate() {
    return `<section class="event__section  event__section--destination">
          ${this._description ? `
<h3 class="event__section-title  event__section-title--destination">Destination</h3>
<p class="event__destination-description">
      ${this._description
      .filter((el) => el.destination === this._destination)
      .map((el) => el.description)}</p>` : ``}
          ${this._photos ?
    `<div class="event__photos-container">
            <div class="event__photos-tape"> ${Array.from(this._photos).map(() => `<img class="event__photo" src="http://picsum.photos/300/150?r=${Math.random()}" alt="Event photo">`).join(``)}}
            </div>
          </div>` : ``}
        </section>`;
  }
}
