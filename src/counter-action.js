import CounterData from './counter-data';

const PRESETS = {
  GET_COUNTED_UP: (counterData) => (
    new CounterData({ ...counterData, value: counterData.value + counterData.step })
      .getCorrectedCounterData()
  ),
  GET_COUNTED_DOWN: (counterData) => (
    new CounterData({ ...counterData, value: counterData.value - counterData.step })
      .getCorrectedCounterData()
  ),
};

export class CounterAction {
  constructor(target, action) {
    this.target = target;
    this.execute = action;
  }

  static get PRESETS() {
    return PRESETS;
  }
}

export default CounterAction;
