export default class Models {

  set offers(offers) {
    this._allOffers = offers;
  }

  get offers() {
    return this._allOffers;
  }

  set destinations(destinations) {
    this._allDestinations = destinations;
  }

  get destinations() {
    return this._allDestinations;
  }

}
