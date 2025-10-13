export type Listener<T = unknown> = (...args: T[]) => void

class EventBus {
  private listeners: Record<string, Listener[]>

  constructor() {
    this.listeners = {}
  }

  on(event: string, callback: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }

    this.listeners[event].push(callback)
  }

  off(event: string, callback: Listener) {
    if (!this.listeners[event]) {
      return
    }

    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    )
  }

  emit(event: string, ...args: unknown[]) {
    if (!this.listeners[event]) {
      return
    }

    this.listeners[event].forEach((listener) => {
      listener(...args)
    })
  }
}

export default EventBus
