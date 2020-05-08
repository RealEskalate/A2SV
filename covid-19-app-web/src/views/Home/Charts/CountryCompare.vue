<template>
  <v-container class="py-8">
    <v-row class="mx-md-5" dense>
      <v-col cols="12" md="6">
        <v-select
          v-model="country_1"
          :items="countries"
          label="Country 1"
          hint="Country 1"
          persistent-hint
          solo
          @input="fetchData1"
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
              v-model="dateRangeText1"
              label="Date Range 1"
              hint="Country 1: From - To"
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
      <!--      <v-col cols="12" md="4">-->
      <!--        <v-slider-->
      <!--          :color="sliderColor(social_distancing_1)"-->
      <!--          :track-color="sliderColor(social_distancing_1)"-->
      <!--          max="100"-->
      <!--          hint="100% means no physical connections"-->
      <!--          persistent-hint-->
      <!--          label="Physical Distancing 1"-->
      <!--          v-model="social_distancing_1"-->
      <!--          thumb-label-->
      <!--          @input="fetchData1"-->
      <!--        />-->
      <!--      </v-col>-->
      <!--    </v-row>-->
      <!--    <v-row class="mx-md-5" dense>-->
      <!--      <v-col cols="12" md="4">-->
      <!--        <v-select-->
      <!--          v-model="country_2"-->
      <!--          :items="countries"-->
      <!--          label="Country 2"-->
      <!--          hint="Country 2"-->
      <!--          persistent-hint-->
      <!--          solo-->
      <!--          @input="fetchData2"-->
      <!--        />-->
      <!--      </v-col>-->
      <!--      <v-col cols="12" md="4">-->
      <!--        <v-menu-->
      <!--          :close-on-content-click="false"-->
      <!--          transition="scale-transition"-->
      <!--          max-width="290px"-->
      <!--          min-width="290px"-->
      <!--        >-->
      <!--          <template v-slot:activator="{ on }">-->
      <!--            <v-text-field-->
      <!--              solo-->
      <!--              v-model="dateRangeText2"-->
      <!--              label="Date Range 2"-->
      <!--              hint="Date Range 2"-->
      <!--              persistent-hint-->
      <!--              prepend-inner-icon="mdi-calendar"-->
      <!--              readonly-->
      <!--              v-on="on"-->
      <!--            />-->
      <!--          </template>-->
      <!--          <v-date-picker-->
      <!--            range-->
      <!--            no-title-->
      <!--            v-model="date_range_2"-->
      <!--            @input="-->
      <!--              () => {-->
      <!--                if (-->
      <!--                  date_range_2.length === 2 &&-->
      <!--                  date_range_2[0] &&-->
      <!--                  date_range_2[1]-->
      <!--                )-->
      <!--                  fetchData2();-->
      <!--              }-->
      <!--            "-->
      <!--          />-->
      <!--        </v-menu>-->
      <!--      </v-col>-->
      <!--      <v-col cols="12" md="4">-->
      <!--        <v-slider-->
      <!--          :color="sliderColor(social_distancing_2)"-->
      <!--          :track-color="sliderColor(social_distancing_2)"-->
      <!--          max="100"-->
      <!--          hint="100% means no physical connections"-->
      <!--          persistent-hint-->
      <!--          label="Physical Distancing 2"-->
      <!--          v-model="social_distancing_2"-->
      <!--          thumb-label-->
      <!--          @input="fetchData2"-->
      <!--        />-->
      <!--      </v-col>-->
    </v-row>
    <v-row class="mx-md-5" dense>
      <v-col cols="12" md="6">
        <v-select
          v-model="country_2"
          :items="countries"
          label="Country 2"
          hint="Country 2"
          persistent-hint
          solo
          @input="fetchData2"
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
              v-model="dateRangeText2"
              label="Date Range 2"
              hint="Country 2: From - To"
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
      <v-col cols="12">
        <v-select
          v-model="criterion"
          :items="criteriaList"
          label="Common Criteria"
          hint="Common Criteria"
          persistent-hint
          solo
          @input="
            () => {
              fetchData1();
              fetchData2();
            }
          "
        />
      </v-col>
      <!--      <v-col cols="12" md="6">-->
      <!--        <v-select-->
      <!--          v-model="age_range"-->
      <!--          :items="age_ranges"-->
      <!--          label="Common Age Range"-->
      <!--          hint="Common Age Range"-->
      <!--          persistent-hint-->
      <!--          solo-->
      <!--          @input="-->
      <!--            () => {-->
      <!--              fetchData1();-->
      <!--              fetchData2();-->
      <!--            }-->
      <!--          "-->
      <!--        />-->
      <!--      </v-col>-->
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <line-chart :height="400" :chart-data="data" :options="chartOptions" />
      </v-col>
      <!--      <v-col cols="12" md="3">-->
      <!--        <v-card flat tile>-->
      <!--          <v-list disabled dense>-->
      <!--            <v-card-title class="grey&#45;&#45;text text&#45;&#45;darken-2">-->
      <!--              Resources - <em v-text="country_1" />-->
      <!--            </v-card-title>-->
      <!--            <v-divider class="mx-4" />-->
      <!--            <v-list-item-group color="primary">-->
      <!--              <v-list-item v-for="(resource, i) in countryResources" :key="i">-->
      <!--                <v-list-item-content>-->
      <!--                  <span>-->
      <!--                    <span class="d-inline" v-text="resource.key" /> :-->
      <!--                    <span-->
      <!--                      class="d-inline grey&#45;&#45;text"-->
      <!--                      v-text="resource.value || 'N/A'"-->
      <!--                    />-->
      <!--                  </span>-->
      <!--                </v-list-item-content>-->
      <!--              </v-list-item>-->
      <!--            </v-list-item-group>-->
      <!--          </v-list>-->
      <!--        </v-card>-->
      <!--      </v-col>-->
      <!--      <v-col cols="12" md="3">-->
      <!--        <v-card flat tile>-->
      <!--          <v-list disabled dense>-->
      <!--            <v-card-title class="grey&#45;&#45;text text&#45;&#45;darken-2">-->
      <!--              Resources - <em v-text="country_2" />-->
      <!--            </v-card-title>-->
      <!--            <v-divider class="mx-4" />-->
      <!--            <v-list-item-group color="primary">-->
      <!--              <v-list-item v-for="(resource, i) in countryResources" :key="i">-->
      <!--                <v-list-item-content>-->
      <!--                  <span>-->
      <!--                    <span class="d-inline" v-text="resource.key" /> :-->
      <!--                    <span-->
      <!--                      class="d-inline grey&#45;&#45;text"-->
      <!--                      v-text="resource.value || 'N/A'"-->
      <!--                    />-->
      <!--                  </span>-->
      <!--                </v-list-item-content>-->
      <!--              </v-list-item>-->
      <!--            </v-list-item-group>-->
      <!--          </v-list>-->
      <!--        </v-card>-->
      <!--      </v-col>-->
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
  data() {
    return {
      data: null,
      criterion: "Confirmed Cases",
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
      country_1: "World",
      country_2: "World",
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
        label: this.country_1,
        color: [77, 208, 225],
        data: this.countriesData.one
      });
      let input2 = this.makeDataSet({
        label: this.country_2,
        color: [220, 231, 117],
        data: this.countriesData.two
      });
      this.data = {
        labels: this.labels(),
        datasets: [input1, input2]
      };
    },
    fetchData1() {
      store.dispatch("setCountryCompare", {
        country: this.country_1,
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
        country: this.country_2,
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
