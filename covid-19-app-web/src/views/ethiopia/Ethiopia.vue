<template>
  <v-container>
    <h1 class="my-2">Covid-19 Ethiopia Statistics</h1>
    <v-card class="mx-auto">
      <div class="row">
        <div class="col-sm-6 col-md-4">
          <v-img src="/img/ethiopia/sick.svg" class="small-icon mx-auto" />
          <h1 class="text-center">557</h1>
          <p class="text-center">Total cases</p>
        </div>
        <v-divider vertical light></v-divider>
        <v-col :md="$vuetify.breakpoint.smAndDown ? 6 : 4">
          <v-img src="/img/ethiopia/recovered.svg" class="small-icon mx-auto" />
          <h1 class="text-center">116</h1>
          <p class="text-center">Recovered</p>
        </v-col>

        <v-divider vertical light></v-divider>
        <v-col :md="$vuetify.breakpoint.smAndDown ? 6 : 4">
          <v-img src="/img/ethiopia/dead.svg" class="small-icon mx-auto" />
          <h1 class="text-center">5</h1>
          <p class="text-center">Death</p>
        </v-col>

        <v-divider vertical light></v-divider>
        <v-col :md="$vuetify.breakpoint.smAndDown ? 6 : 4">
          <v-img src="/img/ethiopia/active.svg" class="small-icon mx-auto" />
          <h1 class="text-center">229</h1>
          <p class="text-center">Active cases</p>
        </v-col>
      </div>
    </v-card>

    <v-card class="mt-5 mt-md-5">
      <v-row>
        <pie-chart :data="chartData" :options="chartOptions" class="col-md-5" />
        <v-simple-table class="col-md-7">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Regions</th>
                <th class="text-left">Total cases</th>
                <th class="text-left">Total Death</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in desserts" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.totalCases }}</td>
                <td>{{ item.totalDeath }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-row>
    </v-card>

    <v-card class="mt-5">
      <v-card-title>
        <h4 class="text-center">Free COVID-19 Reporting Phone Numbers</h4>
      </v-card-title>
      <v-row align="center" align-content="center" class="mx-auto">
        <v-col
          class="flex"
          v-for="add in addresses"
          :key="add.phone"
          md="4"
          cols="6"
        >
          <small class="mr-2"> {{ add.name }}</small>
          <a style="text-decoration: none" v-bind:href="'tel:' + add.phone">
            <v-icon>{{ mdiPhone }}</v-icon>
            {{ add.phone }}</a
          >
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import PieChart from "./piechart.js";
import { mdiPhone } from "@mdi/js";

export default {
  name: "Ethiopia",
  components: {
    PieChart
  },
  data() {
    return {
      mdiPhone,
      addresses: [
        {
          name: "Addis Ababa",
          phone: 6406
        },
        {
          name: "Oromia",
          phone: 6955
        },
        {
          name: "Amhara",
          phone: 6981
        },
        {
          name: "SNNPR",
          phone: 6929
        },
        {
          name: "Tigray",
          phone: 6244
        },
        {
          name: "Somali",
          phone: 6599
        },
        {
          name: "Dire Dawa",
          phone: 6407
        },
        {
          name: "Afar",
          phone: 6220
        },
        {
          name: "Benishangul",
          phone: 6016
        },
        {
          name: "Harari",
          phone: 6864
        },
        {
          name: "Gambela",
          phone: 6184
        }
      ],
      desserts: [
        {
          name: "Addis Ababa",
          totalCases: 159,
          totalDeath: 4
        },
        {
          name: "Oromia",
          totalCases: 53,
          totalDeath: 1
        },
        {
          name: "Tigrai",
          totalCases: 262,
          totalDeath: 2
        },
        {
          name: "Benishangul Gumuz",
          totalCases: 22,
          totalDeath: 2
        },
        {
          name: "Gambela",
          totalCases: 12,
          totalDeath: 0
        },
        {
          name: "SNNPR",
          totalCases: 22,
          totalDeath: 2
        },
        {
          name: "Afar",
          totalCases: 5,
          totalDeath: 2
        },
        {
          name: "Somali",
          totalCases: 5,
          totalDeath: 0
        },
        {
          name: "Dire Dawa",
          totalCases: 2,
          totalDeath: 2
        }
      ],
      chartOptions: {
        hoverBorderWidth: 20,
        legend: {
          display: true,
          position: "right"
        }
      },
      chartData: {
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        labels: [
          "Addis Ababa",
          "Oromia",
          "Amhara",
          "Tigrai",
          "Benishangul Gumuz",
          "Gambela",
          "SNNPR",
          "Afar",
          "Somali",
          "Dire Dawa"
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
.col-md-4 {
  max-width: 24%;
}

.small-icon {
  max-width: 3rem;
}

.v-card {
  box-shadow: 5px 5px 5px #eee;
}

.pie-chart {
  max-width: 25rem;
}
</style>
