export const isMacOs = (navigator.platform.toLowerCase().indexOf('mac') !== -1
  || navigator.userAgent.toLowerCase().indexOf('mac') !== -1
  || navigator.appVersion.toLowerCase().indexOf('mac') !== -1);

const keysForDisplaying = {
  '`': '`', '~': '`',
  '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
  '-': '-', '_': '-', '=': '=', '+': '=',
  '[': '[', '{': '[', ']': ']', '}': ']', '\\': '\\', '|': '\\',
  ';': ';', ':': ';', "'": "'", '"': "'",
  ',': ',', '<': ',', '.': '.', '>': '.', '/': '/', '?': '/',
};

export const getKeyForDisplaying = (key) => {
  if (/[A-Za-z]/.test(key)) {
    return key.toUpperCase();
  } else if (!/[`~!@#$%^&*(),./<>?;':"[\]\\{}|+_=-]/.test(key)) {
    return key;
  }
  return keysForDisplaying[key];
};
