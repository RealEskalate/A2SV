<template>
  <v-container class="py-8">
    <v-row class="mx-md-5" dense>
      <v-col cols="12" md="6">
        <v-select
          v-model="country"
          :items="countries"
          label="Country"
          hint="Country"
          persistent-hint
          solo
          @input="
            () => {
              fetchData();
              fetchCountryResources();
            }
          "
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
          <v-date-picker
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
        <!--        <v-menu-->
        <!--          :close-on-content-click="false"-->
        <!--          transition="scale-transition"-->
        <!--          max-width="290px"-->
        <!--          min-width="290px"-->
        <!--        >-->
        <!--          <template v-slot:activator="{ on }">-->
        <!--            <v-text-field-->
        <!--              solo-->
        <!--              v-model="start_date"-->
        <!--              label="Start Date"-->
        <!--              hint="Start Date"-->
        <!--              persistent-hint-->
        <!--              prepend-inner-icon="mdi-calendar"-->
        <!--              readonly-->
        <!--              v-on="on"-->
        <!--            />-->
        <!--          </template>-->
        <!--          <v-date-picker-->
        <!--            @input="fetchData"-->
        <!--            v-model="start_date"-->
        <!--            :max="maxDate"-->
        <!--          />-->
        <!--        </v-menu>-->
      </v-col>
      <!--      <v-col cols="12" md="6">-->
      <!--        <v-select-->
      <!--          v-model="age_range"-->
      <!--          :items="age_ranges"-->
      <!--          label="Age Group"-->
      <!--          hint="Age Group"-->
      <!--          persistent-hint-->
      <!--          solo-->
      <!--          @input="fetchData"-->
      <!--        />-->
      <!--      </v-col>-->
      <!--      <v-col cols="12" md="6">-->
      <!--        <v-menu-->
      <!--          :close-on-content-click="false"-->
      <!--          transition="scale-transition"-->
      <!--          max-width="290px"-->
      <!--          min-width="290px"-->
      <!--        >-->
      <!--          <template v-slot:activator="{ on }">-->
      <!--            <v-text-field-->
      <!--              solo-->
      <!--              v-model="dateRangeText"-->
      <!--              label="Date Range"-->
      <!--              hint="Date Range"-->
      <!--              persistent-hint-->
      <!--              prepend-inner-icon="mdi-calendar"-->
      <!--              readonly-->
      <!--              v-on="on"-->
      <!--            />-->
      <!--          </template>-->
      <!--          <v-date-picker-->
      <!--            range-->
      <!--            no-title-->
      <!--            v-model="date_range"-->
      <!--            @input="-->
      <!--              () => {-->
      <!--                if (date_range.length === 2 && date_range[0] && date_range[1])-->
      <!--                  fetchData();-->
      <!--              }-->
      <!--            "-->
      <!--          />-->
      <!--        </v-menu>-->
      <!--      </v-col>-->
      <!--      <v-col cols="12" md="6">-->
      <!--        <v-slider-->
      <!--          :color="sliderColor(social_distancing)"-->
      <!--          :track-color="sliderColor(social_distancing)"-->
      <!--          max="100"-->
      <!--          hint="100% means no physical connections"-->
      <!--          persistent-hint-->
      <!--          label="Physical Distancing Percentage"-->
      <!--          v-model="social_distancing"-->
      <!--          thumb-label-->
      <!--          @input="fetchData"-->
      <!--        />-->
      <!--      </v-col>-->
    </v-row>
    <v-row>
      <v-col cols="12" md="9">
        <line-chart :height="480" :chart-data="data" :options="chartOptions" />
      </v-col>
      <v-col cols="12" md="3">
        <v-card flat tile>
          <v-list disabled dense>
            <v-card-title class="grey--text text--darken-2">
              Resources - <em v-text="country" />
            </v-card-title>
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
import store from "@/store/index.js";
import moment from "moment";

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
      data: null,
      start_date: moment(new Date())
        .subtract(3, "month")
        .format("YYYY-MM-DD"),
      date_range: [
        moment(new Date())
          .subtract(3, "month")
          .format("YYYY-MM-DD"),
        moment(new Date()).format("YYYY-MM-DD")
      ],
      country: "World",
      age_range: "All",
      social_distancing: 50
    };
  },
  methods: {
    fetchCountryResources() {
      store.dispatch("setCountryResources", {
        country: this.country
      });
    },
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
        country: this.country,
        start_date:
          this.date_range[0] ||
          moment(new Date())
            .subtract(3, "month")
            .format("YYYY-MM-DD"),
        end_date: this.date_range[1] || moment(new Date()).format("YYYY-MM-DD")
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
    this.fetchCountryResources();
  },
  computed: {
    counts: () => store.getters.getDisplayCounts,
    rates: () => store.getters.getDisplayRates,
    countryResources: () => store.getters.getCountryResources,
    maxDate: () => moment(new Date()).format("YYYY-MM-DD")
  }
};
</script>
