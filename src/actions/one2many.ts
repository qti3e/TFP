export class One2Many<Key, Value> {
  private map = new Map<Key, Value[]>();

  set(key: Key, value: Value): void {
    if (!this.map.has(key)) {
      this.map.set(key, [value]);
      return;
    }
    const newValue = [...this.map.get(key)!, value];
    this.map.set(key, newValue);
  }

  get(key: Key): Value[] {
    if (this.map.has(key)) {
      return [...this.map.get(key)!];
    }
    return [];
  }

  has(key: Key): boolean {
    const data = this.map.get(key);
    return !!(data && data.length !== 0);
  }

  del(key: Key, value?: Value): void {
    if (!value) {
      this.map.set(key, []);
      return;
    }

    if (!this.map.has(key)) return;

    const currentValue = this.map.get(key)!;
    const newValue: Value[] = [];

    for (const val of currentValue) {
      if (val !== value) newValue.push(val);
    }

    this.map.set(key, newValue);
  }
}
