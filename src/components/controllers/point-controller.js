import {Event} from './../event';
import {EventEdit} from './../event-edit';
import {NoPoints} from './../no-points';
import {render, unrender} from './../utils';

export class PointController {
  constructor(container, events, index, onDataChange, onChangeView, eventsList, sort) {
    this._container = container;
    this._events = events;
    this._index = index;
    this._eventsList = eventsList;
    this._sort = sort;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._eventView = new Event(events);
    this._noPoints = new NoPoints();
    this._eventEdit = new EventEdit(events, index);
    this.init();
  }

  init() {
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape`) {
        this._container.querySelector(`.trip-events__list`)
          .replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._eventEdit.getElement()
      .querySelector(`.event__input`)
      .addEventListener(`focus`, () => {
        removeEventListener(`keydown`, onEscKeyDown);
      });

    const onSubmitDataChange = (evt) => {
      evt.preventDefault();
      const formData = new FormData(this._eventEdit.getElement().querySelector(`.event--edit`));
      formData.getAll(`textarea`);
      const newEventDataMask = Object.assign({}, this._events);
      const entry = {
        destination: formData.get(`event-destination`),
        offerSeats: formData.get(`event-offer-seats`),
        offerMeal: formData.get(`event-offer-meal`),
        offerToComfort: formData.get(`event-offer-comfort`),
        offerLuggage: formData.get(`event-offer-luggage`),
        event: formData.get(`event-type`),
        price: formData.get(`event-price`),
        isFavorite: formData.get(`event-favorite`),
      };
      if (typeof entry === `object`) {
        // eslint-disable-next-line guard-for-in
        for (const key in entry) {
          newEventDataMask[key] = entry[key];
        }
      }

      this._onDataChange(newEventDataMask, this._events);
      removeEventListener(`keydown`, onEscKeyDown);
    };

    this._eventEdit.getElement()
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, onSubmitDataChange);

    this._eventEdit.getElement()
      .querySelector(`.event__input`)
      .addEventListener(`blur`, () => {
        addEventListener(`keydown`, onEscKeyDown);
      });

    this._eventEdit.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        unrender(this._eventEdit.getElement());
        this._eventEdit.removeElement();
        this._daysContainer = this._container.offsetParent.querySelector(`.trip-days`);
        if (!this._container.querySelectorAll(`.trip-events__item`).length) {
          unrender(this._container);
        }
        if (!this._daysContainer.children.length) {
          this._renderNoEventMessage();
          unrender(this._sort.getElement());
        }
      });

    this._eventView.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._container.querySelector(`.trip-events__list`)
          .replaceChild(this._eventEdit.getElement(), this._eventView.getElement());
        addEventListener(`keydown`, onEscKeyDown);
      });

    this._eventEdit.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._container.querySelector(`.trip-events__list`)
          .replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
        removeEventListener(`keydown`, onEscKeyDown);
      });

    this._eventEdit.getElement().querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => this._eventEdit._onchangeDestination(evt));

    [...this._eventEdit.getElement().querySelectorAll(`.event__type-input`)]
      .forEach((el) => el.addEventListener(`click`, (evt) => this._eventEdit.onClickChangeEventType(evt)));

    render(this._eventsList, this._eventView.getElement(event, this._index));
  }

  _renderNoEventMessage() {
    render(this._daysContainer, this._noPoints.getElement(this._events));
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.querySelector(`.trip-events__list`)
        .replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
    }
  }
}
