const noShortcut = { keyName: '', code: '', shiftKey: false };
const jumbledShortcut = { ...noShortcut };

export class Shortcut {
  constructor({ code, keyName, shiftKey }) {
    this.code = code;
    this.keyName = keyName;
    this.shiftKey = shiftKey;
  }

  static get noShortcut() {
    return noShortcut;
  }
  static get jumbledShortcut() {
    return jumbledShortcut;;
  }

  getJumbledIfDiffersFrom = (comparisonTarget) => {
    return this.equals(comparisonTarget) ? this : jumbledShortcut;
  }

  equals = (other) => {
    if (this.shiftKey !== other.shiftKey) {
      return false;
    } else if (this.code && other.code) {
      return this.code === other.code;
    } else if ((this.code && !other.code) || (!this.code && other.code)) {
      return false;
    } else if (this.keyName && other.keyName) {
      return this.keyName === other.keyName;
    }
    return false;
  }

  toString = () => {
    const prefix = this.shiftKey ? 'Shift' : '';
    return `${prefix}${this.code || this.keyName}`;
  }
}

export default Shortcut;
