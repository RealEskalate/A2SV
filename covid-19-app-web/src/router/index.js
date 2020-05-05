import Vue from "vue";
import VueRouter from "vue-router";

const NotFound = () => import("@/views/errors/404.vue");
const Home = () => import("@/views/Home/Home.vue");
const Information = () => import("@/views/Information/Information.vue");
const About = () => import("@/views/About/About.vue");
const News = () => import("@/views/News/News.vue");
const HeatMap = () => import("@/views/HeatMap/HeatMap.vue");

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/information", name: "Information", component: Information },
  { path: "/about", name: "About", component: About },
  { path: "/news", name: "News", component: News },
  { path: "/map", name: "HeatMap", component: HeatMap },

  { path: "*", name: "404", component: NotFound }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
