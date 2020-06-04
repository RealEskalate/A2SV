<template>
  <v-card outlined shaped class="shadow-in">
    <v-progress-linear
      style="position: absolute"
      v-if="mapLoaders.locationsSymptoms"
      height="3"
      striped
      indeterminate
      color="primary"
    />
    <mapbox
      :access-token="api_token"
      :map-options="{
        style: 'mapbox://styles/mapbox/light-v10',
        center: [38.811684, 9.015326],
        zoom: 12
      }"
      :geolocate-control="{
        show: true,
        position: 'bottom-right'
      }"
      @map-load="loaded"
    />
  </v-card>
</template>

<script>
import store from "@/store";
import Mapbox from "mapbox-gl-vue";
import Supercluster from "supercluster";

const pointInfos = {};
const grid_infos = {};

// let currentPointInfo = null;
// let current_grid_info = null;

export default {
  name: "SymTrack",
  components: { Mapbox },
  data: function() {
    return {
      api_token: process.env.VUE_APP_MAPBOX_API,

      small_cluster: null,
      medium_cluster: null,
      high_cluster: null,

      small_superclusters: null,
      medium_superclusters: null,
      high_superclusters: null,

      symptomCollections: {
        smallSymptomCollection: {
          type: "FeatureCollection",
          features: []
        },
        mediumSymptomCollection: {
          type: "FeatureCollection",
          features: []
        },
        highSymptomCollection: {
          type: "FeatureCollection",
          features: []
        }
      },

      gridCollections: {
        heavyGridCollection: {
          type: "FeatureCollection",
          features: []
        }
      },

      user_longitude: 38.811684,
      user_latitude: 9.015326

      // top_left_bound: [38.78505631763457, 9.071317349756356],
      // top_right_bound: [38.83802611148582, 9.071317349756356],
      // bottom_left_bound: [38.79999690988012, 8.976957049826808],
      // bottom_right_bound: [38.82312696429011, 8.976957049826808],
    };
  },
  watch: {
    loadedData(newValue) {
      if (newValue.length > 0 && newValue[0].probability === undefined) {
        // we're getting grid results
        // just log them for now
        const gridCollections = this.gridsToGeoJson(newValue);
        const small_cluster = new Supercluster({ radius: 40, maxZoom: 14 });
        const medium_cluster = new Supercluster({ radius: 40, maxZoom: 14 });
        const high_cluster = new Supercluster({ radius: 40, maxZoom: 14 });

        small_cluster.load(gridCollections.smallGridCollection.features);
        medium_cluster.load(gridCollections.mediumGridCollection.features);
        high_cluster.load(gridCollections.heavyGridCollection.features);

        this.gridCollections = gridCollections;
        this.small_cluster = small_cluster;
        this.medium_cluster = medium_cluster;
        this.high_cluster = high_cluster;
        // this.grid_rendering = true;
        // if (animating === true) {
        //   animating = false;
        // }
        this.symptomCollections = this.updateClusters();
      } else {
        const featureCollections = this.symptomsToGeoJson(newValue);

        const small_cluster = new Supercluster({ radius: 40, maxZoom: 14 });
        const medium_cluster = new Supercluster({ radius: 40, maxZoom: 14 });
        const high_cluster = new Supercluster({ radius: 40, maxZoom: 14 });

        small_cluster.load(featureCollections.smallSymptomCollection.features);
        medium_cluster.load(
          featureCollections.mediumSymptomCollection.features
        );
        high_cluster.load(featureCollections.highSymptomCollection.features);

        this.symptomCollections = featureCollections;
        this.small_cluster = small_cluster;
        this.medium_cluster = medium_cluster;
        this.high_cluster = high_cluster;
        this.grid_rendering = false;
        // if (animating === true) {
        //   animating = false;
        // }
        this.symptomCollections = this.updateClusters();
      }

      this.fillMapData();
    }
  },
  computed: {
    loadedData: () => store.getters.getLocationsSymptoms,
    mapLoaders: () => store.getters.getMapLoaders
  },
  methods: {
    symptomsToGeoJson(symptoms) {
      const symptomCollections = {
        smallSymptomCollection: {
          type: "FeatureCollection",
          features: []
        },
        mediumSymptomCollection: {
          type: "FeatureCollection",
          features: []
        },
        highSymptomCollection: {
          type: "FeatureCollection",
          features: []
        }
      };
      for (let index = 0; index < symptoms.length; index++) {
        let element = symptoms[index];

        const feat = {
          type: "Feature",
          id: element.user_id,
          properties: {
            icon: "pin3"
          },
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(element.location.coordinates[0]),
              parseFloat(element.location.coordinates[1])
            ]
          }
        };
        const prob = element.probability;
        if (prob < 0.2) {
          symptomCollections.smallSymptomCollection.features.push(feat);
        } else if (prob < 0.4) {
          symptomCollections.mediumSymptomCollection.features.push(feat);
        } else {
          symptomCollections.highSymptomCollection.features.push(feat);
        }
        pointInfos[element.user_id] = element;
      }
      return symptomCollections;
    },

    gridsToGeoJson(grids) {
      const gridCollections = {
        smallGridCollection: {
          type: "FeatureCollection",
          features: []
        },
        mediumGridCollection: {
          type: "FeatureCollection",
          features: []
        },
        heavyGridCollection: {
          type: "FeatureCollection",
          features: []
        }
      };
      for (let i = 0; i < grids.length; i++) {
        const element = grids[i];
        const total =
          parseInt(grids[i].genders.MALE) +
          parseInt(grids[i].genders.FEMALE) +
          parseInt(grids[i].genders.UNDISCLOSED);

        const feat = {
          type: "Feature",
          id: element._id,
          properties: {
            icon: "pin3",
            total: total
          },
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(element.location.coordinates[0]),
              parseFloat(element.location.coordinates[1])
            ]
          }
        };
        // subtitute with number of infections later
        gridCollections.heavyGridCollection.features.push(feat);
        grid_infos[element._id] = element;
      }
      return gridCollections;
    },

    fetchLocationsSymptoms() {
      const input = {
        longitude: this.user_longitude,
        latitude: this.user_latitude,

        top_left_bound: this.top_left_bound,
        top_right_bound: this.top_right_bound,
        bottom_left_bound: this.bottom_left_bound,
        bottom_right_bound: this.bottom_right_bound
      };
      store.dispatch("setLocationsSymptoms", input);
    },

    updateClusters() {
      const small_cluster = this.small_cluster;
      const medium_cluster = this.medium_cluster;
      const high_cluster = this.high_cluster;

      const SymptomCollection = {
        smallSymptomCollection: {
          type: "FeatureCollection",
          features: []
        },
        mediumSymptomCollection: {
          type: "FeatureCollection",
          features: []
        },
        highSymptomCollection: {
          type: "FeatureCollection",
          features: []
        }
      };

      if (small_cluster || medium_cluster || high_cluster) {
        const bounds = this.map.getBounds();
        const west_lng = bounds._sw.lng,
          south_lat = bounds._sw.lat;
        const east_lng = bounds._ne.lng,
          north_lat = bounds._ne.lat;

        const zoom = Math.round(this.map.getZoom());

        if (small_cluster) {
          small_cluster
            .getClusters([west_lng, south_lat, east_lng, north_lat], zoom)
            .forEach(feature => {
              SymptomCollection.smallSymptomCollection.features.push(feature);
            });
          this.small_superclusters = small_cluster.getClusters(
            [west_lng, south_lat, east_lng, north_lat],
            zoom
          );
        }

        if (medium_cluster) {
          medium_cluster
            .getClusters([west_lng, south_lat, east_lng, north_lat], zoom)
            .forEach(feature => {
              SymptomCollection.mediumSymptomCollection.features.push(feature);
            });
          this.medium_superclusters = medium_cluster.getClusters(
            [west_lng, south_lat, east_lng, north_lat],
            zoom
          );
        }
        if (high_cluster) {
          high_cluster
            .getClusters([west_lng, south_lat, east_lng, north_lat], zoom)
            .forEach(feature => {
              SymptomCollection.highSymptomCollection.features.push(feature);
            });
          this.high_superclusters = high_cluster.getClusters(
            [west_lng, south_lat, east_lng, north_lat],
            zoom
          );
        }
      }
      return SymptomCollection;
    },

    loaded(map) {
      if (!this.map) {
        this.map = map; // save the map for use by other components
      }
      const bounds = this.map.getBounds();
      const west_lng = bounds._sw.lng,
        south_lat = bounds._sw.lat;
      const east_lng = bounds._ne.lng,
        north_lat = bounds._ne.lat;

      this.top_left_bound = [west_lng, north_lat];
      this.top_right_bound = [east_lng, north_lat];
      this.bottom_left_bound = [west_lng, south_lat];
      this.bottom_right_bound = [east_lng, south_lat];

      this.fetchLocationsSymptoms();
    },

    fillMapData() {
      let res = this.symptomCollections;
      if (res.smallSymptomCollection.features.length !== 0) {
        this.map.addLayer({
          id: "points",
          type: "circle",
          paint: {
            "circle-radius": 12,
            "circle-color": "Red"
          },
          source: {
            type: "geojson",
            data: this.symptomCollections.smallSymptomCollection
          }
        });
      }

      if (res.highSymptomCollection.features.length !== 0) {
        this.map.addLayer({
          id: "points",
          type: "circle",
          paint: {
            "circle-radius": [
              "step",
              ["get", "total"],
              20,
              300,
              30,
              900,
              40,
              1500,
              50
            ],
            "circle-color": [
              "step",
              ["get", "total"],
              "#FFEE58",
              300,
              "#FFA000",
              900,
              "#F4511E",
              1500,
              "#E53935"
            ],
            "circle-stroke-width": 3,
            "circle-stroke-color": "#fdfdfd",
            "circle-opacity": 0.3
          },
          source: {
            type: "geojson",
            data: res.highSymptomCollection
          }
        });
        let below_layer_id = "points";
        this.map.addLayer(
          {
            id: "point-counts",
            type: "symbol",
            source: {
              type: "geojson",
              data: res.highSymptomCollection
            },
            layout: {
              "text-field": ["get", "total"],
              "text-font": ["Ubuntu Medium", "Arial Unicode MS Regular"],
              "text-size": 16,
              "text-pitch-alignment": "map"
            },
            paint: {
              "text-color": this.$vuetify.theme.themes.light.secondary
            }
          },
          below_layer_id
        );
      }
    }
  }
};
</script>

<style>
@import url("https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css");
</style>
<style>
#map {
  width: 100%;
  height: 100%;
}
</style>
