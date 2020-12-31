import { EventEmitter } from 'events';

interface State {
  initialized: boolean;
  [key: string]: any;
}
interface Action<T = string> {
  type: T;
  payload?: any;
}

export default class Store<S extends State> extends EventEmitter {
  state: S;

  constructor() {
    super();

    // @ts-ignore
    this.state = {
      initialized: true,
    };
  }

  setState<T extends string>(action: Action<T>) {
    const originalState = this.state;
    const { type, payload } = action;
    this.state = {
      ...originalState,
      [type]: payload,
    };
  }

  getState() {
    return this.state;
  }

  dispatch<T extends string>(action: Action<T>): boolean {
    return this.emit('action', action);
  }

  subscribe<T extends string>(onChange?: (action: Action<T>) => void) {
    this.on('action', (action: Action<T>) => {
      onChange?.(action);
      this.setState(action);
    });

    return () =>
      // eslint-disable-next-line no-console
      this.off('change', () => console.log(`Unsubscribe successfully`));
  }
}
