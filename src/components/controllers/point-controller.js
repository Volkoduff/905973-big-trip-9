import {Event} from './../event';
import {EventEdit} from './../event-edit';
import {render} from './../utils';
import moment from "moment";

export const Mode = {
  DEFAULT: `default`,
  ADD_NEW: `add-new`,
};

export class PointController {
  constructor(container, event, index, onDataChange, onChangeView, eventsList, sort, onDeleteCheck, mode) {
    this._container = container;
    this._event = event;
    this._index = index;
    this._onDeleteCheck = onDeleteCheck;
    this._eventsList = eventsList;
    this._sort = sort;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this.init(mode);
  }

  init(mode) {
    if (mode === Mode.ADD_NEW) {
      document.querySelector(`.trip-main__event-add-btn`)
        .addEventListener(`click`, () => this._eventEdit.onClickRenderEvent());
      this._eventEdit = new EventEdit(this._event, this._index, this._sort);
    } else if (Mode.DEFAULT) {
      this._eventView = new Event(this._event);
      this._eventEdit = new EventEdit(this._event, this._index, this._container);
    }
    this._currentView = this._eventEdit;

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape`) {
        this._onChangeView();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._currentView.getElement()
      .querySelector(`.event__type-toggle`)
      .addEventListener(`blur`, (evt) => this._currentView.onBlurCloseEventList(evt));

    this._currentView.getElement()
      .querySelector(`.event__input`)
      .addEventListener(`focus`, () => {
        removeEventListener(`keydown`, onEscKeyDown);
      });

    const onSubmitDataChange = (evt) => {
      evt.preventDefault();
      let formData;
      if (evt.target.parentNode.tagName === `LI`) {
        formData = new FormData(this._currentView.getElement().querySelector(`.event--edit`));
      } else {
        formData = new FormData(this._currentView.newForm);
      }
      formData.getAll(`textarea`);
      const newEventDataMask = Object.assign({}, this._event);
      const entry = {
        destination: formData.get(`event-destination`),
        seats: formData.get(`event-offer-seats`),
        meal: formData.get(`event-offer-meal`),
        comfort: formData.get(`event-offer-comfort`),
        luggage: formData.get(`event-offer-luggage`),
        event: formData.get(`event-type`),
        startTime: formData.get(`event-start-time`),
        endTime: formData.get(`event-end-time`),
        price: formData.get(`event-price`),
        isFavorite: formData.get(`event-favorite`),
      };
      if (typeof entry === `object`) {
        // eslint-disable-next-line guard-for-in
        for (const key in entry) {
          newEventDataMask[key] = entry[key];
          if (newEventDataMask.offers !== undefined) {
            if (key === `seats` || key === `comfort` || key === `luggage` || key === `meal`) {
              this._offersInputsSync(newEventDataMask.offers, entry, key);
              delete newEventDataMask[key];
            }
          }
          if (key === `startTime` || key === `endTime`) {
            newEventDataMask[key] = +moment(newEventDataMask[key]).format(`x`);
          }


        }
      }
      this._onDataChange(newEventDataMask, mode === Mode.DEFAULT ? this._event : null);
      removeEventListener(`keydown`, onEscKeyDown);
      if (mode === Mode.ADD_NEW) {
        this._currentView.cancelNewEvent(evt);
      }
    };

    const onDeleteDataChange = (evt) => {
      evt.preventDefault();
      this._onDataChange(null, this._event);
      onSubmitDataChange(evt);
      this._onDeleteCheck();
    };

    this._currentView.getElement()
      .querySelector(`.event__input`)
      .addEventListener(`blur`, () => {
        addEventListener(`keydown`, onEscKeyDown);
      });

    if (mode === Mode.DEFAULT) {
      this._currentView.getElement()
        .querySelector(`.event__reset-btn`)
        .addEventListener(`click`, onDeleteDataChange);

      this._currentView.getElement()
        .querySelector(`.event--edit`)
        .addEventListener(`submit`, onSubmitDataChange);

      this._eventView.getElement()
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, () => {
          this._onChangeView();
          this._container.querySelector(`.trip-events__list`)
            .replaceChild(this._currentView.getElement(), this._eventView.getElement());
          addEventListener(`keydown`, onEscKeyDown);
        });

      this._currentView.getElement()
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, () => {
          this._onChangeView();
          removeEventListener(`keydown`, onEscKeyDown);
        });

    } else if (mode === Mode.ADD_NEW) {
      this._currentView.getElement()
        .querySelector(`.event--edit`)
        .addEventListener(`submit`, onSubmitDataChange);
    }

    const destinationInput = this._currentView.getElement().querySelector(`.event__input--destination`);

    destinationInput.addEventListener(`change`, (evt) => this._currentView.onchangeDestination(evt, mode));

    [...this._currentView.getElement().querySelectorAll(`.event__type-input`)]
      .forEach((el) => el.addEventListener(`click`, (evt) => this._currentView.onClickChangeEventType(evt, mode)));

    destinationInput.addEventListener(`keydown`, (evt) => {
      if (evt.key !== `Backspace`) {
        evt.preventDefault();
      }
    });

    if (mode === Mode.DEFAULT) {
      render(this._eventsList, this._eventView.getElement(event, this._index));
    } else if (mode === `ADD_NEW_EVENT`) {
      // Ничего не рендерим так как в компоненте есть метод для этого, только если для пустого окна
      // render(this._sort.getElement(), this._currentView.getElement(), `beforebegin`);
    }
  }

  _offersInputsSync(offers, entry, key) {
    offers.filter((el) => el.type === entry.event)
      .map((offersObject) => offersObject.offers
        .filter((offer) => offer.id(offer.name) === key)
        .forEach((el) => {
          el.isChecked = entry[key] !== null;
        }));
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.querySelector(`.trip-events__list`)
        .replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
    }
  }
}
