import moment from "moment";

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;

};

export const render = (container, element, postition = `beforeend`) => {
  switch (postition) {
    case `afterbegin`:
      container.prepend(element);
      break;
    case `beforeend`:
      container.append(element);
      break;
    case `beforebegin`:
      container.before(element);
      break;
    case `afterend`:
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

