export const getrouteInfoTemplate = (dataArray) =>
  `<div class="trip-info__main">
    <h1 class="trip-info__title">
    ${destinations(dataArray).length < 3 ?
    destinations(dataArray).reduce((a, b) => a.concat(` &mdash; ${b}`)) :
    destinations(dataArray).slice(0, 1).concat(` &mdash; ... &mdash; `)
      .concat(destinations(dataArray).slice(-1)).join(``)}
      </h1>
    <p class="trip-info__dates">
      ${getMinDate(dataArray).toString().split(` `)[1]}
      ${getMinDate(dataArray).getDate()}
    </p>
  </div>`;

const getMinDate = (data) => new Date(data.map((obj) => obj.date).sort((a, b) => a - b)[0]);
const destinations = (data) => data.map((obj) => obj.destination);