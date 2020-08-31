<template>
  <v-card shaped outlined class="overflow-hidden">
    <v-row style="height: 50vh">
      <v-col md="4" cols="12" class="pr-0">
        <v-subheader v-text="'Cities with most Covid-19 Cases'" />

        <v-list dense>
          <v-list-item-group color="primary" v-model="selected_city">
            <template v-for="(city, index) in cities">
              <v-list-item
                :key="index"
                class="py-3 px-5"
                @click="selectCity(city)"
              >
                <template>
                  <v-list-item-content>
                    <v-list-item-title v-text="city.name" class="text-wrap" />
                    <v-list-item-subtitle
                      class="text-wrap"
                      v-text="`${city.location[0]}, ${city.location[1]}`"
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
      <v-col md="8" cols="12" class="py-0 pl-0">
        <mapbox
          class="shadow-sm"
          style="height: 100%"
          :access-token="api_token"
          :map-options="{
            style: 'mapbox://styles/mapbox/light-v10',
            center: [38.811684, 9.015326],
            zoom: 13
          }"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Mapbox from "mapbox-gl-vue";

export default {
  name: "GreatestHitCity",
  components: {
    Mapbox
  },
  data() {
    return {
      api_token: process.env.VUE_APP_MAPBOX_API,
      selected_city: 0,
      cities: [
        {
          name: "Addis Ababa",
          cases: 123456,
          location: [38.8, 9.5]
        },
        {
          name: "Dire Dawa",
          cases: 12456,
          location: [38.8, 9.5]
        },
        {
          name: "Hawassa",
          cases: 3532,
          location: [38.8, 9.5]
        }
      ]
    };
  },
  methods: {
    selectCity(city) {
      // TODO Pan the map to that city
      console.log("This city selected", city.name);
    }
  }
};
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}
</style>

<style>
@import url("https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css");
</style>
