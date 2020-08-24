import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/";
import { languages } from "@/plugins/i18n";
import { admin } from "./admin";
import { userRoutes } from "./user-routes";
import { checkRole } from "../auth/login-checker";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "root",
    beforeEnter(to, from, next) {
      if (store.getters.getLanguagePreference === null) next("en");
      else {
        next(`${store.getters.getLanguagePreference}`);
      }
    }
  },
  {
    path: "/:lang",
    component: {
      template: "<router-view />"
    },
    beforeEnter(to, from, next) {
      let lang = to.params.lang;
      if (languages.includes(lang)) {
        if (store.getters.getLanguagePreference !== lang) {
          store.dispatch("setLanguagePreference", { lang });
        }
        return next();
      }
      return next({ path: `${store.getters.getLanguagePreference}` });
    },
    children: [
      {
        path: "admin",
        component: {
          template: "<router-view />"
        },
        children: [...admin]
      },
      ...userRoutes
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach(checkRole);

export default router;
