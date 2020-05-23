import * as actionTypes from "../actionTypes";
//handles different actions to manipulate data on local data store
export default function reducer(symptoms = [], action) {
  switch (action.type) {
    case actionTypes.updateSymptoms:
      return action.symptoms;
    default:
      return symptoms;
  }
}
