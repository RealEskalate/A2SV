import * as actionTypes from "../actionTypes";
//handles different actions to manipulate data on local data store
export default function localSymptomReducer(localSymptoms = [], action) {
  switch (action.type) {
    case actionTypes.symptomRegister:
      return [...localSymptoms, action.symptom];
    case actionTypes.symptomRemove:
      return localSymptoms.filter((symptom) => symptom !== action.symptom);
    default:
      return localSymptoms;
  }
}
