import * as actionTypes from "../actionTypes";
//handles different actions to manipulate data on local data store
export default function reducer(userId = {}, action) {
  switch (action.type) {
    case actionTypes.addUserID:
      return { ...userId, userId: action.id };
    case actionTypes.removeUserID:
      return { ...userId, userId: "" };
    default:
      return userId;
  }
}
