export type Listener<T = unknown> = (...args: T[]) => void

class EventBus {
  private static _instance: EventBus | null = null
  private listeners: Record<string, Listener[]>

  private constructor() {
    this.listeners = {}
  }

  static get instance() {
    if (!EventBus._instance) {
      EventBus._instance = new EventBus()
    }
    return EventBus._instance
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
