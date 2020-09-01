const Users = () => import("../views-admin/users/Users");

const Dashboard = () => import("../views-admin/dashboard/Dashboard.vue");

const CreateAccount = () => import("../views-admin/auth/CreateAccount.vue");
const ForgotPassword = () => import("../views-admin/auth/ForgotPassword");
const ChangePassword = () => import("../views-admin/auth/ChangePassword.vue");
const InviteAdmin = () => import("../views-admin/auth/InviteAdmin.vue");
// const Login = () => import("../views-admin/auth/Login.vue");

const Symptoms = () => import("../views-admin/symptoms/Symptoms.vue");

export const admin = [
  {
    name: "Create Account",
    path: "register",
    component: CreateAccount,
    meta: {
      guest: true
    }
  },
  {
    name: "Change Password",
    path: "change-password",
    component: ChangePassword,
    meta: {
      guest: true
    }
  },
  {
    name: "Reset Password",
    path: "reset-password",
    component: ForgotPassword,
    meta: {
      guest: true
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
    name: "Invite Admin",
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
