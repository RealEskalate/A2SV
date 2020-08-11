const Dashboard = () => import("../views-admin/dashboard/Dashboard.vue");
const CreateAccount = () => import("../views-admin/auth/CreateAccount.vue");
const Symptoms = () => import("../views-admin/symptoms/Symptoms.vue");
const SymptomDetails = () =>
  import("../views-admin/symptoms/SymptomDetails.vue");

export const admin = [
  { name: "CreateAccount", path: "register", component: CreateAccount },
  { name: "Symptoms", path: "symptoms", component: Symptoms },
  {
    name: "SymptomDetails",
    path: "symptoms/:id/details",
    component: SymptomDetails
  },
  { name: "Dashboard", path: "/", component: Dashboard }
];
