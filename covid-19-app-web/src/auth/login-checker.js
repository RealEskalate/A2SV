import store from "@/store/";
import router from "../router";

/*
 * this file handles an authentication that we need to check before a route executes
 * */
export const ifNotAuthenticated = (to, from, next) => {
  store.dispatch("resetMessage").then();
  if (store.getters.getToken === null) {
    next();
    return; // return if not authenticated
  }
  router.push({ name: "Login" });
};

export const ifAuthenticated = (to, from, next) => {
  store.dispatch("resetMessage").then();
  if (store.getters.getToken !== null) {
    next();
    return;
  }
  console.log(true);
  router.push(`${store.getters.getLanguagePreference}/login`);
};
