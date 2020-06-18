import { createStore } from "redux";
import languageReducer from "./languageReducers";

const languageStore = createStore(languageReducer);

export default languageStore;
