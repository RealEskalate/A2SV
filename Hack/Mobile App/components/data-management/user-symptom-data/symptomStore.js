import { createStore } from "redux";
import reducer from "./symptomReducers";
import SymptomPage from "../../symptom-page/SymptomPage";

const symptomStore = createStore(reducer);

export default symptomStore;
