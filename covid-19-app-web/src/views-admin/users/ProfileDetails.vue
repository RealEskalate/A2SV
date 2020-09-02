<template>
  <v-navigation-drawer
    width="350"
    height="100%"
    v-model="sidebar"
    right
    absolute
    class="shadow-sm"
  >
    <v-list-item class="my-2 shadow-sm p-sticky">
      <v-list-item-action>
        <v-btn
          class="v-card--shaped"
          large
          @click="$emit('close-sidebar')"
          icon
        >
          <v-icon v-text="mdiForwardburger" />
        </v-btn>
      </v-list-item-action>
      <v-list-item-content>
        <h4>{{ basicInfo.username }}</h4>
      </v-list-item-content>
      <v-list-item-action>
        <v-chip
          class="float-right"
          small
          :color="relevanceColor(basicInfo.role) + ' darken-1'"
          text-color="white"
        >
          {{ basicInfo.role }}
        </v-chip>
      </v-list-item-action>
    </v-list-item>

    <v-list>
      <v-subheader v-text="$t('map.details')" />
      <v-list-item
        :key="index"
        v-for="(feature, index) in detailSingleFeatures"
      >
        <v-list-item-avatar size="20">
          <v-icon v-text="feature.icon" />
        </v-list-item-avatar>

        <v-list-item-content>
          <span>
            {{ $t(feature.name) }}:
            <span class="grey--text"> {{ basicInfo[feature.key] }} </span>
          </span>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-avatar size="20">
          <v-icon v-text="mdiMapMarkerCheck" />
        </v-list-item-avatar>
        <v-list-item-content> Latest location </v-list-item-content>
      </v-list-item>
      <div class="box">
        <div
          v-if="overlay"
          :class="{ overlay: overlay }"
          class="text-center justify-center d-flex align-center"
        >
          <div>No location data is found</div>
        </div>
        <mapbox
          class="shadow-sm"
          style="height: 10rem"
          @map-load="loaded"
          @map-init="mapInitialized"
          :access-token="api_token"
          :fullscreen-control="{
            show: true,
            position: 'top-left'
          }"
          :map-options="{
            style: 'mapbox://styles/mapbox/light-v10',
            center: [38.811684, 9.015326],
            zoom: 13
          }"
        />
      </div>
      <template v-for="(feature, index) in detailListFeatures">
        <v-divider
          :class="`mt-${index === 0 ? 0 : 3} mb-2`"
          :key="'divider_' + index"
        />
        <v-list-item :key="'title_' + index">
          <v-list-item-avatar size="20">
            <v-icon v-text="feature.icon" />
          </v-list-item-avatar>
          <v-list-item-content v-text="$t(feature.name)" />
        </v-list-item>
        <div
          :key="feature.name + index"
          class="grey lighten-5 shadow-in v-card--shaped text-center pa-3 mx-5"
        >
          <v-subheader
            class="mx-auto my-2 justify-center"
            v-if="!symptomHistory || symptomHistory.symptoms.length === 0"
            v-text="$t('auth.foundNothing')"
          />
          <v-chip
            v-else
            small
            class="ma-1 v-card--shaped shadow-sm"
            :key="key"
            v-for="(symptom, key) in symptomHistory.symptoms"
          >
            <span class="grey--text text--darken-2"> {{ symptom.name }} </span>
          </v-chip>
        </div>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {
  mdiForwardburger,
  mdiVirus,
  mdiWatch,
  mdiMapMarkerCheck
} from "@mdi/js";
import ajax from "../../auth/ajax";
import Mapbox from "mapbox-gl-vue";
import moment from "moment";

export default {
  name: "DetailSidebar",
  props: ["userId", "sidebar"],
  components: { Mapbox },
  data() {
    return {
      mdiForwardburger,
      mdiMapMarkerCheck,
      side_bar: false,
      status: null,
      basic: null,
      testReports: null,
      symptomHistory: null,
      api_token: process.env.VUE_APP_MAPBOX_API,
      map: null,
      overlay: false
    };
  },
  methods: {
    getColor(risk) {
      if (risk.toLowerCase() === "ephi_user") {
        return "#009c4d";
      } else if (risk.toLowerCase() === "basic") {
        return "#ffa64e";
      } else if (risk.toLowerCase() === "high") {
        return "#ff6767";
      }
    },
    mapInitialized(map) {
      this.map = map;
    },
    loaded(map) {
      if (this.basicInfo.latest_location_user === undefined) {
        this.overlay = true;
        return;
      }
      this.overlay = false;
      let coords = this.basicInfo.latest_location_user.location.coordinates;
      let ttl = this.basicInfo.latest_location_user.TTL;
      let self = this;
      map.flyTo({
        center: coords
      });
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function(error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image);
          // Add a GeoJSON source with 2 points
          map.addSource(self.basicInfo.username, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  // feature for Mapbox DC
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: coords
                  },
                  properties: {
                    title: self.basicInfo.username,
                    date: moment(ttl).format("ddd, MMMM Do YYYY")
                  }
                }
              ]
            }
          });
          // Add a symbol layer
          map.addLayer({
            id: self.basicInfo.username,
            type: "symbol",
            source: self.basicInfo.username,
            layout: {
              "icon-image": "custom-marker",
              // get the title name from the source's "title" property
              "text-field": "{title} \n {date} {font-scale: 0.8}",
              "text-offset": [0, 1.25],
              "text-anchor": "top"
            }
          });
        }
      );
    },
    updateMap() {
      console.log(this.basicInfo.latest_location_user.location.coordinates);
    }
  },
  watch: {
    sidebar: {
      handler() {
        this.side_bar = this.sidebar;
      }
    },
    userId: {
      handler() {
        console.log(this.id);
        ajax.get(`users-detail/${this.userId}`).then(
          res => {
            console.log(res.data);
            this.basic = res.data.basicInfo;
            if (res.data.symptomHistory !== null) {
              this.symptomHistory = res.data.symptomHistory.current_symptoms;
              this.status = res.data.symptomHistory.status;
              this.updateMap();
              console.log(this.symptomHistory);
            }
            this.testReports = res.data.testReports;
            if (this.map !== null) {
              this.loaded(this.map);
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    }
  },
  computed: {
    detailSingleFeatures() {
      return [
        // { name: "Gender", key: "gender", icon: mdiGenderMaleFemaleVariant },
        // { name: "Status", key: "status", icon: mdiStateMachine },
        // { name: "Location", key: "current_country", icon: mdiCrosshairsGps },
        { name: "Last Update", key: "updated_at", icon: mdiWatch }
      ];
    },
    detailListFeatures() {
      return [{ name: "Symptoms", key: "symptoms", icon: mdiVirus }];
    },
    basicInfo() {
      console.log("basic");
      return this.basic;
    }
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(24, 28, 32, 0.5);
  z-index: 9999;
  color: white;
}

.box {
  position: relative;
}

@import url("https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css");
</style>
