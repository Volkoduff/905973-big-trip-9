export const getEventTemplate = ({event, startTime, endTime, price, offers, destination, eventComparator, destinationComparator}) =>
  `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${event}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${eventComparator(event)
        .concat(` ${destinationComparator(event) !== undefined ? destinationComparator(event) : destination}`)}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${getDateTime(startTime)}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${getDateTime(endTime)}</time>
        </p>
        <p class="event__duration">${getHourDifference(startTime, endTime)}H ${getMinuteDifference(startTime, endTime)}M</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${offers.map((offer) => `<li class="event__offer">
                  <span class="event__offer-title">${offer.name}</span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                 </li>`).join(``)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;

const getDateTime = (ms) => Array.from(new Date(ms).toTimeString()).slice(0, 5).join(``);

const getHourDifference = (start, end) => new Date(start - end).getHours();
const getMinuteDifference = (start, end) => new Date(start - end).getMinutes();
