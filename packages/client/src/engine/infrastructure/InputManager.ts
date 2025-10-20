class InputManager {
  private keys = new Set<string>();

  constructor() {
    window.addEventListener('keydown', (e) => this.keys.add(e.key));
    window.addEventListener('keyup', (e) => this.keys.delete(e.key));
  }

  isPressed(key: string) {
    return this.keys.has(key);
  }

  update(dt: number) {
    // при желании диспатчить события в Redux
    void dt;
  }
}

export default InputManager;
