export class CappedMap<K, V> {
  map: Map<K, V>;
  order: Array<K>;
  maxValues: number;

  constructor(maxValues: number) {
    this.map = new Map();
    this.order = [];
    this.maxValues = maxValues;
  }

  push(key: K, value: V) {
    this.map.set(key, value);
    this.order.push(key);
    if (this.order.length > this.maxValues) {
      this.map.delete(this.order[0]);
      this.order.shift();
    }
  }

  get(key: K) {
    return this.map.get(key);
  }
}
