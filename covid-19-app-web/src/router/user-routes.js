import {ifAuthenticated, ifNotAuthenticated} from "../auth/login-checker";

const NotFound = () => import("@/views/Errors/404.vue");
const Home = () => import("@/views/Home/Home.vue");
const Information = () => import("@/views/Information/Information.vue");
const About = () => import("@/views/About/About.vue");
const News = () => import("@/views/News/News.vue");
const HeatMap = () => import("@/views/HeatMap/HeatMap.vue");
const Profile = () => import("@/views/Profile/Profile.vue");
const References = () => import("@/views/References/References.vue");
const PrivacyPolicy = () => import("@/views/PrivacyPolicy/PrivacyPolicy.vue");
const Login = () => import("@/views/Auth/Login.vue");
const Register = () => import("@/views/Auth/Register.vue");

export const userRoutes = [
  {path: "information", name: "Learn", component: Information},
  {
    path: "privacy-policy",
    name: "PrivacyPolicy",
    component: PrivacyPolicy
  },
  {path: "references", name: "References", component: References},
  {
    path: "profile",
    name: "Profile",
    component: Profile,
    beforeEnter: ifAuthenticated
  },
  {
    path: "register",
    name: "Register",
    component: Register,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: "login",
    name: "Login",
    component: Login,
    beforeEnter: ifNotAuthenticated
  },
  {path: "about", name: "About", component: About},
  {path: "news", name: "News", component: News},
  {path: "map", name: "Map", component: HeatMap},
  {path: "", name: "Home", component: Home},
  {path: "*", name: "404", component: NotFound}
];
