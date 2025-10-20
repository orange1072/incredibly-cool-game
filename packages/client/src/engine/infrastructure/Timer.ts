type Callback = () => void

interface TimerTask {
  id: string
  delay: number
  repeat: boolean
  elapsed: number
  callback: Callback
}

export default class Timer {
  private tasks: Map<string, TimerTask> = new Map()

  setTimeout(callback: Callback, delay: number): string {
    const id = crypto.randomUUID()
    this.tasks.set(id, { id, delay, repeat: false, elapsed: 0, callback })
    return id
  }

  setInterval(callback: Callback, delay: number): string {
    const id = crypto.randomUUID()
    this.tasks.set(id, { id, delay, repeat: true, elapsed: 0, callback })
    return id
  }

  clear(id: string): void {
    this.tasks.delete(id)
  }

  clearAll(): void {
    this.tasks.clear()
  }

  update(dt: number): void {
    for (const task of this.tasks.values()) {
      task.elapsed += dt

      if (task.elapsed >= task.delay) {
        task.callback()

        if (task.repeat) {
          task.elapsed = 0
        } else {
          this.tasks.delete(task.id)
        }
      }
    }
  }
}
