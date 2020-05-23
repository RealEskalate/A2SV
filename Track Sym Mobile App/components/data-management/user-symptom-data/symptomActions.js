import * as actionTypes from "../actionTypes";
//update whole symptom list
export const updateSymptomList = (userSymptoms) => ({
  type: actionTypes.updateSymptoms,
  symptoms: userSymptoms,
});
