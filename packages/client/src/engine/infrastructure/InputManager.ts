class InputManager {
  private keys = new Set<string>();

  private keyDownHandler = (e: KeyboardEvent) => {
    for (const key of this.resolveAliases(e)) {
      this.keys.add(key);
    }
  };

  private keyUpHandler = (e: KeyboardEvent) => {
    for (const key of this.resolveAliases(e)) {
      this.keys.delete(key);
    }
  };

  constructor() {
    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
  }

  isPressed(key: string) {
    const normalized = key.length === 1 ? key.toLowerCase() : key;
    return this.keys.has(key) || this.keys.has(normalized);
  }

  update(dt: number) {
    // при желании диспатчить события в Redux
    void dt;
  }

  onDestroy() {
    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
  }

  private resolveAliases(e: KeyboardEvent) {
    const aliases = new Set<string>();
    const normalizedKey = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    aliases.add(normalizedKey);
    aliases.add(e.key);

    if (e.code) {
      aliases.add(e.code);
      if (e.code.startsWith('Key') && e.code.length === 4) {
        aliases.add(e.code.slice(3).toLowerCase());
      }
    }

    return aliases;
  }
}

export default InputManager;
