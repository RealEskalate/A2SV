const Users = () => import("../views-admin/users/Users");

const Dashboard = () => import("../views-admin/dashboard/Dashboard.vue");

const CreateAccount = () => import("../views-admin/auth/CreateAccount.vue");
const ForgotPassword = () => import("../views-admin/auth/ForgotPassword");
const ChangePassword = () => import("../views-admin/auth/ChangePassword.vue");
const InviteAdmin = () => import("../views-admin/auth/InviteAdmin.vue");
const Login = () => import("../views-admin/auth/Login.vue");

const Symptoms = () => import("../views-admin/symptoms/Symptoms.vue");
const Cases = () => import("../views-admin/cases/Cases.vue");

export const admin = [
  {
    name: "AdminLogin",
    path: "login",
    component: Login,
    meta: {
      guest: true
    }
  },
  {
    name: "CreateAccount",
    path: "register",
    component: CreateAccount,
    meta: {
      guest: true
    }
  },
  {
    name: "ChangePassword",
    path: "change-password",
    component: ChangePassword,
    meta: {
      requiresAuth: true,
      roles: ["ephi_user"]
    }
  },
  {
    name: "ResetPassword",
    path: "reset-password",
    component: ForgotPassword,
    meta: {
      requiresAuth: true,
      roles: ["ephi_user"]
    }
  },
  {
    name: "Symptoms",
    path: "symptoms",
    component: Symptoms,
    meta: {
      requiresAuth: true,
      roles: ["ephi_user"]
    }
  },
  {
    name: "Cases",
    path: "cases",
    component: Cases,
    meta: {
      requiresAuth: true,
      roles: ["ephi_user"]
    }
  },
  {
    name: "InviteAdmin",
    path: "invite-admin",
    component: InviteAdmin,
    meta: {
      requiresAuth: true,
      roles: ["ephi_user"]
    }
  },
  {
    name: "Users",
    path: "users",
    component: Users,
    meta: {
      requiresAuth: true,
      roles: ["ephi_user"]
    }
  },
  {
    name: "Dashboard",
    path: "/",
    component: Dashboard,
    meta: {
      requiresAuth: true,
      roles: ["ephi_user"]
    }
  }
];
