import CounterData from './counter-data';

const actionPresets = {
  noOp: () => {},
  getCountedUp: (counterData) => (
    new CounterData({ ...counterData, value: counterData.value + counterData.step })
      .getCorrectedCounterData()
  ),
  getCountedDown: (counterData) => (
    new CounterData({ ...counterData, value: counterData.value - counterData.step })
      .getCorrectedCounterData()
  ),
};

export class CounterAction {
  constructor(target, action) {
    this.target = target;
    this.execute = action;
  }

  static get actionPresets() {
    return actionPresets;
  }
}

export default CounterAction;
