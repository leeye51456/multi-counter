import CounterData from './counter-data';
import Shortcut from './shortcut';
import ShortcutCollection from './shortcut-collection';


const ITEM_NAMES = {
  COUNTER_ORDER: 'counterOrder',
  COUNTER_PREFIX: 'counter_',
  _STORAGE_TEST: '__storage_test__',
};


const getCounterItemName = (name) => {
  return ITEM_NAMES.COUNTER_PREFIX + name;
};


export const available = (() => {
  try {
    localStorage.setItem(ITEM_NAMES._STORAGE_TEST, ITEM_NAMES._STORAGE_TEST);
    localStorage.removeItem(ITEM_NAMES._STORAGE_TEST);
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
  const INITIAL_COUNTER_NAME = 'Sample Counter';
  setCounterOrder([INITIAL_COUNTER_NAME]);
  setCounterData(new CounterData({ name: INITIAL_COUNTER_NAME }));
  return true;
};


export const getCounterOrder = (isSecondTrial) => {
  if (!available) {
    return null;
  }

  const counterOrderString = localStorage.getItem(ITEM_NAMES.COUNTER_ORDER);
  const counterOrder = JSON.parse(counterOrderString);

  if (counterOrder && counterOrder.constructor === Array) {
    return counterOrder;
  }

  if (isSecondTrial) {
    return null;
  }
  initialize();
  return getCounterOrder(true);
};

export const setCounterOrder = (counterOrder) => {
  if (!available) {
    return null;
  }

  localStorage.setItem(ITEM_NAMES.COUNTER_ORDER, JSON.stringify(counterOrder));
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
    for (const shortcutName of ShortcutCollection.SHORTCUT_NAMES) {
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

const STORED_COUNTER_PROPERTIES = ['name', 'value', 'initial', 'min', 'max', 'step', 'shortcuts'];

export const setCounterData = (counterData) => {
  if (!available) {
    return null;
  }

  const storedCounterData = {};
  for (const property of STORED_COUNTER_PROPERTIES) {
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

  localStorage.clear();
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
