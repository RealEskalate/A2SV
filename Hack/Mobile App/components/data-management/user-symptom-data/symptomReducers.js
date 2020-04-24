import * as actionTypes from "../actionTypes";
//handles different actions to manipulate data on local data store
export default function reducer(symptoms = [], action) {
  switch (action.type) {
    case actionTypes.symptomRegister:
      return [...symptoms, action.symptom];
    case actionTypes.symptomRemove:
      return symptoms.filter((symptom) => symptom !== action.symptom);
    default:
      return symptoms;
  }
}
