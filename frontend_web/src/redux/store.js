import { combineReducers, createStore, applyMiddleware } from "redux";
import authReducer from "./auth/reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import fsmReducer from "./fsm/reducers";
import formsReducer from "./forms/reducers";
import shopReducer from "./shop/reducers";
import { loadState, STORE_LOCAL_STORAGE } from "../_helpers/StoreUtils";

const store = createStore(
  combineReducers({
    auth: authReducer,
    fsm: fsmReducer,
    forms: formsReducer,
    shop: shopReducer,
  }),
  loadState(),
  composeWithDevTools(applyMiddleware(thunk))
);

store.subscribe(() => {
  try {
    console.log(store.getState());
    localStorage.setItem(STORE_LOCAL_STORAGE, JSON.stringify(store.getState()));
  } catch (e) {
    console.error(e);
  }
});

export default store;
