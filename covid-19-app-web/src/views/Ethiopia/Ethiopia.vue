<template>
  <v-container class="mb-12">
    <v-row>
      <v-col cols="12">
        <h3
          class="display-1 font-weight-thin mb-5"
          v-text="'Covid-19 in Ethiopia'"
        />
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
              <h1 class="text-center">557</h1>
              <p class="text-center">Total cases</p>
            </v-col>
            <v-col sm="3" cols="6" class="border-right">
              <v-img
                src="/img/ethiopia/recovered.svg"
                class="small-icon mx-auto my-3"
              />
              <h1 class="text-center">116</h1>
              <p class="text-center">Recovered</p>
            </v-col>
            <v-col sm="3" cols="6" class="border-right">
              <v-img
                src="/img/ethiopia/dead.svg"
                class="small-icon mx-auto my-3"
              />
              <h1 class="text-center">5</h1>
              <p class="text-center">Death</p>
            </v-col>
            <v-col sm="3" cols="6">
              <v-img
                src="/img/ethiopia/active.svg"
                class="small-icon mx-auto my-3"
              />
              <h1 class="text-center">229</h1>
              <p class="text-center">Active cases</p>
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
                :data="chartData"
                :options="chartOptions"
              />
            </v-col>
            <v-col md="6" cols="12">
              <h3
                class="mb-3 px-3 primary--text"
                v-text="'Regional Statistics'"
              />
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Regions</th>
                      <th class="text-left">Total cases</th>
                      <th class="text-left">Total Death</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in coronaCases" :key="item.name">
                    <td>{{ $t(item.name) }}</td>
                      <td>{{ item.totalCases }}</td>
                      <td>{{ item.totalDeath }}</td>
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
              v-text="'Free COVID-19 Reporting Phone Numbers'"
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
                  <small class="d-inline-block my-2"> {{ $t(add.name) }} </small>
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
  import {DoughnutChart} from "../Home/Charts/charts.js";
  import {mdiPhone} from "@mdi/js";

  export default {
  name: "Ethiopia",
  components: {
    DoughnutChart
  },
  data() {
    return {
      mdiPhone,
      addresses: [
        {
          name: "addisAbaba",
          phone: 6406
        },
        {
          name: "oromia",
          phone: 6955
        },
        {
          name: "amhara",
          phone: 6981
        },
        {
          name: "snnpr",
          phone: 6929
        },
        {
          name: "tigray",
          phone: 6244
        },
        {
          name: "somali",
          phone: 6599
        },
        {
          name: "direDawa",
          phone: 6407
        },
        {
          name: "afar",
          phone: 6220
        },
        {
          name: "benishangul",
          phone: 6016
        },
        {
          name: "harari",
          phone: 6864
        },
        {
          name: "gambela",
          phone: 6184
        }
      ],
      coronaCases: [
        {
          name: "addisAbaba",
          totalCases: 159,
          totalDeath: 4
        },
        {
          name: "oromia",
          totalCases: 53,
          totalDeath: 1
        },
        {
          name: "tigrai",
          totalCases: 262,
          totalDeath: 2
        },
        {
          name: "benishangulGumuz",
          totalCases: 22,
          totalDeath: 2
        },
        {
          name: "gambela",
          totalCases: 12,
          totalDeath: 0
        },
        {
          name: "snnpr",
          totalCases: 22,
          totalDeath: 2
        },
        {
          name: "afar",
          totalCases: 5,
          totalDeath: 2
        },
        {
          name: "somali",
          totalCases: 5,
          totalDeath: 0
        },
        {
          name: "direDawa",
          totalCases: 2,
          totalDeath: 2
        }
      ],
      chartOptions: {
        hoverBorderWidth: 20,
        legend: {
          display: this.$vuetify.breakpoint.mdAndUp,
          position: "right"
        }
      },
      chartData: {
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        labels: [
          this.$t("addisAbaba"),
          this.$t("oromia"),
          this.$t("amhara"),
          this.$t("tigrai"),
          this.$t("benishangulGumuz"),
          this.$t("gambela"),
          this.$t("snnpr"),
          this.$t("afar"),
          this.$t("somali"),
          this.$t("direDawa")
        ],
        datasets: [
          {
            label: "Data One",
            backgroundColor: [
              "#41B883",
              "#E46651",
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
      }
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
