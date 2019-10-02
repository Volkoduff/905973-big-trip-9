import {render, unrender, Action, Mode} from './../utils';
import Event from './../event';
import EventEdit from './../event-edit';
import moment from "moment";

const KeyCode = {
  ESCAPE: `Escape`,
  ESC: `ESC`,
  BACKSPACE: `Backspace`,
};

export default class PointController {
  constructor(container, data, onDataChange, onChangeView, eventsList, sort, onDeleteCheck, mode, models) {
    this._container = container;
    this._data = data;
    this._onDeleteCheck = onDeleteCheck;
    this._eventsList = eventsList;
    this._event = new Event(data);
    this._eventEdit = new EventEdit(data, sort, models);
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._models = models;
    this.init(mode);
  }

  init(mode) {
    let currentView = this._event;
    if (mode === Mode.ADD_NEW) {
      currentView = this._eventEdit;
    }
    this._eventEdit.getElement().querySelector(`.event__input`)
      .addEventListener(`focus`, () => {
        removeEventListener(`keydown`, onEscKeyDown);
      });

    const onSubmitDataChange = (evt) => {
      evt.preventDefault();
      let formData;
      if (evt.target.parentNode.tagName === `LI`) {
        formData = new FormData(this._eventEdit.getElement().querySelector(`.event--edit`));
      } else {
        formData = new FormData(this._eventEdit.newForm);
      }
      formData.getAll(`textarea`);

      this._data.destination = this._eventEdit._destination;
      this._data.event = formData.get(`event-type`);
      this._data.startTime = +moment(formData.get(`event-start-time`), `DD.MM.YYYY HH:mm`).format(`x`);
      this._data.endTime = +moment(formData.get(`event-end-time`), `DD.MM.YYYY HH:mm`).format(`x`);
      this._data.price = +formData.get(`event-price`);
      this._data.isFavorite = formData.get(`event-favorite`) !== null;
      this._data.offers = this._models.offers[this._models.offers.findIndex((it) => it.type === formData.get(`event-type`))].offers;
      this._data.offers.forEach((el, it) => {
        el.accepted = PointController._getOffersInputFlag(evt)[it];
      });

      this._onDataChange(mode === Mode.DEFAULT ? Action.UPDATE : Action.CREATE, this._data, this._eventEdit);
      removeEventListener(`keydown`, onEscKeyDown);
    };
    this._eventEdit.getElement().querySelector(`.event__input`)
      .addEventListener(`blur`, () => {
        addEventListener(`keydown`, onEscKeyDown);
      });

    if (mode === Mode.DEFAULT) {
      this._eventEdit.getElement().querySelector(`.event__reset-btn`)
        .addEventListener(`click`, (evt) => {
          evt.preventDefault();
          this._onDataChange(Action.DELETE, this._data, this._eventEdit);
          this._onDeleteCheck();
        });

      this._eventEdit.getElement().querySelector(`.event--edit`)
        .addEventListener(`submit`, onSubmitDataChange);

      this._event.getElement().querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, () => {
          this._onChangeView();
          this._container.querySelector(`.trip-events__list`)
            .replaceChild(this._eventEdit.getElement(), this._event.getElement());
          addEventListener(`keydown`, onEscKeyDown);
        });

      this._eventEdit.getElement().querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, () => {
          this._onChangeView();
          removeEventListener(`keydown`, onEscKeyDown);
        });
    } else if (mode === Mode.ADD_NEW) {
      currentView.getElement().querySelector(`.event--edit`)
        .addEventListener(`submit`, onSubmitDataChange);
    }

    const destinationInput = this._eventEdit.getElement().querySelector(`.event__input--destination`);
    destinationInput.addEventListener(`change`, (evt) => this._eventEdit.onchangeDestination(evt, mode));

    [...this._eventEdit.getElement().querySelectorAll(`.event__type-input`)]
      .forEach((el) => el.addEventListener(`click`, (evt) => this._eventEdit.onClickChangeEventType(evt, mode)));

    destinationInput.addEventListener(`keydown`, (evt) => {
      if (evt.key !== KeyCode.BACKSPACE && evt.key !== KeyCode.ESCAPE) {
        evt.preventDefault();
      }
    });

    if (mode === Mode.DEFAULT) {
      render(this._eventsList, currentView.getElement());
    } else if (mode === Mode.ADD_NEW) {
      this._eventEdit.onClickRenderEvent();
    }

    const onEscKeyDown = (evt) => {
      if (evt.key === KeyCode.ESCAPE || evt.key === KeyCode.ESC) {
        if (mode === Mode.DEFAULT) {
          this._onChangeView();
          removeEventListener(`keydown`, onEscKeyDown);
        } else if (mode === Mode.ADDING) {
          unrender(currentView.getElement());
          currentView.removeElement();
        }
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.querySelector(`.trip-events__list`)
        .replaceChild(this._event.getElement(), this._eventEdit.getElement());
    }
  }

  static _getOffersInputFlag(evt) {
    const allOfferInputs = evt.target.querySelectorAll(`.event__offer-checkbox`);
    return Array.from(allOfferInputs)
      .map((input) => input.checked);
  }
}
