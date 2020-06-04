import Numbers from "./Numbers";
const UUID_KEY = "LOCAL_UUID";
const UUID = (function () {
  let instance;

  function getNew() {
    let uuid = sessionStorage.getItem(UUID_KEY);
    if (!uuid) {
      uuid = Numbers.guid();
      sessionStorage.setItem(UUID_KEY, uuid);
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
