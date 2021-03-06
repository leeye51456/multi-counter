import Shortcut from './shortcut';

export class ShortcutCollection {
  constructor(initialShortcutCollection) {
    for (const field of shortcutNames) {
      if (initialShortcutCollection && initialShortcutCollection[field]) {
        this[field] = initialShortcutCollection[field];
      } else {
        this[field] = Shortcut.NONE;
      }
    }
  }

  static get EMPTY() {
    return EMPTY;
  }

  static get shortcutNames() {
    return shortcutNames;
  }

  getDifferenceMarked = (comparisonTarget) => {
    const result = new ShortcutCollection(this);
    for (const field of shortcutNames) {
      result[field] = this[field].getJumbledIfDiffersFrom(comparisonTarget[field]);
    }
    return result;
  }

  equals = (other) => {
    const thisFields = Object.keys(this);
    const otherFields = Object.keys(other);
    return (
      thisFields.length === otherFields.length
      && thisFields.every((thisField) => this[thisField] === other[thisField])
    );
  }
}

const shortcutNames = ['countUp', 'countDown'];
const EMPTY = new ShortcutCollection();

export default ShortcutCollection;
