import Numbers from "./Numbers";
const UUID_KEY = "LOCAL_UUID";
const UUID = (function () {
  let instance;

  function getNew() {
    let uuid = localStorage.getItem(UUID_KEY);
    if (!uuid) {
      uuid = Numbers.guid();
      localStorage.setItem(UUID_KEY, uuid);
    }
    return uuid;
  }

  return {
    get: function () {
      if (!instance) {
        instance = getNew();
      }
      return instance;
    },
  };
})();

export default UUID;
