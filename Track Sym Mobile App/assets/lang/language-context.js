import React from "react";

export const LangContext = React.createContext({
  lang: "en",
  changeLang: () => {},
});
