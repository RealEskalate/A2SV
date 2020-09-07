import store from "@/store/";

/*
 * this file handles an authentication that we need to check before a route executes
 * */

export function checkRole(to, from, next) {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.getToken === null) {
      next({
        path: `${store.getters.getLanguagePreference}/login`,
        query: { nextUrl: to.fullPath }
      });
    } else {
      if (
        to.matched.some(
          record =>
            record.meta.roles &&
            record.meta.roles.includes(store.getters.getUser.role)
        )
      ) {
        next();
      } else {
        next({
          path: `${store.getters.getLanguagePreference}/404`
        });
      }
    }
  } else {
    if (store.getters.getUser.role === "ephi_user")
      next({
        path: `${store.getters.getLanguagePreference}/admin`
      });
    else next();
  }
}
