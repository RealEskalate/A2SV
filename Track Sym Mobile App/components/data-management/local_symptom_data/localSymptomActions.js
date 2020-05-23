import * as actionTypes from "../actionTypes";
//add specific symptom
export const addSymptom = (userSymptom) => ({
  type: actionTypes.symptomRegister,
  symptom: userSymptom,
});
//removes symptom from local data store
export const removeSymptom = (userSymptom) => ({
  type: actionTypes.symptomRemove,
  symptom: userSymptom,
});
