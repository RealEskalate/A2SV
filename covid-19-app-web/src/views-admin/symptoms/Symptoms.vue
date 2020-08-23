<template>
  <v-container>
    <SymptomFilter v-on:set-search="setSearch" />
    <HighLevelStatistics />
    <DetailSidebar :detail="detail" :sidebar="sidebar" />
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
      options: { page: 1, itemsPerPage: 5 },
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
      }
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
