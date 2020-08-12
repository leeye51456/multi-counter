const platformLower = navigator.platform.toLowerCase();
const userAgentLower = navigator.userAgent.toLowerCase();
const appVersionLower = navigator.appVersion.toLowerCase();


export const noOp = () => {};
export const noShortcut = { keyName: '', code: '', shiftKey: false };

export const isMacOs = (
  platformLower.indexOf('mac') !== -1
  || userAgentLower.indexOf('mac') !== -1
  || appVersionLower.indexOf('mac') !== -1
);


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

export const isValidCode = (code) => {
  return validCodes.indexOf(code) !== -1;
}

export const getNotShiftedFromCode = (code) => {
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

export const isValidKey = (key) => {
  return /^[A-Za-z]$/.test(key) || validKeys.indexOf(key) !== -1;
}

export const getNotShiftedFromKey = (key) => {
  if (/[A-Za-z]/.test(key)) {
    return key.toUpperCase();
  } else if (!/[`~!@#$%^&*(),./<>?;':"[\]\\{}|+_=-]/.test(key)) {
    return key;
  }
  return notShiftedKeys[key];
};

const utils = {
  noOp,
  isMacOs,
  isValidCode, getNotShiftedFromCode,
  isValidKey, getNotShiftedFromKey,
};
export default utils;
