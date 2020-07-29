<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h3 class="display-1 font-weight-thin mb-5" data-v-step="3">
          {{ $t("titles.ethiopiaStatisticsTitle") }}
          <!--          <v-img-->
          <!--            src="/img/ethiopia/under-construction.svg"-->
          <!--            class="v-icon mx-auto"-->
          <!--            width="15rem"-->
          <!--          />-->
        </h3>
        <!--        <small-->
        <!--          class="red&#45;&#45;text"-->
        <!--          v-text="-->
        <!--            '*The following statistical data of Ethiopia is not accurate.'-->
        <!--          "-->
        <!--        />-->
      </v-col>
    </v-row>
    <v-row class="my-5" v-if="ethiopianData">
      <v-col cols="12">
        <v-card class="overflow-hidden" outlined shaped>
          <v-row>
            <v-col
              sm="3"
              cols="6"
              class="border-right"
              :key="item.key"
              v-for="item in totalData"
            >
              <!--              <v-img :src="item.icon" class="small-icon mx-auto my-3" />-->
              <p class="text-center" v-text="$t(item.label)" />
              <h1
                class="display-1 text-center mb-2 primary--text"
                v-text="numberWithCommas(ethiopianData.total[item.key])"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="my-5">
      <v-col cols="12">
        <v-card class="px-7 py-5" outlined shaped>
          <v-row>
            <v-col md="6" cols="12">
              <v-select
                dense
                outlined
                :label="$t('metrics')"
                class="v-card--shaped"
                v-model="regional_criteria"
                :items="allCriteria"
                item-value="value"
                @input="setChartData"
              >
                <template v-slot:item="{ item }">
                  <small v-text="translateCriteria(item.text)" />
                </template>
                <template v-slot:selection="{ item }">
                  <span v-text="translateCriteria(item.text)" />
                </template>
              </v-select>
              <doughnut-chart
                class="v-card--shaped grey lighten-5 shadow-in pb-6 px-3 px-xl-12"
                :chartData="chartData"
                :options="chartOptions"
              />
            </v-col>
            <v-col md="6" cols="12">
              <h3
                class="mb-3 px-3 primary--text"
                v-text="$t('regionalStatistics')"
              />
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left" v-text="$t('regions')" />
                      <th class="text-left" v-text="$t('totalCases')" />
                      <th class="text-left" v-text="$t('recovered')" />
                      <th
                        class="text-left"
                        v-text="$t('activeCases')"
                        v-if="regional_criteria.split('_')[0] === 'total'"
                      />
                      <th class="text-left" v-text="$t('death')" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in regionalData" :key="item._id">
                      <td v-text="item.region" />
                      <td
                        v-text="item[regional_criteria.split('_')[0]].confirmed"
                      />
                      <td
                        v-text="item[regional_criteria.split('_')[0]].recovered"
                      />
                      <td
                        v-if="regional_criteria.split('_')[0] === 'total'"
                        v-text="item[regional_criteria.split('_')[0]].active"
                      />
                      <td
                        v-text="item[regional_criteria.split('_')[0]].deaths"
                      />
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="my-5">
      <v-col cols="12">
        <v-card class="pa-5" outlined shaped>
          <v-card-title>
            <h4
              class="mb-2 primary--text"
              v-text="$t('freeReportingPhoneNumbers')"
            />
          </v-card-title>
          <v-row align="center" align-content="center" class="mx-auto">
            <v-col
              class="pr-3"
              v-for="add in addresses"
              :key="add.phone"
              md="3"
              sm="6"
              cols="12"
            >
              <v-row>
                <v-col class="py-0 border-right" cols="5" sm="6" md="5" xl="3">
                  <v-btn
                    text
                    class="py-0"
                    color="primary"
                    target="_blank"
                    :href="'tel:' + add.phone"
                  >
                    <v-icon small class="mx-0 mr-2" v-text="mdiPhone" />
                    {{ add.phone }}
                  </v-btn>
                </v-col>
                <v-col class="py-0" cols="7" sm="6" md="7" xl="9">
                  <small class="d-inline-block my-2" v-text="add.name" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { DoughnutChart } from "../Charts/charts.js";
import { mdiPhone } from "@mdi/js";
import store from "@/store/";

export default {
  name: "Ethiopia",
  components: {
    DoughnutChart
  },
  created() {
    store.dispatch("setEthiopia", { lang: this.$i18n.locale });
  },
  watch: {
    "$i18n.locale"() {
      this.setChartData();
    },
    regionalData(newValue) {
      this.parseRegionalData(newValue);
    }
  },
  computed: {
    ethiopianData() {
      return store.getters.getEthiopia;
    },
    regionalData() {
      return store.getters.getRegional;
    }
  },
  methods: {
    translateFilter(item) {
      return this.translateCriteria(item.text);
    },
    parseRegionalData(data) {
      let allRegions = [];
      let addresses = [];
      let regionalStats = {
        total_confirmed: [],
        total_recovered: [],
        total_active: [],
        total_deaths: [],

        daily_confirmed: [],
        daily_recovered: [],
        daily_deaths: []
      };

      data.forEach(d => {
        allRegions.push(d.region);
        addresses.push({
          name: d.region,
          phone: d.phone_number
        });

        ["daily", "total"].forEach(i => {
          for (let key in d[i]) {
            regionalStats[i + "_" + key].push(d[i][key]);
          }
        });
      });

      this.allRegions = allRegions;
      this.addresses = addresses;
      this.regionalStats = regionalStats;
      this.setChartData();
    },
    setChartData() {
      this.chartData = {
        labels: this.allRegions,
        datasets: [
          {
            label: "Regional Statistics",
            backgroundColor: [
              "#41B883",
              "#e443dc",
              "#00D8FF",
              "#00e676",
              "#ffff00",
              "#f4511e",
              "#448aff",
              "#ff4081",
              "#8e24aa",
              "#dd2c00"
            ],
            data: this.regionalStats[this.regional_criteria]
          }
        ]
      };
    }
  },
  data() {
    return {
      mdiPhone,
      allCriteria: [
        { text: "Confirmed Cases", value: "total_confirmed" },
        { text: "Recovery Count", value: "total_recovered" },
        { text: "Active Cases", value: "total_active" },
        { text: "Death Count", value: "total_deaths" },

        { text: "Daily Confirmed", value: "daily_confirmed" },
        { text: "Daily Recovery", value: "daily_recovered" },
        { text: "Daily Deaths", value: "daily_deaths" }
      ],
      regional_criteria: "total_confirmed",
      regionalStats: {},
      allRegions: [],
      totalData: [
        {
          icon: "/img/ethiopia/sick.svg",
          key: "confirmed",
          label: "totalCases"
        },
        {
          icon: "/img/ethiopia/recovered.svg",
          key: "recovered",
          label: "recovered"
        },
        {
          icon: "/img/ethiopia/dead.svg",
          key: "deaths",
          label: "death"
        },
        {
          icon: "/img/ethiopia/active.svg",
          key: "active",
          label: "activeCases"
        }
      ],
      addresses: [],
      chartOptions: {
        hoverBorderWidth: 20,
        legend: {
          display: this.$vuetify.breakpoint.mdAndUp,
          position: "right"
        }
      },
      chartData: null
    };
  }
};
</script>

<style scoped>
.border-right {
  border-right: solid rgba(0, 0, 0, 0.1) 1px;
}
.small-icon {
  max-width: 3rem;
}
</style>
