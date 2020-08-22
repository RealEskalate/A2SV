<template>
  <v-container>
    <SymptomFilter v-on:set-search="setSearch" />
    <HighLevelStatistics />
    <v-navigation-drawer
      width="450"
      v-model="sidebar"
      right
      absolute
      bottom
      temporary
      color="#F5F6F7"
      class="shadow-sm pb-9"
      style="z-index: 3"
    >
      <v-card>
        <v-row>
          <v-icon large class="ma-2 ml-6" @click="sidebar=false">{{mdiClose}}</v-icon>
          <p class="mx-auto d-inline-flex display-1 text--primary">Symptom Details</p>
        </v-row>
      </v-card>
      <v-container>
        <v-card class="mx-auto mt-5">
          <v-card-text>
            <h1 class="d-inline-flex text--primary">Liya M.</h1>
            <v-chip class="float-right" color="red" text-color="white">High Risk</v-chip>
          </v-card-text>
          <v-list-item>
            <v-list-item-content>Id</v-list-item-content>
            <v-list-item-content class="align-end">34343242</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Last Update</v-list-item-content>
            <v-list-item-content class="align-end">07/20/2020 - 16:17:59 PST</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Status</v-list-item-content>
            <v-list-item-content class="align-end">Symptom Submitted</v-list-item-content>
          </v-list-item>
        </v-card>
        <v-card class="mx-auto mt-10">
          <v-card-text>
            <h1 class="text--primary">Symptoms - 7/20/2020</h1>
          </v-card-text>
          <v-list-item>
            <v-list-item-content>Source</v-list-item-content>
            <v-list-item-content class="align-end ml-0">Mobile</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Location</v-list-item-content>
            <v-list-item-content class="align-end">Addis Ababa</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Symptom 1</v-list-item-content>
            <v-list-item-content class="align-end">Cough</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Symptom 2</v-list-item-content>
            <v-list-item-content class="align-end">Sneezing</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Symptom 3</v-list-item-content>
            <v-list-item-content class="align-end">Chills</v-list-item-content>
          </v-list-item>
        </v-card>
      </v-container>
    </v-navigation-drawer>
    <v-data-table
      :search="search"
      :headers="headers"
      :options.sync="options"
      :items="getPeoplesWithSymptoms"
      :server-items-length="getPeopleCount"
      :loading="getSymptomStatLoaders.peopleList"
      :footer-props="{'items-per-page-options':[5, 10, 25, 50]}"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]>
        <!-- <router-link :to="`/en/admin/symptoms/${item.person}/details`"> -->
        <v-btn @click="sidebar = true" small color="primary">Detail</v-btn>
        <!-- </router-link> -->
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import HighLevelStatistics from "./HighLevelStatistics";
import SymptomFilter from "./SymptomFilter";
import { mdiClose } from "@mdi/js";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "Symptoms",
  components: {
    HighLevelStatistics,
    SymptomFilter
  },
  data() {
    return {
      mdiClose,
      search: "",
      sidebar: false,
      headers: [
        { text: "Date", align: "start", value: "date" },
        { text: "Status", value: "status", sortable: false },
        { text: "Person", value: "person" },
        { text: "Symptoms", value: "symptoms", sortable: false },
        { text: "Risk Score", value: "riskScore", sortable: false },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      options: { page: 1, itemsPerPage: 5 }
    };
  },
  watch: {
      options: {
        handler () {
          this.fetchPeoplesWithSymptoms({
            page: this.options.page,
            size: this.options.itemsPerPage
          });
        },
        deep: true,
      },
    },
  methods: {
    ...mapActions([
        "fetchPeoplesWithSymptoms"
    ]),
    setSearch(text) {
      this.search = text;
    }
  },
  computed: {
    ...mapGetters([
      "getPeoplesWithSymptoms",
      "getPeopleCount",
      "getSymptomStatLoaders"
    ])
  },
  mounted() {
    this.fetchPeoplesWithSymptoms({
      page: this.options.page,
      size: this.options.itemsPerPage
    });
  },
};
</script>

<style scoped></style>
