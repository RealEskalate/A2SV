import * as actionTypes from "../actionTypes";
//stores user  in local data store
export const addUser = (userId, name, token, ageGroup, gender) => ({
  type: actionTypes.addUser,
  id: userId,
  userName: name,
  userToken: token,
  userAgeGroup: ageGroup,
  userGender: gender,
});
//removes symptom from local data store
export const removeUser = () => ({
  type: actionTypes.removeUser,
});
