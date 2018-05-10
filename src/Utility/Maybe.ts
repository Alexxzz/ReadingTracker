export interface Maybe<T> {
  bind<U>(transform: (f: T) => Maybe<U>): Maybe<U>;
  map<U>(transform: (f: T) => U): Maybe<U>;
  then(f: (value: T) => void): Maybe<T>;
  elseDo(f: () => void): Maybe<T>;
  defaultTo<U>(defaultValue: U): T | U;
}

export class Just<T> implements Maybe<T> {
  constructor(private value: T) { }
  bind<U>(transform: (f: T) => Maybe<U>): Maybe<U> {
    return transform(this.value);
  }
  map<U>(transform: (f: T) => U): Maybe<U> {
    try {
      return new Just(transform(this.value));
    } catch (e) {
      console.log(`Error: in Just: ${e}
      \t\twhen applying transform: ${transform}
      \t\ton value: ${this.value}`);
      return new Nothing();
    }
  }
  then(f: (value: T) => void): Maybe<T> {
    f(this.value);
    return this;
  }
  elseDo(_: () => void): Maybe<T> {
    return this;
  }
  defaultTo<U>(_: U): T | U {
    return this.value;
  }
  
  toString(): string {
    return 'Just: ' + this.value;
  }
}

export class Nothing<T> implements Maybe<T> {
  bind<U>(_: (f: T) => Maybe<U>): Maybe<U> {
    return new Nothing<U>();
  }
  map<U>(_: (f: T) => U): Maybe<U> {
    return new Nothing<U>();
  }
  then(_: (value: T) => void): Maybe<T> {
    return this;
  }
  elseDo(f: () => void): Maybe<T> {
    f();
    return this;
  }
  defaultTo<U>(defaultValue: U): T | U {
    return defaultValue;
  }
  
  toString(): string {
    return 'Nothing';
  }
}

export namespace Maybe {
  export function create<T>(from: T): Maybe<T> {
    return from ? new Just<T>(from) : new Nothing();
  }
}
