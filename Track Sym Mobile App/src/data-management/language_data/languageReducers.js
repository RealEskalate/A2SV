import * as actionTypes from "../actionTypes";
//handles different actions to manipulate data on local data store
export default function languageReducer(language = "en", action) {
  switch (action.type) {
    case actionTypes.changeLanguage:
      return action.language;
    default:
      return language;
  }
}
