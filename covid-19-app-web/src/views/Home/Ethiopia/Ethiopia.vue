<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h3 class="display-1 font-weight-thin mb-5" data-v-step="3">
          {{ $t("titles.ethiopiaStatisticsTitle") }}
          <v-img
            src="/img/ethiopia/under-construction.svg"
            class="v-icon mx-auto"
            width="15rem"
          />
        </h3>
        <small class="red--text"
          >*The following statistical data of Ethiopia is not accurate.</small
        >
      </v-col>
    </v-row>
    <v-row class="my-5">
      <v-col cols="12">
        <v-card class="overflow-hidden" outlined shaped>
          <v-row>
            <v-col sm="3" cols="6" class="border-right">
              <v-img
                src="/img/ethiopia/sick.svg"
                class="small-icon mx-auto my-3"
              />
              <h1 class="text-center">{{ ethiopianData.total.confirmed }}</h1>
              <p class="text-center">{{ $t("totalCases") }}</p>
            </v-col>
            <v-col sm="3" cols="6" class="border-right">
              <v-img
                src="/img/ethiopia/recovered.svg"
                class="small-icon mx-auto my-3"
              />
              <h1 class="text-center">{{ ethiopianData.total.recovered }}</h1>
              <p class="text-center">{{ $t("recovered") }}</p>
            </v-col>
            <v-col sm="3" cols="6" class="border-right">
              <v-img
                src="/img/ethiopia/dead.svg"
                class="small-icon mx-auto my-3"
              />
              <h1 class="text-center">{{ ethiopianData.total.deaths }}</h1>
              <p class="text-center">{{ $t("death") }}</p>
            </v-col>
            <v-col sm="3" cols="6">
              <v-img
                src="/img/ethiopia/active.svg"
                class="small-icon mx-auto my-3"
              />
              <h1 class="text-center">{{ ethiopianData.total.active }}</h1>
              <p class="text-center">{{ $t("activeCases") }}</p>
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
                      <th class="text-left">{{ $t("regions") }}</th>
                      <th class="text-left">{{ $t("totalCases") }}</th>
                      <th class="text-left">{{ $t("activeCases") }}</th>
                      <th class="text-left">{{ $t("totalDeath") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in regionalData" :key="item._id">
                      <td>{{ item.region }}</td>
                      <td>{{ item.total.confirmed }}</td>
                      <td>{{ item.total.active }}</td>
                      <td>{{ item.total.deaths }}</td>
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
                  <small class="d-inline-block my-2">
                    {{ $t(add.name) }}
                  </small>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-col cols="12" v-if="!isMobile()">
      <ethiopia-map />
    </v-col>
  </v-container>
</template>

<script>
  const EthiopiaMap = () => import("./EthiopiaMap");
  import {DoughnutChart} from "../Charts/charts.js";
  import {mdiPhone} from "@mdi/js";
import store from "@/store/";

export default {
  name: "Ethiopia",
  components: {
    DoughnutChart,
    EthiopiaMap
  },
  created() {
    this.setChartData();
  },
  mounted() {
    store.dispatch("setEthiopia", { lang: this.$i18n.locale });
  },
  watch: {
    "$i18n.locale"() {
      this.setChartData();
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
    isMobile() {
      console.log(
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
          )
      );
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
      );
    },
    setChartData() {
      this.chartData = {
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        labels: [
          this.$t("ethiopiaRegions.addisAbaba"),
          this.$t("ethiopiaRegions.oromia"),
          this.$t("ethiopiaRegions.amhara"),
          this.$t("ethiopiaRegions.tigrai"),
          this.$t("ethiopiaRegions.benishangulGumuz"),
          this.$t("ethiopiaRegions.gambela"),
          this.$t("ethiopiaRegions.snnpr"),
          this.$t("ethiopiaRegions.afar"),
          this.$t("ethiopiaRegions.somali"),
          this.$t("ethiopiaRegions.direDawa")
        ],
        datasets: [
          {
            label: "Data One",
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
            data: [219, 20, 13, 11, 2, 0, 6, 22, 51, 8]
          }
        ]
      };
    }
  },
  data() {
    return {
      mdiPhone,
      addresses: [
        {
          name: "ethiopiaRegions.addisAbaba",
          phone: 6406
        },
        {
          name: "ethiopiaRegions.oromia",
          phone: 6955
        },
        {
          name: "ethiopiaRegions.amhara",
          phone: 6981
        },
        {
          name: "ethiopiaRegions.snnpr",
          phone: 6929
        },
        {
          name: "ethiopiaRegions.tigrai",
          phone: 6244
        },
        {
          name: "ethiopiaRegions.somali",
          phone: 6599
        },
        {
          name: "ethiopiaRegions.direDawa",
          phone: 6407
        },
        {
          name: "ethiopiaRegions.afar",
          phone: 6220
        },
        {
          name: "ethiopiaRegions.benishangulGumuz",
          phone: 6016
        },
        {
          name: "ethiopiaRegions.harari",
          phone: 6864
        },
        {
          name: "ethiopiaRegions.gambela",
          phone: 6184
        }
      ],
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
