<template>
  <v-container class="py-8">
    <v-row class="mx-md-5" dense>
      <v-col cols="12" md="4">
        <v-select
          v-model="country"
          :items="countries"
          item-text="name"
          item-value="slug"
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
      <v-col cols="12" md="4">
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
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          item-text="label"
          v-model="criterion"
          :items="criteria.daily"
          label="Criteria"
          hint="Criteria"
          persistent-hint
          solo
          @input="fetchData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="9" class="overflow-auto">
        <bar-chart
                style="min-width: 400px"
                :height="480"
                :chart-data="data"
                :options="chartOptions"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-card flat tile>
          <v-list disabled dense>
            <v-card-title class="small grey--text text--darken-2">
              Resources / 1K People
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
  import {BarChart, ChartMixin} from "./charts.js";
  import store from "@/store/index.js";
  import moment from "moment";

  export default {
  components: { BarChart },
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
      converter: {
        "Daily Test": { label: "Daily Test", color: [121, 134, 203] },
        "Daily Confirmed": { label: "Daily Confirmed", color: [255, 213, 79] },
        "Daily Deaths": { label: "Daily Deaths", color: [240, 98, 146] },
        "Daily Recovery": { label: "Daily Recovery", color: [220, 231, 117] }
      },
      criterion: "Daily Confirmed",
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
      const cr = this.converter[this.criterion];
      let input = {
        label: cr.label,
        color: cr.color,
        data: this.daily[cr.label]
      };
      let d = this.makeDataSet(input, "bar");
      this.data = {
        datasets: [d]
      };
    },
    fetchData() {
      store.dispatch("setDailyCounts", {
        criteria: this.criterion,
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
    daily: {
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
    daily: () => store.getters.getDailyCounts,
    countryResources: () => store.getters.getCountryResources,
    dateRangeText() {
      return this.rangeToText(this.date_range[0], this.date_range[1]);
    },
    criteriaList() {
      let result = [];
      this.criteria.daily.forEach(function(item) {
        result.push(item.label);
      });
      return result;
    }
  }
};
</script>
