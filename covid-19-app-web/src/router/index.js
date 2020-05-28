import Vue from "vue";
import VueRouter from "vue-router";

const NotFound = () => import("@/views/Errors/404.vue");
const Home = () => import("@/views/Home/Home.vue");
const Information = () => import("@/views/Information/Information.vue");
const About = () => import("@/views/About/About.vue");
const News = () => import("@/views/News/News.vue");
const HeatMap = () => import("@/views/HeatMap/HeatMap.vue");
const PrivacyPolicy = () => import("@/views/PrivacyPolicy/PrivacyPolicy.vue");

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/information", name: "Learn", component: Information },
  {path: "/privacy-policy", name: "PrivacyPolicy", component: PrivacyPolicy},
  { path: "/about", name: "About", component: About },
  { path: "/news", name: "News", component: News },
  { path: "/map", name: "Map", component: HeatMap },
  { path: "*", name: "404", component: NotFound }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
