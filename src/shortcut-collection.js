import Shortcut from './shortcut';

const shortcutNames = ['countUp', 'countDown'];

export class ShortcutCollection {
  constructor(initialShortcutCollection) {
    if (typeof initialShortcutCollection === 'object') {
      for (const field of shortcutNames) {
        if (initialShortcutCollection[field]) {
          this[field] = initialShortcutCollection[field];
        } else {
          this[field] = Shortcut.noShortcut;
        }
      }
    }
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

export default ShortcutCollection;
