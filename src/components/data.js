const events = [`bus`, `check-in`, `drive`, `flight`, `restaurant`, `ship`, `sightseeing`, `taxi`, `train`, `transport`, `trip`];
const cities = [`Saint Petersburg`, `Moscow`, `Beijing`, `Tbilisi`, `Geneva`, `Chamonix`, `Amsterdam`];
const sights = [`Ancient Egypt Museum`, `Natural History Museum`, `National Meseum`];
const restaurants = [`Domenico's`, `Petit Boutary`, `McDonalds`, `KFC`];
const hotels = [`Redisson`, `Hotel`];
const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;

const RandomFn = {
  getRandomStartTime: () => Date.now() + RandomFn.getRandomDayTime() + RandomFn.randomInteger(0, 40 * 60 * 1000),
  getRandomEndTime: () => Date.now() + RandomFn.randomInteger(40 * 60 * 1000, 120 * 60 * 1000),
  getRandomDayTime: () => 1 + Math.floor(Math.random() * 50) * 1000,
  getRandomWeekTime: () => 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  getSeveralRandomElementsFromArray: (array, amount) => array
  .sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * amount + 1)),
  getRandomBoolean: () => Boolean(Math.round(Math.random())),
  randomInteger: (min, max) => Math.round(min + Math.random() * (max - min)),
  getRandomSentesesFromText: (maxAmount) => RandomFn.getSeveralRandomElementsFromArray(text.split(`. `), maxAmount).join(`. `).concat(`.`),
  getRandomElementFromArray: (array) => array[Math.floor(Math.random() * array.length)],
};
const MockAmount = {
  OPTIONS: 4,
  SENTENSES: 3,
  PHOTOS: 4,
  ROUTE_POINTS: 4,
};
const EventToPretext = {
  'bus': `Bus to`,
  'check-in': `Check into`,
  'drive': `Drive to`,
  'flight': `Flight to`,
  'restaurant': `Meal at`,
  'ship': `Ship to`,
  'sightseeing': ``,
  'taxi': `Taxi to`,
  'train': `Train to`,
  'transport': `Transport to`,
  'trip': `Trip to`,
};

const filterNames = [`everything`, `future`, `past`];
const menuNames = [`Table`, `Stats`];

const EventToDestination = {
  'sightseeing': RandomFn.getRandomElementFromArray(sights),
  'restaurant': RandomFn.getRandomElementFromArray(restaurants),
  'check-in': RandomFn.getRandomElementFromArray(hotels),
};

const optionId = {
  'Add luggage': `luggage`,
  'Switch to comfort class': `comfort`,
  'Add meal': `meal`,
  'Choose seats': `seats`,
};
export const filterData = {
  names: filterNames
};
export const menuData = {
  names: menuNames
};

export const getRoutePointData = () => ({
  date: Date.now() + RandomFn.getRandomWeekTime(),
  startTime: RandomFn.getRandomStartTime(),
  endTime: RandomFn.getRandomEndTime(),
  schedule: ``,
  price: RandomFn.randomInteger(2, 150),
  event: RandomFn.getRandomElementFromArray(events),
  eventComparator: (eventType) => EventToPretext[eventType],
  destination: RandomFn.getRandomElementFromArray(cities),
  destinationComparator: (eventType) => EventToDestination[eventType],
  description: () => RandomFn.getRandomSentesesFromText(MockAmount.SENTENSES),
  photos: Array.from({length: MockAmount.PHOTOS}),
  offers: offerArray.slice(0, RandomFn.randomInteger(0, 2)),
});

export const offerArray = [{
  name: `Add luggage`,
  price: 10,
  isChecked: RandomFn.getRandomBoolean(),
  id: (option) => optionId[option],
}, {
  name: `Switch to comfort class`,
  price: 160,
  isChecked: RandomFn.getRandomBoolean(),
  id: (option) => optionId[option],
}, {
  name: `Add meal`,
  price: 2,
  isChecked: RandomFn.getRandomBoolean(),
  id: (option) => optionId[option],
}, {
  name: `Choose seats`,
  price: 9,
  isChecked: RandomFn.getRandomBoolean(),
  id: (option) => optionId[option],
}];

export const routePointData = () => Array.from({length: MockAmount.ROUTE_POINTS}, getRoutePointData);
