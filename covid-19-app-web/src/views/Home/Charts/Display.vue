<template>
  <v-container class="py-8">
    <v-row class="mx-md-5" dense>
      <v-col class="px-2" cols="12" md="6">
        <v-autocomplete
          v-model="country"
          :items="countries"
          label="Country"
          hint="Search Country"
          item-text="name"
          outlined
          dense
          return-object
          @input="fetchData"
        />
      </v-col>
      <v-col class="px-2" cols="12" md="6">
        <v-menu
          :close-on-content-click="false"
          transition="scale-transition"
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              color="primary"
              outlined
              dense
              v-model="dateRangeText"
              label="Date Range"
              hint="Date Range"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-on="on"
            />
          </template>
          <v-date-picker
            color="primary"
            :min="date_range.length === 1 ? date_range[0] : null"
            :max="maxDate"
            range
            no-title
            v-model="date_range"
            @input="
              () => {
                if (date_range.length === 2 && date_range[0] && date_range[1])
                  fetchData();
              }
            "
          />
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="9" class="overflow-auto pl-md-10">
        <line-chart
          class="v-card--shaped grey lighten-5 shadow-in pb-6 px-1"
          style="min-width: 400px; height: 480px"
          :chart-data="data"
          :options="chartOptions"
        />
        <small
          class="d-block grey--text my-3 text--darken-2"
          v-text="short_description"
        />
      </v-col>
      <v-col cols="12" md="3">
        <country-resources :country="country" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { LineChart, ChartMixin } from "./charts.js";
import CountryResources from "../CountryResources";
import store from "@/store/index.js";

export default {
  components: { LineChart, CountryResources },
  mixins: [ChartMixin],
  props: {
    mode: {
      type: String,
      default() {
        return "counts";
      }
    }
  },
  data() {
    return {
      data: null,
      date_range: [this.defaultDate(), this.defaultDate("end")],
      country: { name: "World", slug: "World" },
      age_range: "All",
      social_distancing: 50
    };
  },
  methods: {
    fillGraph() {
      let datasets = [];
      let load = this.mode === "counts" ? this.counts : this.rates;
      this.criteria[this.mode].forEach(cr => {
        let input = {
          label: cr.label,
          color: cr.color,
          data: load[cr.label]
        };
        datasets.push(this.makeDataSet(input));
      });
      this.data = {
        datasets: datasets
      };
    },
    fetchData() {
      store.dispatch("setDisplayData", {
        criteria: this.criteria[this.mode],
        makeDataSet: this.makeDataSet,
        mode: this.mode,
        country: this.country.slug,
        start_date: this.date_range[0] || this.defaultDate(),
        end_date: this.date_range[1] || this.defaultDate("end")
      });
    }
  },
  watch: {
    counts: {
      deep: true,
      handler() {
        this.fillGraph();
      }
    },
    rates: {
      deep: true,
      handler() {
        this.fillGraph();
      }
    }
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    counts: () => store.getters.getDisplayCounts,
    rates: () => store.getters.getDisplayRates,
    countryResources: () => store.getters.getCountryResources,
    dateRangeText() {
      return this.rangeToText(this.date_range[0], this.date_range[1]);
    }
  }
};
</script>
