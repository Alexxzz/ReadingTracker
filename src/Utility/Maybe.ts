export interface IMaybe<T> {
  bind<U>(transform: (f: T) => IMaybe<U>): IMaybe<U>;
  map<U>(transform: (f: T) => U): IMaybe<U>;
  then(f: (value: T) => void): IMaybe<T>;
  elseDo(f: () => void): IMaybe<T>;
  defaultTo<U>(defaultValue: U): T | U;
}

export class Just<T> implements IMaybe<T> {
  constructor(private value: T) { }

  public bind<U>(transform: (f: T) => IMaybe<U>): IMaybe<U> {
    return transform(this.value);
  }

  public map<U>(transform: (f: T) => U): IMaybe<U> {
    try {
      return new Just(transform(this.value));
    } catch (e) {
      console.log(`Error: in Just: ${e}
      \t\twhen applying transform: ${transform}
      \t\ton value: ${this.value}`);
      return new Nothing();
    }
  }

  public then(f: (value: T) => void): IMaybe<T> {
    f(this.value);
    return this;
  }

  public elseDo(_: () => void): IMaybe<T> {
    return this;
  }

  public defaultTo<U>(_: U): T | U {
    return this.value;
  }

  public toString(): string {
    return 'Just: ' + this.value;
  }
}

export class Nothing<T> implements IMaybe<T> {
  public bind<U>(_: (f: T) => IMaybe<U>): IMaybe<U> {
    return new Nothing<U>();
  }

  public map<U>(_: (f: T) => U): IMaybe<U> {
    return new Nothing<U>();
  }

  public then(_: (value: T) => void): IMaybe<T> {
    return this;
  }

  public elseDo(f: () => void): IMaybe<T> {
    f();
    return this;
  }

  public defaultTo<U>(defaultValue: U): T | U {
    return defaultValue;
  }

  public toString(): string {
    return 'Nothing';
  }
}

export namespace Maybe {
  export function create<T>(from: T): IMaybe<T> {
    return from ? new Just<T>(from) : new Nothing();
  }
}
