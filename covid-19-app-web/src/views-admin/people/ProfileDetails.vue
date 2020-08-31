<template>
  <v-navigation-drawer
    width="350"
    height="80%"
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
          Symptom Details
        </p>
      </v-row>
    </v-card>
    <v-container>
      <v-card class="mx-auto mt-5" outlined>
        <v-card-text>
          <h3 class="d-inline-flex text--primary">{{ detail.name }}</h3>
          <v-chip
            class="float-right"
            small
            :color="getColor(detail.risk)"
            text-color="white"
          >
            {{ detail.risk }} RISK</v-chip
          >
        </v-card-text>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>Gender</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ detail.gender }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Last Update</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ detail.lastUpdate }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Status</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ detail.status }}
            </v-list-item-content>
          </v-list-item>
          <v-card-text>
            <h3 class="text--primary">Symptoms</h3>
          </v-card-text>
          <v-list-item>
            <v-list-item-content>Location</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ detail.location }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-for="(symptom, i) in detail.allSymptoms" :key="i">
            <v-list-item-content>Symptom {{ i + 1 }}</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ symptom }}
            </v-list-item-content>

          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import { mdiClose } from "@mdi/js";

export default {
  name: "DetailSidebar",
  props: ["detail", "sidebar"],
  data() {
    return {
      mdiClose,
      side_bar: false
    };
  },
  watch: {
    sidebar: {
      handler() {
        this.side_bar = this.sidebar;
      }
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
</style>
