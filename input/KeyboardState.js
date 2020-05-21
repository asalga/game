const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {

  constructor() {
    this.keyStates = new Map;
    this.keyMap = new Map;
  }

  addMapping(code, cb) {
    this.keyMap.set(code, cb);
    // console.log(this.keyMap);
  }

  handleEvent(evt) {
    let { code, type } = evt;

    // If there's no mapping, just ignore it
    if (!this.keyMap.has(code)) return;

    evt.preventDefault();

    const keystate = type === 'keydown' ? PRESSED : RELEASED;

    // Only chnage state if necessary
    if (keystate === this.keyStates.get(code)) return;

    this.keyStates.set(code, keystate);
    this.keyMap.get(code)(keystate);
  }

  listenTo(w) {
    w.addEventListener('keydown', evt => this.handleEvent(evt));
    w.addEventListener('keyup', evt => this.handleEvent(evt));
  }
}