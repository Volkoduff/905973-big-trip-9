import moment from "moment";

export const TRANSFER_EVENTS = [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`];

export const ACTIVITY_EVENTS = [`check-in`, `restaurant`, `sightseeing`];
export const EventToPretext = {
  'bus': `Bus to`,
  'check-in': `Check-in in`,
  'drive': `Drive to`,
  'flight': `Flight to`,
  'restaurant': `Restaurant in`,
  'ship': `Ship to`,
  'sightseeing': `Sightseeing in`,
  'taxi': `Taxi to`,
  'train': `Train to`,
  'transport': `Transport to`,
  'trip': `Trip to`,
};

export const RenderSortMode = {
  DEFAULT: `by-event`,
  DURATION: `by-time`,
  PRICE: `by-price`,
};

export const ButtonText = {
  SAVING: `Saving...`,
  DELETING: `Deleting...`,
  SAVE: `Save`,
  DELETE: `Delete`,
};

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const Action = {
  CREATE: `create`,
  UPDATE: `update`,
  DELETE: `delete`,
};

export const Position = {
  BEGIN: `afterbegin`,
  END: `beforeend`,
  BEFORE: `beforebegin`,
  AFTER: `afterend`
};

export const Mode = {
  DEFAULT: `default`,
  ADD_NEW: `add-new`,
};


export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const capitalizeFirstLetter = (word) => word[0].toUpperCase() + word.slice(1);

export const render = (container, element, position = Position.END) => {
  switch (position) {
    case Position.BEFORE:
      container.before(element);
      break;
    case Position.BEGIN:
      container.prepend(element);
      break;
    case Position.END:
      container.append(element);
      break;
    case Position.AFTER:
      container.after(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const getHumanFriendlyTime = (duration) => {
  duration = Math.abs(duration) / 60000;
  let result = ``;
  if (duration > 1139) {
    result = `${Math.floor(duration / 1140)}D ${Math.floor(duration % 24)}H ${Math.floor(duration % 60)}M`;
  } else if (duration > 59) {
    result = `${Math.floor(duration / 60)}H ${Math.floor(duration % 60)}M`;
  } else if (duration < 59) {
    result = `${Math.floor(duration)}M`;
  }
  return result;
};

export const getDuration = (startTime, finishTime) => {
  const start = moment(startTime);
  const finish = moment(finishTime);
  const duration = finish.diff(start);
  return getHumanFriendlyTime(duration);
};

