<template>
  <v-navigation-drawer
    width="350"
    height="100%"
    v-model="side_bar"
    right
    absolute
    bottom
    color="#F5F6F7"
    class="shadow-sm pb-9"
  >
    <v-card color="primary" dark class="">
      <v-row class="align-self-center align-center align-content-center">
        <v-icon color="white" class="ml-5" @click="close">{{
          mdiClose
        }}</v-icon>
        <p class="display-1 mx-auto my-2" style="color: white!important;">
          Profile Details
        </p>
      </v-row>
    </v-card>
    <v-container>
      <v-card class="mx-auto mt-5" outlined>
        <v-card-text>
          <h3 class="d-inline-flex text--primary">{{ basicInfo.username }}</h3>
          <v-chip class="float-right" small color="primary" text-color="white">
            {{ basicInfo.role }}
          </v-chip>
        </v-card-text>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>Gender</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ basicInfo.gender }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Age group</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ basicInfo.age_group }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Country</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ basicInfo.current_country }}
            </v-list-item-content>
          </v-list-item>
          <v-card-text>
            <h3 class="text--primary">Symptoms</h3>
          </v-card-text>
          <v-list-item>
            <v-list-item-content>Status</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ status }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import { mdiClose } from "@mdi/js";
import ajax from "../../auth/ajax";

export default {
  name: "DetailSidebar",
  props: ["userId", "sidebar"],
  data() {
    return {
      mdiClose,
      side_bar: false,
      basic: null,
      status: null,
      testReports: null,
      currentSymptoms: null
    };
  },
  watch: {
    sidebar: {
      handler() {
        this.side_bar = this.sidebar;
      }
    },
    userId: {
      handler() {
        console.log(this.id);
        ajax.get(`users-detail/${this.userId}`).then(
          res => {
            console.log(res.data);
            if (res.data.symptomHistory !== null) {
              this.basic = res.data.symptomHistory.user_id;
              this.currentSymptoms = res.data.symptomHistory.current_symptoms;
              this.status = res.data.symptomHistory.status;
              this.testReports = res.data.testReports;
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    }
  },
  computed: {
    basicInfo() {
      return this.basic;
    }
  },
  methods: {
    close() {
      this.side_bar = false;
      this.$emit("close-sidebar");
    },
    getColor(risk) {
      if (risk.toLowerCase() === "low") {
        return "#009c4d";
      } else if (risk.toLowerCase() === "medium") {
        return "#ffa64e";
      } else if (risk.toLowerCase() === "high") {
        return "#ff6767";
      }
    }
  }
};
</script>

<style scoped>
.display-1 {
  font-size: 1.2em !important;
  color: #303030 !important;
}
.shadow {
  background: transparent !important;
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05),
    0 15px 40px rgba(166, 173, 201, 0.2) !important;
  border-radius: 15px !important;
}
.v-list-item__content {
  font-size: 0.8em !important;
}
</style>
