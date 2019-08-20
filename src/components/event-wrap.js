export const getEventWrapTemplate = ({startTime}) =>
  `<ul class="trip-days">
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="2019-03-18">${new Date(startTime).toString().slice(4, 10)}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>
  </ul>`;
