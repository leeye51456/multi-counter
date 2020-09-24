import CounterData from './counter-data';
import Shortcut from './shortcut';
import ShortcutCollection from './shortcut-collection';


const itemNames = {
  COUNTER_ORDER: 'counterOrder',
  COUNTER_PREFIX: 'counter_',
  _STORAGE_TEST: '__storage_test__',
};


const getCounterItemName = (name) => {
  return itemNames.COUNTER_PREFIX + name;
};


export const available = (() => {
  try {
    localStorage.setItem(itemNames._STORAGE_TEST, itemNames._STORAGE_TEST);
    localStorage.removeItem(itemNames._STORAGE_TEST);
    return true;
  } catch (e) {
    return false;
  }
})();


export const initialize = () => {
  if (!available) {
    return null;
  }

  clear();
  setCounterOrder([CounterData.DEFAULT.name]);
  setCounterData(CounterData.DEFAULT);
  return true;
};


export const getCounterOrder = (preventMoreTrial) => {
  if (!available) {
    return null;
  }

  const counterOrderString = localStorage.getItem(itemNames.COUNTER_ORDER);
  const counterOrder = JSON.parse(counterOrderString);

  if (counterOrder && counterOrder.constructor === Array) {
    return counterOrder;
  }

  if (preventMoreTrial) {
    return null;
  }
  initialize();
  return getCounterOrder(true);
};

export const setCounterOrder = (counterOrder) => {
  if (!available) {
    return null;
  }

  localStorage.setItem(itemNames.COUNTER_ORDER, JSON.stringify(counterOrder));
  return true;
};


export const getCounterData = (name) => {
  if (!available) {
    return null;
  }

  const counterDataString = localStorage.getItem(getCounterItemName(name));
  const counterData = JSON.parse(counterDataString);
  if (!counterData) {
    return null;
  }

  if (counterData.shortcuts) {
    for (const shortcutName of ShortcutCollection.shortcutNames) {
      counterData.shortcuts[shortcutName] = (
        counterData.shortcuts[shortcutName]
        ? new Shortcut(counterData.shortcuts[shortcutName])
        : Shortcut.NONE
      );
    }
    counterData.shortcuts = new ShortcutCollection(counterData.shortcuts);
  }

  return new CounterData(counterData);
};

const storedCounterProperties = ['name', 'value', 'initial', 'min', 'max', 'step', 'shortcuts'];

export const setCounterData = (counterData) => {
  if (!available) {
    return null;
  }

  const storedCounterData = {};
  for (const property of storedCounterProperties) {
    storedCounterData[property] = counterData[property];
  }

  localStorage.setItem(getCounterItemName(counterData.name), JSON.stringify(storedCounterData));
  return true;
};


export const removeCounterData = (name) => {
  if (!available) {
    return null;
  }

  localStorage.removeItem(getCounterItemName(name));
  return true;
};


export const clear = () => {
  if (!available) {
    return null;
  }

  const counterOrder = getCounterOrder(true);
  if (counterOrder !== null) {
    for (const name of counterOrder) {
      localStorage.removeItem(getCounterItemName(name));
    }
  }
  localStorage.removeItem(itemNames.COUNTER_ORDER);

  return true;
};


const localStorageManager = {
  available,
  initialize,
  getCounterOrder, setCounterOrder,
  getCounterData, setCounterData, removeCounterData,
  clear,
};
export default localStorageManager;
