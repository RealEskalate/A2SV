import { createStore } from "redux";
import reducer from "./userIDReducers";

const userIDStore = createStore(reducer);

export default userIDStore;
