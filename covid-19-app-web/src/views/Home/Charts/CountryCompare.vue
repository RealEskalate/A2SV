<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12" md="9">
        <v-row class="mx-md-5" dense>
          <v-col class="px-2" cols="12" md="6">
            <v-autocomplete
              v-model="country_1"
              :items="countries"
              label="Country 1"
              hint="Search Country 1"
              item-text="name"
              return-object
              outlined
              dense
              @input="fetchData1"
              :color="`rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`"
              item-color="indigo"
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
                  :color="
                    `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`
                  "
                  outlined
                  dense
                  v-model="dateRangeText1"
                  label="Date Range 1"
                  hint="Country 1: From - To"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-on="on"
                />
              </template>
              <v-date-picker
                :max="maxDate"
                :color="
                  `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`
                "
                range
                no-title
                v-model="date_range_1"
                @input="
                  () => {
                    if (
                      date_range_1.length === 2 &&
                      date_range_1[0] &&
                      date_range_1[1]
                    )
                      fetchData1();
                  }
                "
              />
            </v-menu>
          </v-col>
        </v-row>
        <v-row class="mx-md-5" dense>
          <v-col class="px-2" cols="12" md="6">
            <v-autocomplete
              v-model="country_2"
              :items="countries"
              label="Country 2"
              hint="Search Country 2"
              item-text="name"
              return-object
              outlined
              dense
              @input="fetchData2"
              :color="`rgb(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]})`"
              item-color="red"
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
                  :color="
                    `rgb(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]})`
                  "
                  outlined
                  dense
                  v-model="dateRangeText2"
                  label="Date Range 2"
                  hint="Country 2: From - To"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-on="on"
                />
              </template>
              <v-date-picker
                :color="
                  `rgb(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]})`
                "
                :max="maxDate"
                range
                no-title
                v-model="date_range_2"
                @input="
                  () => {
                    if (
                      date_range_2.length === 2 &&
                      date_range_2[0] &&
                      date_range_2[1]
                    )
                      fetchData2();
                  }
                "
              />
            </v-menu>
          </v-col>
        </v-row>
        <v-row class="mx-md-5" dense>
          <v-col class="px-2" cols="12">
            <v-select
              v-model="criterion"
              :items="criteriaList"
              label="Common Criteria"
              hint="Common Criteria"
              outlined
              dense
              @input="
                () => {
                  fetchData1();
                  fetchData2();
                }
              "
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12" class="overflow-auto px-md-10">
            <line-chart
              class="v-card--shaped grey lighten-5 shadow-in pb-6 px-1"
              style="min-width: 400px"
              :height="350"
              :chart-data="data"
              :options="chartOptions"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="3">
        <country-resources :country="country_1" />
        <br />
        <country-resources :country="country_2" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { LineChart, ChartMixin } from "./charts.js";
import CountryResources from "../CountryResources";
import store from "@/store/index.js";
import moment from "moment";

export default {
  components: { LineChart, CountryResources },
  mixins: [ChartMixin],
  data() {
    return {
      data: null,
      criterion: "Confirmed Cases",
      colors: [
        [121, 134, 203],
        [240, 98, 146]
      ],
      date_range_1: [
        moment(new Date())
          .subtract(3, "month")
          .format("YYYY-MM-DD"),
        moment(new Date()).format("YYYY-MM-DD")
      ],
      date_range_2: [
        moment(new Date())
          .subtract(3, "month")
          .format("YYYY-MM-DD"),
        moment(new Date()).format("YYYY-MM-DD")
      ],
      country_1: { name: "World", slug: "World" },
      country_2: { name: "World", slug: "World" },
      age_range: "All",
      social_distancing_1: 50,
      social_distancing_2: 50
    };
  },
  methods: {
    labels() {
      const start =
        this.date_range_1[0] < this.date_range_2[0]
          ? this.date_range_1[0]
          : this.date_range_2[0];
      const end =
        this.date_range_1[1] > this.date_range_2[1]
          ? this.date_range_1[1]
          : this.date_range_2[1];
      let result = [];
      for (let i = 0; i < moment(end).diff(moment(start), "days"); i++) {
        result.push(`Day ${i}`);
      }
      return result;
    },
    fillGraph() {
      let input1 = this.makeDataSet({
        label: this.country_1.name,
        color: this.colors[0],
        data: this.countriesData.one
      });
      let input2 = this.makeDataSet({
        label: this.country_2.name,
        color: this.colors[1],
        data: this.countriesData.two
      });
      this.data = {
        labels: this.labels(),
        datasets: [input1, input2]
      };
    },
    fetchData1() {
      store.dispatch("setCountryCompare", {
        country: this.country_1.slug,
        criteria: this.criterion,
        mode: "one",
        start_date:
          this.date_range_1[0] ||
          moment(new Date())
            .subtract(3, "month")
            .format("YYYY-MM-DD"),
        end_date:
          this.date_range_1[1] || moment(new Date()).format("YYYY-MM-DD")
      });
    },
    fetchData2() {
      store.dispatch("setCountryCompare", {
        country: this.country_2.slug,
        criteria: this.criterion,
        mode: "two",
        start_date:
          this.date_range_2[0] ||
          moment(new Date())
            .subtract(3, "month")
            .format("YYYY-MM-DD"),
        end_date:
          this.date_range_2[1] || moment(new Date()).format("YYYY-MM-DD")
      });
    }
  },
  mounted() {
    this.fetchData1();
    this.fetchData2();
  },
  watch: {
    countriesData: {
      deep: true,
      handler() {
        this.fillGraph();
      }
    }
  },
  computed: {
    dateRangeText1() {
      return this.rangeToText(this.date_range_1[0], this.date_range_1[1]);
    },
    dateRangeText2() {
      return this.rangeToText(this.date_range_2[0], this.date_range_2[1]);
    },
    countriesData: () => store.getters.getCountryCompare,
    criteriaList() {
      let result = [];
      this.criteria.counts.forEach(function(item) {
        result.push(item.label);
      });
      this.criteria.rates.forEach(function(item) {
        result.push(item.label);
      });
      return result;
    }
  }
};
</script>
