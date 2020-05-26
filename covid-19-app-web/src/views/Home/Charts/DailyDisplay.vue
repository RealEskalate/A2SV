<template>
  <v-container class="py-8">
    <v-row class="mx-md-5" dense>
      <v-col class="px-2" cols="12" md="4">
        <v-autocomplete
          class="v-card--shaped"
          v-model="country"
          :items="countries"
          label="Country"
          hint="Search Country"
          persistent-hint
          item-text="name"
          return-object
          outlined
          dense
          @input="fetchData"
        />
      </v-col>
      <v-col class="px-2" cols="12" md="4">
        <v-menu
          :close-on-content-click="false"
          transition="scale-transition"
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              class="v-card--shaped"
              outlined
              dense
              v-model="dateRangeText"
              label="Date Range"
              hint="Date Range"
              :prepend-inner-icon="mdiCalendar"
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
      <v-col class="px-2" cols="12" md="4">
        <v-select
          class="v-card--shaped"
          item-text="label"
          v-model="criterion"
          :items="criteria.daily"
          label="Criteria"
          hint="Criteria"
          outlined
          dense
          @input="fetchData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="9" class="overflow-auto pl-md-10">
        <loader
          v-if="graphLoaders.daily > 0"
          style="position:absolute; left: 35%; top: 45%"
        />
        <bar-chart
          :style="`opacity: ${graphLoaders.daily > 0 ? 0.5 : 1}`"
          class="v-card--shaped grey lighten-5 shadow-in pb-6 px-1"
          :height="480"
          ref="graph"
          :chart-data="data"
          :options="chartOptions"
        />
        <v-fade-transition hide-on-leave>
          <div class="ma-2" v-if="graphLoaders.descriptions">
            <v-skeleton-loader ref="skeleton" type="text,text" class="mx-auto my-3" />
          </div>
          <small
            v-else-if="!short_description"
            class="d-block grey--text my-3 text--darken-1"
            v-text="'No Description'"
          />
          <small
            v-else
            class="d-block grey--text my-3 text--darken-2"
            v-text="short_description"
          />
        </v-fade-transition>
      </v-col>
      <v-col cols="12" md="3">
        <country-resources :country="country" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { BarChart, ChartMixin } from "./charts.js";
import CountryResources from "../CountryResources";
import Loader from "@/components/core/Loader.vue";
import store from "@/store/index.js";
import { mdiCalendar } from "@mdi/js";

export default {
  components: { BarChart, Loader, CountryResources },
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
      mdiCalendar,
      data: null,
      converter: {
        "Daily Test": { label: "Daily Test", color: [121, 134, 203] },
        "Daily Confirmed": { label: "Daily Confirmed", color: [255, 213, 79] },
        "Daily Deaths": { label: "Daily Deaths", color: [240, 98, 146] },
        "Daily Recovery": { label: "Daily Recovery", color: [220, 231, 117] }
      },
      criterion: "Daily Confirmed",
      date_range: [this.defaultDate(), this.defaultDate("end")],
      country: { name: "World", slug: "World" },
      age_range: "All",
      social_distancing: 50,
      rendered: false
    };
  },
  methods: {
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
        country: this.country.slug,
        start_date: this.date_range[0] || this.defaultDate(),
        end_date: this.date_range[1] || this.defaultDate("end")
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
  },
  computed: {
    daily: () => store.getters.getDailyCounts,
    graphLoaders: () => store.getters.getGraphLoaders,
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
