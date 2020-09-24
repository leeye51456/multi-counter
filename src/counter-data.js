import Counter from './counter';
import ShortcutCollection from './shortcut-collection';

export class CounterData {
  constructor(param) {
    const { name, value, initial, min, max, step, checked, onChange, onEditClick, shortcuts } = {
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
    this.onEditClick = onEditClick;
    this.shortcuts = shortcuts ? shortcuts : ShortcutCollection.EMPTY;
  }

  static get DEFAULT() {
    return defaultCounter;
  }

  static get manipulatorProps() {
    return manipulatorProps;
  }

  getCorrectedValue = () => {
    if (this.value < this.min) {
      return this.min;
    } else if (this.value > this.max) {
      return this.max;
    }
    return this.value;
  }

  getCorrectedCounterData = () => {
    return new CounterData({
      ...this,
      value: this.getCorrectedValue(),
    });
  }

  getComparisonObject = () => {
    const resultBase = {};
    for (const prop of manipulatorProps) {
      resultBase[prop] = this[prop];
    }
    return new CounterData(resultBase);
  }

  getJumbledIfDiffersFrom = (other) => {
    const result = new CounterData(this);
    for (const prop of manipulatorProps) {
      if (this[prop] !== other[prop]) {
        result[prop] = '';
      }
    }
    return result;
  }
}

const defaultCounter = new CounterData({
  name: 'Sample Counter',
  value: 0,
  initial: 0,
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
});

const manipulatorProps = ['value', 'initial', 'min', 'max', 'step'];

export default CounterData;
