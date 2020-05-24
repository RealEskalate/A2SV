import { createStore } from "redux";
import localSymptomReducer from "./localSymptomReducers";

const localSymptomStore = createStore(localSymptomReducer);

export default localSymptomStore;
