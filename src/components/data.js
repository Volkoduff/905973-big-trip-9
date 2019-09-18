const TRANSFER_EVENTS = [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`];
const ACTIVITY_EVENTS = [`check-in`, `restaurant`, `sightseeing`];
const CITIES = [`Saint Petersburg`, `Moscow`, `Beijing`, `Tbilisi`];
const SIGHTS = [`Ancient Egypt Museum`, `Natural History Museum`, `National Meseum`];
const RESTAURANTS = [`Domenico's`, `Petit Boutary`, `McDonalds`, `KFC`];
const HOTELS = [`Redisson`, `Hotel`];
const TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;

const RandomFn = {
  getRandomStartTime: () => Date.now() + Math.floor(Math.random() * 100) * 60 * 1000,
  getRandomEndTime: () => Date.now() + Math.floor(Math.random() * 24) * 60 * 60 * 1000,
  getRandomWeekTime: () => 1 + Math.floor(Math.random() * 6) * 24 * 60 * 60 * 1000,
  getSeveralRandomElementsFromArray: (array, amount) => array
    .sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * amount + 1)),
  getRandomBoolean: () => Boolean(Math.round(Math.random())),
  randomInteger: (min, max) => Math.round(min + Math.random() * (max - min)),
  getRandomSentesesFromText: (maxAmount) => RandomFn.getSeveralRandomElementsFromArray(TEXT.split(`. `), maxAmount).join(`. `).concat(`.`),
  getRandomElementFromArray: (array) => array[Math.floor(Math.random() * array.length)],
};
const MockAmount = {
  OPTIONS: 4,
  SENTENSES: 3,
  PHOTOS: 4,
  ROUTE_POINTS: 5,
};
const EventToPretext = {
  'bus': `Bus to`,
  'check-in': `Check-in in`,
  'drive': `Drive to`,
  'flight': `Flight to`,
  'restaurant': `Meal in`,
  'ship': `Ship to`,
  'sightseeing': ``,
  'taxi': `Taxi to`,
  'train': `Train to`,
  'transport': `Transport to`,
  'trip': `Trip to`,
};

const FILTERNAMES = [`everything`, `future`, `past`];
const MENUNAMES = [`Table`, `Stats`];

const EventToDestination = {
  'sightseeing': RandomFn.getRandomElementFromArray(SIGHTS),
  'restaurant': RandomFn.getRandomElementFromArray(RESTAURANTS),
  'check-in': RandomFn.getRandomElementFromArray(HOTELS),
};

const optionId = {
  'Add luggage': `luggage`,
  'Switch to comfort class': `comfort`,
  'Add meal': `meal`,
  'Choose seats': `seats`,
};
export const filterData = {
  names: FILTERNAMES
};
export const menuData = {
  names: MENUNAMES
};

export const getRoutePointData = () => ({
  startTime: RandomFn.getRandomStartTime(),
  endTime: RandomFn.getRandomEndTime(),
  transferEvents: TRANSFER_EVENTS,
  activityEvents: ACTIVITY_EVENTS,
  price: RandomFn.randomInteger(2, 150),
  event: RandomFn.getRandomElementFromArray([...TRANSFER_EVENTS, ...ACTIVITY_EVENTS]),
  eventComparator: (eventType) => EventToPretext[eventType],
  destination: RandomFn.getRandomElementFromArray(CITIES),
  destinationComparator: (eventType) => EventToDestination[eventType],
  description: allDescriptions,
  photos: Array.from({length: MockAmount.PHOTOS}),
  offers: allOffers,
  destinationOptions: CITIES,
});

export const offerTransportArray = [{
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

const allDescriptions = [{
  destination: `Saint Petersburg`,
  description: RandomFn.getRandomSentesesFromText(MockAmount.SENTENSES),
},
{
  destination: `Moscow`,
  description: RandomFn.getRandomSentesesFromText(MockAmount.SENTENSES),
},
{
  destination: `Beijing`,
  description: RandomFn.getRandomSentesesFromText(MockAmount.SENTENSES),
},
{
  destination: `Tbilisi`,
  description: RandomFn.getRandomSentesesFromText(MockAmount.SENTENSES),
},
];

const allOffers = [{
  type: `bus`,
  offers: RandomFn.getSeveralRandomElementsFromArray(offerTransportArray, MockAmount.OPTIONS),
},
{
  type: `drive`,
  offers: RandomFn.getSeveralRandomElementsFromArray(offerTransportArray, MockAmount.OPTIONS),
},
{
  type: `flight`,
  offers: RandomFn.getSeveralRandomElementsFromArray(offerTransportArray, MockAmount.OPTIONS),
},
{
  type: `ship`,
  offers: RandomFn.getSeveralRandomElementsFromArray(offerTransportArray, MockAmount.OPTIONS),
},
{
  type: `taxi`,
  offers: RandomFn.getSeveralRandomElementsFromArray(offerTransportArray, MockAmount.OPTIONS),
},
{
  type: `train`,
  offers: RandomFn.getSeveralRandomElementsFromArray(offerTransportArray, MockAmount.OPTIONS),
},
{
  type: `transport`,
  offers: RandomFn.getSeveralRandomElementsFromArray(offerTransportArray, MockAmount.OPTIONS),
},
{
  type: `check-in`,
  offers: RandomFn.getSeveralRandomElementsFromArray(offerTransportArray, MockAmount.OPTIONS),
},
{
  type: `restaurant`,
  offers: RandomFn.getSeveralRandomElementsFromArray(offerTransportArray, MockAmount.OPTIONS),
},
{
  type: `sightseeing`,
  offers: RandomFn.getSeveralRandomElementsFromArray(offerTransportArray, MockAmount.OPTIONS),
},
];

export const routePointData = () => Array.from({length: MockAmount.ROUTE_POINTS}, getRoutePointData);
