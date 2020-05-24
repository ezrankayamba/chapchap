export const STORE_LOCAL_STORAGE = "REDUX";

export const loadState = () => {
  try {
    let storedState = localStorage.getItem(STORE_LOCAL_STORAGE);
    console.log(JSON.parse(storedState));
    return storedState === null ? undefined : JSON.parse(storedState);
  } catch (e) {
    console.log("Error: ", e);
  }
  return undefined;
};
export const getInitialData = (name) => {
  let loaded = loadState();
  if (!loaded) return null;
  return loaded[name];
};
