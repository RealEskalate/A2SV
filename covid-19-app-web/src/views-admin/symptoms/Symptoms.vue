<template>
  <v-container>
    <SymptomFilter v-on:set-search="setSearch"/>
    <HighLevelStatistics />
    <v-data-table
      :search="search"
      :headers="headers"
      :items="items"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{item}">
        <router-link :to="`/en/admin/symptoms/${item.person}/details`">
          <v-btn small color="primary">Detail</v-btn>
        </router-link>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { headers, items } from "./dummy";
import HighLevelStatistics from "./HighLevelStatistics";
import SymptomFilter from "./SymptomFilter";

export default {
  name: "Symptoms",
  components: {
    HighLevelStatistics,
    SymptomFilter
  },
  data() {
    return {
      detailIndex: -1,
      detailItem: {
        date: "",
        status: "",
        person: "",
        symptoms: "",
        riskScore: ""
    },
      search: "",
      risk: ["Low", "Medium", "High"],
      status: ["Symptom Submitted", "Symptom Updated"],
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      headers: headers,
      items: items
    };
  },
  methods: {
    setSearch(text) {
      this.search = text;
    }
  }
};
</script>

<style scoped></style>
