<template>
  <v-container>
    <v-expansion-panels popout focusable>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <v-row>
            <v-icon large class="ma-1 mr-3">{{mdiFilterVariant}}</v-icon>
            <p class="display-1 d-inline-flex text--primary left">Filter</p>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="mt-5">
          <SymptomFilter v-on:set-search="searchPerson" v-on:status-change="onStatusChange" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- <v-icon large class="mb-4 mr-4">{{mdiFilterVariant}}</v-icon>
    <p class="display-1 d-inline-flex text--primary">Filter</p>-->
    <!-- <SymptomFilter v-on:set-search="setSearch" /> -->
    <HighLevelStatistics class="my-8" />
    <DetailSidebar :detail="detail" :sidebar="sidebar" />
    <v-data-table
      :headers="headers"
      :options.sync="options"
      :items="getPeoplesWithSymptoms"
      :server-items-length="getPeopleCount"
      :loading="getSymptomStatLoaders.peopleList"
      :footer-props="{'items-per-page-options':[5, 10, 25, 50]}"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{item}">
        <v-btn @click="showDetail(item)" small color="primary">Detail</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import HighLevelStatistics from "./HighLevelStatistics";
import SymptomFilter from "./SymptomFilter";
import DetailSidebar from "./DetailSidebar";
import { mdiFilterVariant } from "@mdi/js";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "Symptoms",
  components: {
    HighLevelStatistics,
    SymptomFilter,
    DetailSidebar
  },
  data() {
    return {
      mdiFilterVariant,
      sidebar: false,
      headers: [
        { text: "Date", align: "start", value: "date", sortable: false },
        { text: "Status", value: "status", sortable: false },
        { text: "Person", value: "person", sortable: false },
        { text: "Symptoms", value: "symptoms", sortable: false },
        { text: "Risk Score", value: "riskScore", sortable: false },
        { text: "Actions", value: "actions", sortable: false }
      ],
      options: { page: 1, itemsPerPage: 10 },
      filters: { status: "", username: "" },
      awaitingSearch: false,
      detail: {
        id: "",
        name: "",
        risk: "",
        gender: "",
        lastUpdate: "",
        status: "",
        location: "",
        allSymptoms: []
      }
    };
  },
  watch: {
    options: {
      handler() {
        this.fetchPeoplesWithSymptoms({
          page: this.options.page,
          size: this.options.itemsPerPage,
          status: this.filters.status,
          username: this.filters.username
        });
        this.sidebar = false;
      },
      deep: true
    },
    "filters.username": {
      handler() {
        if (!this.awaitingSearch) {
          setTimeout(() => {
            this.fetchPeoplesWithSymptoms({
              page: this.options.page,
              size: this.options.itemsPerPage,
              status: this.filters.status,
              username: this.filters.username
            });
            this.awaitingSearch = false;
          }, 1000);
        }
        this.awaitingSearch = true;
      }
    }
  },
  methods: {
    ...mapActions(["fetchPeoplesWithSymptoms"]),
    searchPerson(name) {
      this.filters.username = name;
    },
    onStatusChange(current_status) {
      this.filters.status = current_status.toUpperCase().replace(" ", "_");
      this.fetchPeoplesWithSymptoms({
        page: this.options.page,
        size: this.options.itemsPerPage,
        status: this.filters.status,
        username: this.filters.username
      });
    },
    showDetail(item) {
      this.sidebar = true;
      this.detail = {
        id: item.id,
        name: item.person,
        risk: item.riskScore,
        gender: item.gender,
        lastUpdate: item.date,
        status: item.status,
        location: item.location,
        allSymptoms: item.symptoms
      };
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
      size: this.options.itemsPerPage,
      status: this.filters.status,
      username: this.filters.username
    });
    this.sidebar = false;
  }
};
</script>

<style scoped></style>
