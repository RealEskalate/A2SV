import * as actionTypes from "../actionTypes";
//handles different actions to manipulate data on local data store
export default function reducer(userId = {}, action) {
  switch (action.type) {
    case actionTypes.addUser:
      return {
        ...userId,
        userId: action.id,
        userName: action.userName,
        userToken: action.userToken,
        userAgeGroup: action.userAgeGroup,
        gender: action.userGender,
      };
    case actionTypes.removeUser:
      return { ...userId, userId: "", userName: "" };
    default:
      return userId;
  }
}
