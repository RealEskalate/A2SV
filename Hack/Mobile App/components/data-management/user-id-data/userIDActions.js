import * as actionTypes from "../actionTypes";
//stores symptom in local data store
export const addUserId = (userId) => ({
  type: actionTypes.addUserID,
  id: userId,
});
//removes symptom from local data store
export const removeUserId = (id) => ({
  type: actionTypes.removeUserID,
  id: "",
});
