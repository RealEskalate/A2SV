import * as actionTypes from "../actionTypes";
//stores user  in local data store
export const addUser = (userId, name) => ({
  type: actionTypes.addUser,
  id: userId,
  userName: name,
});
//removes symptom from local data store
export const removeUser = () => ({
  type: actionTypes.removeUserID,
});
