<template>
  <v-card class="row">
    <v-col cols="5" class="container ">
      <v-card-title class="mx-auto card-title"
        >City with greatest covid-19 case count
      </v-card-title>
      <p class="text-center font-weight-bold">Addis Ababa</p>
      <p class="text-center">123, 345</p>
    </v-col>
    <v-col cols="7" style="padding: 0!important;">
      <mapbox
        :access-token="api_token"
        :map-options="{
          style: 'mapbox://styles/mapbox/light-v10',
          center: [38.811684, 9.015326],
          zoom: 13
        }"
      />
    </v-col>
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
      api_token: process.env.VUE_APP_MAPBOX_API
    };
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100% !important;
  min-height: 15rem !important;
  font-size: 0.3em !important;
  text-align: right;
}

.card-title {
  font-size: small;
}
</style>
