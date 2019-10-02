export default class Store {
  constructor({storage}) {
    this._storage = storage;
  }

  setItem(storeKey, {key, item}) {
    const items = this.getAll(storeKey);
    items[key] = item;
    this._storage.setItem(storeKey, JSON.stringify(items));
  }

  removeItem(storeKey, {key}) {
    const items = this.getAll(storeKey);
    delete items[key];
    this._storage.setItem(storeKey, JSON.stringify(items));
  }

  getItem(storeKey, {key}) {
    const items = this.getAll(storeKey);
    return items[key];
  }

  getAll(storeKey) {
    const emptyItems = {};
    const items = this._storage.getItem(storeKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (e) {
      return emptyItems;
    }
  }
}
