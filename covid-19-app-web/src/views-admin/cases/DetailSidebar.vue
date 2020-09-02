<template>
  <v-navigation-drawer
    width="350"
    height="80%"
    v-model="sidebar"
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
          Case Details
        </p>
      </v-row>
    </v-card>
    <v-container>
      <v-card class="mx-auto mt-5" outlined>
        <v-card-text>
          <h3 class="d-inline-flex text--primary">
            {{ detail.userInfo.username }}
          </h3>
        </v-card-text>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>Case ID</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ detail.caseId }}
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>Last Update</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ detail.caseUpdateDate }}
            </v-list-item-content>
          </v-list-item>
          <v-card-text>
            <h3 class="text--primary">Case Details</h3>
          </v-card-text>
          <v-list-item>
            <v-list-item-content>Case Submission Date</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ detail.caseSubmissionDate }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Latest Status</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ detail.status }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Healthcare Official</v-list-item-content>
            <v-list-item-content class="align-end">
              {{ detail.healthcareInfo.username }}
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
      mdiClose
    };
  },
  methods: {
    close() {
      this.side_bar = false;
      this.$emit("close-sidebar");
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
