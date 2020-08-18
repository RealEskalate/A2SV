const Dashboard = () => import("../views-admin/dashboard/Dashboard.vue");

const CreateAccount = () => import("../views-admin/auth/CreateAccount.vue");
const ForgotPassword = () => import("../views-admin/auth/ForgotPassword");
const ChangePassword = () => import("../views-admin/auth/ChangePassword.vue");
const InviteAdmin = () => import("../views-admin/auth/InviteAdmin.vue");
const Login = () => import("../views-admin/auth/Login.vue");

const Symptoms = () => import("../views-admin/symptoms/Symptoms.vue");
const SymptomDetails = () =>
  import("../views-admin/symptoms/SymptomDetails.vue");

export const admin = [
  { name: "AdminLogin", path: "login", component: Login },
  { name: "CreateAccount", path: "register", component: CreateAccount },
  {
    name: "ChangePassword",
    path: "change-password",
    component: ChangePassword
  },
  {
    name: "ResetPassword",
    path: "reset-password",
    component: ForgotPassword
  },
  { name: "Symptoms", path: "symptoms", component: Symptoms },
  { name: "InviteAdmin", path: "invite-admin", component: InviteAdmin },
  {
    name: "SymptomDetails",
    path: "symptoms/:id/details",
    component: SymptomDetails
  },
  { name: "Dashboard", path: "/", component: Dashboard }
];
