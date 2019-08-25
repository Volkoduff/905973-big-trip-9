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
    debugger
      container.append(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};
