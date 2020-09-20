export const includes = (obj, target) => {
  if (target === 'indexOf') {
    return !!obj.indexOf;
  }
  if (obj.indexOf) {
    return obj.indexOf(target) !== -1;
  }
  return !!obj[target];
};


export const initializeOrGetArrayProperty = (obj, key) => {
  if (!obj[key]) {
    obj[key] = [];
  }
  return obj[key];
};


const platformLower = navigator.platform.toLowerCase();
const userAgentLower = navigator.userAgent.toLowerCase();
const appVersionLower = navigator.appVersion.toLowerCase();

export const isMacOs = (
  includes(platformLower, 'mac')
  || includes(userAgentLower, 'mac')
  || includes(appVersionLower, 'mac')
);


const textInputTypes = [
  'date', 'datetime-local', 'email', 'month', 'number', 'password', 'search', 'tel', 'text', 'time', 'url', 'week'
];

export const isTextForm = (element) => {
  const tagName = element.tagName.toUpperCase();
  return (
    (tagName === 'INPUT' && includes(textInputTypes, element.type.toLowerCase()))
    || tagName === 'TEXTAREA'
  );
};


export const insertCommas = (integerValue) => {
  return integerValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export const numbersWithCommas = {
  MAX_SAFE_INTEGER: insertCommas(Number.MAX_SAFE_INTEGER),
  MIN_SAFE_INTEGER: insertCommas(Number.MIN_SAFE_INTEGER),
};


const utils = {
  includes,
  initializeOrGetArrayProperty,
  isMacOs,
  isTextForm,
  insertCommas, numbersWithCommas,
};
export default utils;
