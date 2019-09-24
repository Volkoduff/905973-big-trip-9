import {AbstractComponent} from './abstract-conponent';

export class DestinationDescription extends AbstractComponent {
  constructor(destination) {
    super();
    this._destination = destination;
  }

  getTemplate() {
    return `<section class="event__section  event__section--destination">
          ${this._destination ? `
<h3 class="event__section-title  event__section-title--destination">Destination</h3>
<p class="event__destination-description">
      ${this._destination.description}</p>` : ``}
          ${this._destination ?
    `<div class="event__photos-container">
            <div class="event__photos-tape">${this._destination.pictures ? Array.from(this._destination.pictures).map((picture) => `<img class="event__photo" src="${picture.src}"  alt="${picture.description}">`).join(``) : ``}
            </div>
          </div>` : ``}
        </section>`;
  }
}
