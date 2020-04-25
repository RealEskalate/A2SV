<template>
  <v-container class="py-8">
    <v-row class="mx-md-5">
      <v-col cols="12" md="6">
        <v-select
          v-model="country"
          :items="countries"
          label="Country"
          hint="Country"
          persistent-hint
          solo
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="age_range"
          :items="age_ranges"
          label="Age Range"
          hint="Age Range"
          persistent-hint
          solo
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-menu
          :close-on-content-click="false"
          transition="scale-transition"
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              solo
              v-model="dateRangeText"
              label="Date Range"
              hint="Date Range"
              persistent-hint
              prepend-inner-icon="mdi-calendar"
              readonly
              v-on="on"
            />
          </template>
          <v-date-picker no-title range v-model="date_range" />
        </v-menu>
      </v-col>
      <v-col cols="12" md="6">
        <!--        <v-card class="px-3 pt-2" elevation="2" style="height: 48px">-->
        <!--          -->
        <!--        </v-card>-->
        <v-slider
          max="100"
          hint="100% means no physical connections"
          persistent-hint
          label="Physical Distancing Percentage"
          v-model="social_distancing"
          thumb-label
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="9">
        <line-chart :chart-data="chartData" :options="chartOptions" />
      </v-col>
      <v-col cols="12" md="3">
        <v-card flat tile>
          <v-list disabled dense>
            <h3 class="grey--text text--darken-1 mx-4 mb-3">
              Resources in - {{ country }}
            </h3>
            <v-divider class="mx-4" />
            <v-list-item-group color="primary">
              <v-list-item v-for="(resource, i) in countryResources" :key="i">
                <v-list-item-content>
                  <span>
                    <span class="d-inline" v-text="resource.key" /> :
                    <span
                      class="d-inline grey--text"
                      v-text="resource.value || 'N/A'"
                    />
                  </span>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { LineChart, ChartMixin } from "./charts.js";

export default {
  components: { LineChart },
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
      countries: ["World", "Ethiopia", "United States"],
      age_ranges: [
        "All",
        "Bellow 12",
        "12 - 24",
        "24 - 30",
        "30 - 50",
        "Above 50"
      ],
      date_range: ["2019-09-10", "2019-09-20"],
      country: "World",
      age_range: "All",
      social_distancing: 50,
      chartData: null
    };
  },
  mounted() {
    console.log(this.criteria[this.mode]);
    let collection = {
      datasets: []
    };
    let self = this;
    this.fetchData.forEach(function(load) {
      collection.datasets.push(self.makeDataSet(load));
    });
    this.chartData = collection;
  },
  computed: {
    fetchData() {
      return [
        {
          label: "Test Count",
          color: [121, 134, 203],
          data: [
            { t: "2018-11-24", y: 400 },
            { t: "2018-11-29", y: 530 },
            { t: "2018-12-02", y: 780 },
            { t: "2019-01-11", y: 120 }
          ]
        },
        {
          label: "Confirmed Cases",
          color: [255, 213, 79],
          data: [
            { t: "2018-11-25", y: 343 },
            { t: "2019-03-30", y: 653 },
            { t: "2019-05-06", y: 212 },
            { t: "2020-01-13", y: 32 }
          ]
        },
        {
          label: "Death Count",
          color: [240, 98, 146],
          data: [
            { t: "2018-11-25", y: 636 },
            { t: "2019-02-03", y: 356 },
            { t: "2019-10-06", y: 136 },
            { t: "2020-01-13", y: 145 }
          ]
        },
        {
          label: "Recovery Count",
          color: [220, 231, 117],
          data: [
            { t: "2018-11-25", y: 457 },
            { t: "2019-05-30", y: 533 },
            { t: "2019-08-06", y: 234 },
            { t: "2020-01-13", y: 346 }
          ]
        }
      ];
    },
    countryResources() {
      return [
        { key: "Testing Strategy", value: "Test Homes" },
        { key: "Hospitals", value: 10000 },
        { key: "Doctors", value: 423 },
        { key: "Medical Workers", value: 26322 },
        { key: "Ventilators", value: 262 },
        { key: "Hospital Beds", value: 262 },
        { key: "ICU Beds", value: 262 },
        { key: "Protection Gears", value: 262 }
      ];
    }
  }
};
</script>
