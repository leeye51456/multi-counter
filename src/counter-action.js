import { getCorrectCounterValue } from './counter';


const getNewCounterDataWithValue = (counterData, newValue) => {
  const newCounterData = {
    ...counterData,
    value: newValue,
  };
  newCounterData.value = getCorrectCounterValue(newCounterData);
  return newCounterData;
}

export const actionPresets = {
  getCountedUp: (counterData) => getNewCounterDataWithValue(counterData, counterData.value + counterData.step),
  getCountedDown: (counterData) => getNewCounterDataWithValue(counterData, counterData.value - counterData.step),
};

export class CounterAction {
  constructor(target, action) {
    this.target = target;
    this.execute = action;
  }
}

export default CounterAction;
