const LocalDB = {
  set: (key, value) => localStorage.setItem(key, value),
  get: (key) => localStorage.getItem(key),
  del: (key) => localStorage.removeItem(key),
};

export default LocalDB;
