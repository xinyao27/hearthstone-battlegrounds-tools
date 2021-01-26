/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'events'

interface State {
  initialized: boolean
  [key: string]: any
}
interface Action<T = string> {
  type: T
  payload?: any
}

export default class Store<S extends State> extends EventEmitter {
  state: S

  constructor() {
    super()

    // @ts-ignore
    this.state = {
      initialized: true,
    }
  }

  setState<T extends string>(action: Action<T>): void {
    const originalState = this.state
    const { type, payload } = action
    this.state = {
      ...originalState,
      [type]: payload,
    }
  }

  getState(): S {
    return this.state
  }

  dispatch<T extends string>(action: Action<T>): boolean {
    return this.emit(action.type, action)
  }

  subscribe<T extends string>(
    type: T,
    onChange?: (action: Action<T>) => void
  ): () => this {
    this.on(type, (action: Action<T>) => {
      onChange?.(action)
      this.setState(action)
    })

    return () =>
      // eslint-disable-next-line no-console
      this.off(type, () => console.log(`Store unsubscribe successfully`))
  }
}
