<template>
  <v-container>
    <v-row> 
      <v-col cols="12" sm="2">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="date" label="Date" readonly v-bind="attrs" v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="2">
        <v-select class="d-flex" :items="status" label="Status" outlined></v-select>
      </v-col>
      <v-col cols="12" sm="2">
        <v-select class="d-flex" :items="risk" label="Risk" outlined></v-select>
      </v-col>
      <v-divider class="mx-6" vertical></v-divider>
      <v-col cols="12" sm="5">
        <v-text-field
          v-model="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="(stat, i) in highLevelStats" :key="i">
        <v-card class="mx-auto" :flat="true" max-width="344">
          <v-card-text>
            <p class="display-1 text--primary">{{stat.statistic}}</p>
            <div class="text--primary">{{stat.description}}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
import { headers, items, highLevelStats } from "./dummy";

export default {
  name: "Symptoms",
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
      dialog: false,
      search: "",
      risk: ["Low", "Medium", "High"],
      status: ["Symptom Submitted", "Symptom Updated"],
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      headers: headers,
      items: items,
      highLevelStats: highLevelStats
    };
  },
  methods: {
  }
};
</script>

<style scoped></style>
