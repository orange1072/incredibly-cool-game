export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  tag: string;
  message: string;
  timestamp: number;
  data?: unknown;
}

export default class Logger {
  private tag: string;
  private history: LogEntry[] = [];
  private maxHistory: number;
  private enabled: boolean;
  private levelOrder: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(
    tag = 'Engine',
    private minLevel: LogLevel = 'debug',
    maxHistory = 200
  ) {
    this.tag = tag;
    this.maxHistory = maxHistory;
    this.enabled = true;
  }

  setLevel(level: LogLevel) {
    this.minLevel = level;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  debug(msg: string, data?: unknown) {
    this.log('debug', msg, data);
  }

  info(msg: string, data?: unknown) {
    this.log('info', msg, data);
  }

  warn(msg: string, data?: unknown) {
    this.log('warn', msg, data);
  }

  error(msg: string, data?: unknown) {
    this.log('error', msg, data);
  }

  getHistory(): LogEntry[] {
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    if (!this.enabled) return;
    if (this.levelOrder[level] < this.levelOrder[this.minLevel]) return;

    const entry: LogEntry = {
      level,
      tag: this.tag,
      message,
      timestamp: performance.now(),
      data,
    };

    this.history.push(entry);
    if (this.history.length > this.maxHistory) this.history.shift();

    const prefix = `[${this.tag}] ${level.toUpperCase()}:`;
    switch (level) {
      case 'debug':
        console.debug(prefix, message, data ?? '');
        break;
      case 'info':
        console.info(prefix, message, data ?? '');
        break;
      case 'warn':
        console.warn(prefix, message, data ?? '');
        break;
      case 'error':
        console.error(prefix, message, data ?? '');
        break;
    }
  }
}
