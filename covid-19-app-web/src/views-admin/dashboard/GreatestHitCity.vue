<template>
  <v-card shaped outlined class="overflow-hidden">
    <v-row>
      <v-col md="4" cols="12" class="pr-md-0">
        <v-subheader v-text="'Regions with most Symptoms'" />

        <v-list dense>
          <v-list-item-group color="primary" v-model="selected_city" mandatory>
            <template v-for="(city, index) in cities">
              <v-list-item :key="city + index" class="py-3 px-5">
                <template>
                  <v-list-item-content>
                    <v-list-item-title v-text="city.name" class="text-wrap" />
                    <v-list-item-subtitle
                      class="text-wrap"
                      v-text="`${city.latitude}, ${city.longitude}`"
                    />
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-title
                      class="text-wrap"
                      v-text="numberWithCommas(city.cases)"
                    />
                  </v-list-item-action>
                </template>
              </v-list-item>

              <v-divider v-if="index + 1 < cities.length" :key="index" />
            </template>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col md="8" cols="12" class="py-0 pl-md-0" style="height: 50vh">
        <sym-track :selected-city="cities[selected_city]" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import SymTrack from "../../views/HeatMap/Maps/SymTrack";

export default {
  name: "GreatestHitCity",
  components: {
    SymTrack
  },
  data() {
    return {
      api_token: process.env.VUE_APP_MAPBOX_API,
      selected_city: 0,
      cities: [
        {
          name: "Addis Ababa",
          cases: 123456,
          longitude: 38.7578,
          latitude: 9.0333
        },
        {
          name: "Nazrēt",
          cases: 12456,
          longitude: 39.27,
          latitude: 8.55
        },
        {
          name: "Dire Dawa",
          cases: 3532,
          longitude: 41.86,
          latitude: 9.59
        },
        {
          name: "Hawassa",
          cases: 532,
          longitude: 38.4955,
          latitude: 7.0504
        }
      ]
    };
  }
};
</script>
