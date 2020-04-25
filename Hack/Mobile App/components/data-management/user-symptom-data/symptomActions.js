import * as actionTypes from "../actionTypes";
//stores symptom in local data store
export const addSymptom = (userSymptoms) => ({
  type: actionTypes.symptomRegister,
  symptoms: userSymptoms,
});
//removes symptom from local data store
export const removeSymptom = (userSymptom) => ({
  type: actionTypes.symptomRemove,
  symptoms: userSymptoms,
});
