import Counter from "./counter";

const propsForComparison = ['initial', 'min', 'max', 'step'];

export class CounterData {
  constructor({ name, value, initial, min, max, step, checked, onChange, shortcuts }) {
    this.name = name;
    this.value = value;
    this.initial = initial;
    this.min = min;
    this.max = max;
    this.step = step;
    this.checked = checked;
    this.onChange = onChange;
    this.shortcuts = shortcuts;
  }

  static get propsForComparison() {
    return propsForComparison;
  }

  getComparisonObject = () => {
    const resultBase = {};
    for (const prop of propsForComparison) {
      resultBase[prop] = this[prop];
    }
    return new Counter(resultBase);
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

export default CounterData;
