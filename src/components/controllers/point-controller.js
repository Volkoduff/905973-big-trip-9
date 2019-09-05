import {Event} from './../event';
import {EventEdit} from './../event-edit';

import {render} from './../utils';
import moment from "moment";

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
    this._eventEdit = new EventEdit(events, index, this._container, this._sort);
    this.init();
  }

  _offersInputsSync(offers, entry, key) {
    offers.filter((el) => el.type === entry.event)
      .map((offersObject) => offersObject.offers
        .filter((offer) => offer.id(offer.name) === key)
        .forEach((el) => {
          el.isChecked = entry[key] !== null;
        }));
  }

  init() {
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape`) {
        this._onChangeView();
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
        seats: formData.get(`event-offer-seats`),
        meal: formData.get(`event-offer-meal`),
        comfort: formData.get(`event-offer-comfort`),
        luggage: formData.get(`event-offer-luggage`),
        event: formData.get(`event-type`),
        startTime: moment(formData.get(`event-start-time`), `DD.MM.YY hh:mm`),
        endTime: moment(formData.get(`event-end-time`), `DD.MM.YY hh:mm`),
        price: formData.get(`event-price`),
        isFavorite: formData.get(`event-favorite`),
      };

      if (typeof entry === `object`) {
        // eslint-disable-next-line guard-for-in
        for (const key in entry) {
          newEventDataMask[key] = entry[key];
          if (key === `seats` || key === `comfort` || key === `luggage` || key === `meal`) {
            this._offersInputsSync(newEventDataMask.offers, entry, key);
            delete newEventDataMask[key];
          }
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
      .addEventListener(`click`, () => this._eventEdit.onClickDelete());

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
        this._onChangeView();
        removeEventListener(`keydown`, onEscKeyDown);
      });

    this._eventEdit.getElement().querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => this._eventEdit._onchangeDestination(evt));

    [...this._eventEdit.getElement().querySelectorAll(`.event__type-input`)]
      .forEach((el) => el.addEventListener(`click`, (evt) => this._eventEdit.onClickChangeEventType(evt)));

    render(this._eventsList, this._eventView.getElement(event, this._index));
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.querySelector(`.trip-events__list`)
        .replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
    }
  }
}
