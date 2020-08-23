const Dashboard = () => import("../views-admin/dashboard/Dashboard.vue");

const CreateAccount = () => import("../views-admin/auth/CreateAccount.vue");
const Verify = () => import("../views-admin/auth/Verify.vue");
const InviteAdmin = () => import("../views-admin/auth/InviteAdmin.vue");

const Symptoms = () => import("../views-admin/symptoms/Symptoms.vue");

export const admin = [
  { name: "CreateAccount", path: "register", component: CreateAccount },
  { name: "Verify", path: "verify", component: Verify },
  { name: "Symptoms", path: "symptoms", component: Symptoms },
  { name: "InviteAdmin", path: "invite-admin", component: InviteAdmin },
  { name: "Dashboard", path: "/", component: Dashboard }
];
