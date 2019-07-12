import { One2Many } from "./one2many";

type OnChangeParameters<T> = (keyof T)[] | keyof T;
type OnChangeCallback<T> = (data: Readonly<T>) => void;
type OnChangeUnsubscribe = () => void;

export abstract class ActionsBase<T> {
  protected abstract data: Readonly<T>;
  private listeners = new One2Many<keyof T, OnChangeCallback<T>>();

  protected update(data: Partial<T>): void {
    const seenChangedKeys = new Set<keyof T>();
    const callbacks = new Set<OnChangeCallback<T>>();

    const newData = {
      ...this.data,
      ...data
    };

    for (const key in data) {
      if (data[key] !== this.data[key]) {
        if (seenChangedKeys.has(key)) continue;
        this.listeners.get(key).map(cb => callbacks.add(cb));
        seenChangedKeys.add(key);
      }
    }

    this.data = newData;

    for (const cb of callbacks) {
      cb(this.data);
    }
  }

  onChange(
    keys: OnChangeParameters<T>,
    cb: OnChangeCallback<T>,
    initialCall = true
  ): OnChangeUnsubscribe {
    const keysArray = Array.isArray(keys) ? keys : [keys];

    for (const key of keysArray) {
      this.listeners.set(key, cb);
    }

    if (initialCall) cb(this.data);

    return () => {
      for (const key of keysArray) {
        this.listeners.del(key, cb);
      }
    };
  }
}
