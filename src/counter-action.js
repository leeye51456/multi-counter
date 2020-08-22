const getCorrectCounterValue = (counterData) => {
  const { value, min, max } = counterData;
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
}

const getNewCounterDataWithValue = (counterData, newValue) => {
  const newCounterData = {
    ...counterData,
    value: newValue,
  };
  newCounterData.value = getCorrectCounterValue(newCounterData);
  return newCounterData;
}

const actionPresets = {
  noOp: () => {},
  getCountedUp: (counterData) => getNewCounterDataWithValue(counterData, counterData.value + counterData.step),
  getCountedDown: (counterData) => getNewCounterDataWithValue(counterData, counterData.value - counterData.step),
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
