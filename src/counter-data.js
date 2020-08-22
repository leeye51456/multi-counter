import Counter from './counter';
import ShortcutCollection from './shortcut-collection';

export class CounterData {
  constructor(param) {
    const { name, value, initial, min, max, step, checked, onChange, shortcuts } = {
      ...Counter.defaultProps,
      ...param,
    };
    this.name = name;
    this.value = value;
    this.initial = initial;
    this.min = min;
    this.max = max;
    this.step = step;
    this.checked = checked;
    this.onChange = onChange;
    this.shortcuts = shortcuts ? shortcuts : ShortcutCollection.emptyShortcutCollection;
  }

  static get propsForComparison() {
    return propsForComparison;
  }

  getComparisonObject = () => {
    const resultBase = {};
    for (const prop of propsForComparison) {
      resultBase[prop] = this[prop];
    }
    return new CounterData(resultBase);
  }

  getJumbledIfDiffersFrom = (other) => {
    const result = new CounterData(this);
    for (const prop of propsForComparison) {
      if (this[prop] !== other[prop]) {
        result[prop] = '';
      }
    }
    return result;
  }
}

const propsForComparison = ['initial', 'min', 'max', 'step'];

export default CounterData;
