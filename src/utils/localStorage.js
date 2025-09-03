export function setLocalStorageKey(key, value) {
  if (value) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
}

export function getLocalStorageKey(key) {
  return localStorage.getItem(key);
}
