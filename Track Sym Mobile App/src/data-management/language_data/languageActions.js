import * as actionTypes from "../actionTypes";
//change language
export const changeLanguage = (languageCode) => ({
  type: actionTypes.changeLanguage,
  language: languageCode,
});
