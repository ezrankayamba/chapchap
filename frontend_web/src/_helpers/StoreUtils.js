export const STORE_LOCAL_STORAGE = "REDUX";

export const loadState = () => {
  try {
    let storedState = localStorage.getItem(STORE_LOCAL_STORAGE);
    return storedState === null ? undefined : JSON.parse(storedState);
  } catch (e) {}
  return undefined;
};
export const getInitialData = (name) => {
  let loaded = loadState();
  if (!loaded) return null;
  return loaded[name];
};
