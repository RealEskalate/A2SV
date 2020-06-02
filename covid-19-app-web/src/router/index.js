import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/";
import {languages} from "@/plugins/i18n";

const NotFound = () => import("@/views/Errors/404.vue");
const Home = () => import("@/views/Home/Home.vue");
const Information = () => import("@/views/Information/Information.vue");
const About = () => import("@/views/About/About.vue");
const News = () => import("@/views/News/News.vue");
const HeatMap = () => import("@/views/HeatMap/HeatMap.vue");
const References = () => import("@/views/References/References.vue");
const PrivacyPolicy = () => import("@/views/PrivacyPolicy/PrivacyPolicy.vue");
const Login = () => import("@/views/Auth/Login.vue");
const Register = () => import("@/views/Auth/Register.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "root",
    beforeEnter(to, from, next) {
      console.log("this tooo");
      if (store.getters.getLanguagePreference === null) next("/en/");
      else {
        next(`/${store.getters.getLanguagePreference}/`);
      }
    }
  },
  {
    path: "/:lang",
    component: {
      template: "<router-view />"
    },
    beforeEnter(to, from, next) {
      console.log(to);
      console.log(to.params);
      let lang = to.params.lang;
      if (languages.includes(lang)) {
        if (store.getters.getLanguagePreference !== lang) {
          store.dispatch("setLanguagePreference", {lang});
        }
        return next();
      }
      return next({path: `/${store.getters.getLanguagePreference}/`});
    },
    children: [
      {path: "information", name: "Learn", component: Information},
      {
        path: "privacy-policy",
        name: "PrivacyPolicy",
        component: PrivacyPolicy
      },
      {path: "references", name: "References", component: References},
      {path: "register", name: "Register", component: Register},
      {path: "login", name: "Login", component: Login},
      {path: "about", name: "About", component: About},
      {path: "news", name: "News", component: News},
      {path: "map", name: "Map", component: HeatMap},
      {path: "", name: "Home", component: Home},
      {path: "*", name: "404", component: NotFound}
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
