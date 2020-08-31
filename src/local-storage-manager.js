import CounterData from './counter-data';
import Shortcut from './shortcut';
import ShortcutCollection from './shortcut-collection';


const getCounterItemName = (name) => {
  return `counter_${name}`;
}


export const available = (() => {
  try {
    localStorage.setItem('__storage_test__', '__storage_test__');
    localStorage.removeItem('__storage_test__');
    return true;
  } catch (e) {
    return false;
  }
})();


export const getCounterOrder = () => {
  if (!available) {
    return null;
  }

  const counterOrderString = window.localStorage.getItem('counterOrder');
  const counterOrder = JSON.parse(counterOrderString);
  console.log(counterOrderString, counterOrder);
  if (counterOrder.constructor !== Array) {
    window.localStorage.setItem('counterOrder', '[]');
    return [];
  }

  return counterOrder;
};

export const setCounterOrder = (counterOrder) => {
  if (!available) {
    return null;
  }

  localStorage.setItem('counterOrder', JSON.stringify(counterOrder));
  return true;
};


export const getCounterData = (name) => {
  if (!available) {
    return null;
  }

  const counterDataString = localStorage.getItem(getCounterItemName(name));
  const counterData = JSON.parse(counterDataString);
  console.log(counterDataString, counterData);
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

  localStorage.setItem(counterData.name, JSON.stringify(storedCounterData));
  return true;
};


export const removeCounterData = (name) => {
  if (!available) {
    return null;
  }

  localStorage.removeItem(getCounterItemName(name));
  return true;
}


export const clear = () => {
  if (!available) {
    return null;
  }

  localStorage.clear();
  return true;
}


const localStorageManager = {
  available,
  getCounterOrder, setCounterOrder,
  getCounterData, setCounterData, removeCounterData,
  clear,
};
export default localStorageManager;
