import { includes, isMacOs } from './utils';


export class Shortcut {
  constructor({ code = '', keyName = '', shiftKey = false }) {
    this.code = code;
    this.keyName = keyName;
    this.shiftKey = shiftKey;
  }

  static get NONE() {
    return NONE;
  }
  static get JUMBLED() {
    return JUMBLED;
  }
  static get NO_CHANGE() {
    return NO_CHANGE;
  }

  static isValidCode(code) {
    return isValidCode(code);
  }
  static getNotShiftedFromCode(code) {
    return getNotShiftedFromCode(code);
  }

  static isValidKey(keyName) {
    return isValidKey(keyName);
  }
  static getNotShiftedFromKey(keyName) {
    return getNotShiftedFromKey(keyName);
  }

  getJumbledIfDiffersFrom = (comparisonTarget) => {
    return this.equals(comparisonTarget) ? this : JUMBLED;
  }

  getStringToDisplay = () => {
    let shift;
    if (isMacOs) {
      shift = this.shiftKey ? '⇧' : '';
    } else {
      shift = this.shiftKey ? 'Shift+' : '';
    }

    if (this.code) {
      return `${shift}${getNotShiftedFromCode(this.code)}`;
    }
    return `${shift}${getNotShiftedFromKey(this.keyName)}`;
  }

  equals = (other) => {
    return (
      this.shiftKey === other.shiftKey
      && this.code === other.code
      && this.keyName === other.keyName
    );
  }

  toString = () => {
    const prefix = this.shiftKey ? 'Shift' : '';
    return `${prefix}${this.code || this.keyName}`;
  }
}


const NONE = new Shortcut({ keyName: '', code: '', shiftKey: false });
const JUMBLED = new Shortcut(NONE);
const NO_CHANGE = new Shortcut(NONE);


const notShiftedKeysFromCode = {
  'Backquote': '`', 'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4', 'Digit5': '5', 'Digit6': '6',
  'Digit7': '7', 'Digit8': '8', 'Digit9': '9', 'Digit0': '0', 'Minus': '-', 'Equal': '=',
  'KeyQ': 'Q', 'KeyW': 'W', 'KeyE': 'E', 'KeyR': 'R', 'KeyT': 'T', 'KeyY': 'Y', 'KeyU': 'U', 'KeyI': 'I', 'KeyO': 'O',
  'KeyP': 'P', 'BracketLeft': '[', 'BracketRight': ']', 'Backslash': '\\',
  'KeyA': 'A', 'KeyS': 'S', 'KeyD': 'D', 'KeyF': 'F', 'KeyG': 'G', 'KeyH': 'H', 'KeyJ': 'J', 'KeyK': 'K', 'KeyL': 'L',
  'Semicolon': ';', 'Quote': "'",
  'KeyZ': 'Z', 'KeyX': 'X', 'KeyC': 'C', 'KeyV': 'V', 'KeyB': 'B', 'KeyN': 'N', 'KeyM': 'M', 'Comma': ',',
  'Period': '.', 'Slash': '/',
};
const validCodes = Object.keys(notShiftedKeysFromCode);

const isValidCode = (code) => {
  return includes(validCodes, code);
};

const getNotShiftedFromCode = (code) => {
  const notShifted = notShiftedKeysFromCode[code];
  return notShifted || '';
};


const notShiftedKeys = {
  '`': '`', '~': '`',
  '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
  '-': '-', '_': '-', '=': '=', '+': '=',
  '[': '[', '{': '[', ']': ']', '}': ']', '\\': '\\', '|': '\\',
  ';': ';', ':': ';', "'": "'", '"': "'",
  ',': ',', '<': ',', '.': '.', '>': '.', '/': '/', '?': '/',
};
const validKeys = Object.keys(notShiftedKeys);

const isValidKey = (key) => {
  return /^[A-Za-z]$/.test(key) || includes(validKeys, key);
};

const getNotShiftedFromKey = (key) => {
  if (/[A-Za-z]/.test(key)) {
    return key.toUpperCase();
  } else if (!/[`~!@#$%^&*(),./<>?;':"[\]\\{}|+_=-]/.test(key)) {
    return key;
  }
  return notShiftedKeys[key];
};


export default Shortcut;
