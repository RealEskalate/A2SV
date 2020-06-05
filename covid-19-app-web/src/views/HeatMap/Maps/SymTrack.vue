<template>
  <v-card outlined shaped class="shadow-sm overflow-hidden">
    <v-navigation-drawer
      v-model="sidebar"
      class="shadow-sm"
      style="z-index: 1; position: absolute;"
    >
      <v-list-item>
        <v-list-item-content>
          <v-icon
            style="position: absolute; right: 0; top: 0; z-index: 1"
            class="mt-3 mr-3"
            @click="sidebar = false"
            v-text="mdiClose"
          />
          <v-list-item-title class="title">
            Application
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-progress-linear
      style="position: absolute; z-index: 1"
      v-if="symTrackLoaders.map"
      height="2"
      striped
      indeterminate
      color="primary"
    />
    <mapbox
      :access-token="api_token"
      :map-options="{
        style: 'mapbox://styles/mapbox/light-v10',
        center: [38.811684, 9.015326],
        zoom: 13
      }"
      :geolocate-control="{
        show: true,
        position: 'bottom-right'
      }"
      @map-load="loaded"
      @map-zoomend="zoomEnd"
      @map-moveend="moved"
    />
  </v-card>
</template>

<script>
import store from "@/store";
import { mdiClose } from "@mdi/js";
import Mapbox from "mapbox-gl-vue";
import Supercluster from "supercluster";

export default {
  name: "SymTrack",
  components: { Mapbox },
  data: function() {
    return {
      mdiClose,
      items: [
        { title: "Dashboard", icon: "mdi-view-dashboard" },
        { title: "Photos", icon: "mdi-image" },
        { title: "About", icon: "mdi-help-box" }
      ],
      selectedInfo: null,
      api_token: process.env.VUE_APP_MAPBOX_API,
      sidebar: false,

      pointInfos: {},
      gridInfos: {},

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
      const small_cluster = new Supercluster({ radius: 40, maxZoom: 14 });
      const medium_cluster = new Supercluster({ radius: 40, maxZoom: 14 });
      const high_cluster = new Supercluster({ radius: 40, maxZoom: 14 });

      if (newValue.length > 0 && newValue[0].probability === undefined) {
        // we're getting grid results
        // just log them for now
        const gridCollections = this.gridsToGeoJson(newValue);

        small_cluster.load(gridCollections.smallGridCollection.features);
        medium_cluster.load(gridCollections.mediumGridCollection.features);
        high_cluster.load(gridCollections.heavyGridCollection.features);

        this.gridCollections = gridCollections;

        this.grid_rendering = true;
        this.symptomCollections = this.updateClusters();
      } else {
        const featureCollections = this.symptomsToGeoJson(newValue);

        small_cluster.load(featureCollections.smallSymptomCollection.features);
        medium_cluster.load(
          featureCollections.mediumSymptomCollection.features
        );
        high_cluster.load(featureCollections.highSymptomCollection.features);

        this.symptomCollections = featureCollections;
        this.grid_rendering = false;

        this.symptomCollections = this.updateClusters();
      }

      this.small_cluster = small_cluster;
      this.medium_cluster = medium_cluster;
      this.high_cluster = high_cluster;
      this.fillMapData();
    },
    loadedDetail(newValue) {
      this.selectedInfo = newValue;
    }
  },
  computed: {
    loadedData: () => store.getters.getLocationsSymptoms,
    loadedDetail: () => store.getters.getSymptomUser,
    symTrackLoaders: () => store.getters.getSymTrackLoaders
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
            icon: "pin3",
            id: element.user_id
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
        this.pointInfos[element.user_id] = element;
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
            total: total,
            id: element._id
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
        this.gridInfos[element._id] = element;
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

    fetchSelectedItem(event) {
      // const coordinates = event.features[0].geometry.coordinates;
      // console.log(event.features);
      this.sidebar = true;
      const id = event.features[0].properties.id;
      if (!id) this.selectedInfo = null;
      else if (this.gridInfos[id]) this.selectedInfo = this.gridInfos[id];
      else if (this.pointInfos[id]) this.selectedInfo = this.pointInfos[id];
      else store.dispatch("setSymptomUser", id);
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
        }

        if (medium_cluster) {
          medium_cluster
            .getClusters([west_lng, south_lat, east_lng, north_lat], zoom)
            .forEach(feature => {
              SymptomCollection.mediumSymptomCollection.features.push(feature);
            });
        }
        if (high_cluster) {
          high_cluster
            .getClusters([west_lng, south_lat, east_lng, north_lat], zoom)
            .forEach(feature => {
              SymptomCollection.highSymptomCollection.features.push(feature);
            });
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
      let map = this.map;
      if (this.grid_rendering === false) {
        if (
          map.getSource("small") === undefined &&
          res.smallSymptomCollection.features.length !== 0
        ) {
          map.addSource("small", {
            type: "geojson",
            data: res.smallSymptomCollection
          });
          map.addLayer({
            id: "small-points",
            type: "circle",
            paint: {
              "circle-radius": 8,
              "circle-opacity": 0.7,
              "circle-stroke-color": "White",
              "circle-color": "#FFC107"
            },
            source: "small",
            cluster: true,

            layout: {
              visibility: "visible"
            }
          });
          map.addLayer({
            id: "small-clusters",
            type: "circle",
            source: "small",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#FFC107",
                100,
                "#FF8F00",
                750,
                "#FF6F00"
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                20,
                100,
                30,
                750,
                40
              ],
              "circle-opacity": 0.3,
              "circle-stroke-width": 1.5,
              "circle-stroke-color": "#fcfcfc"
            },
            layout: {
              visibility: "visible"
            }
          });

          map.addLayer({
            id: "small-cluster-count",
            type: "symbol",
            source: "small",
            filter: ["has", "point_count"],
            layout: {
              "text-field": "{point_count_abbreviated}",
              "text-font": ["Ubuntu Medium", "Arial Unicode MS Regular"],
              "text-size": 12,
              visibility: "visible"
            },
            paint: {
              "text-color": "#757575"
            }
          });
          // when user clicks on mildly symptomatic data points, call symptomuser API with his id
          // and display his symptoms
          map.on("click", "small-points", this.fetchSelectedItem);
        }

        if (
          map.getSource("medium") === undefined &&
          res.mediumSymptomCollection.features.length !== 0
        ) {
          map.addSource("medium", {
            type: "geojson",
            data: res.mediumSymptomCollection
          });

          map.addLayer({
            id: "medium-clusters",
            type: "circle",
            source: "medium",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#EF6C00",
                100,
                "#E65100",
                750,
                "#FF5722"
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                20,
                100,
                30,
                750,
                40
              ],
              "circle-opacity": 0.3,
              "circle-stroke-width": 1.5,
              "circle-stroke-color": "#fcfcfc"
            },
            layout: {
              visibility: "visible"
            }
          });

          map.addLayer({
            id: "medium-cluster-count",
            type: "symbol",
            source: "medium",
            filter: ["has", "point_count"],
            layout: {
              "text-field": "{point_count_abbreviated}",
              "text-font": ["Ubuntu Medium", "Arial Unicode MS Regular"],
              "text-size": 12,
              visibility: "visible"
            },
            paint: {
              "text-color": "#757575"
            }
          });
          map.on("click", "medium-clusters", this.fetchSelectedItem);
        }

        if (
          map.getSource("high") === undefined &&
          res.highSymptomCollection.features.length !== 0
        ) {
          map.addSource("high", {
            type: "geojson",
            data: res.highSymptomCollection
          });

          map.addLayer({
            id: "high-clusters",
            type: "circle",
            source: "high",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#B71C1C",
                100,
                "#E91E63",
                750,
                "#9C27B0"
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                20,
                100,
                30,
                750,
                40
              ],
              "circle-opacity": 0.3,
              "circle-stroke-width": 1.5,
              "circle-stroke-color": "#fcfcfc"
            },
            layout: {
              visibility: "visible"
            }
          });

          map.addLayer({
            id: "high-cluster-count",
            type: "symbol",
            source: "high",
            filter: ["has", "point_count"],
            layout: {
              "text-field": "{point_count_abbreviated}",
              "text-font": ["Ubuntu Medium", "Arial Unicode MS Regular"],
              "text-size": 12,
              visibility: "visible"
            },
            paint: {
              "text-color": "#757575"
            }
          });
          map.on("click", "high-clusters", this.fetchSelectedItem);
        }
      } else {
        if (
          map.getSource("grid") === undefined &&
          res.highSymptomCollection.features.length !== 0
        ) {
          map.addSource("grid", {
            type: "geojson",
            data: res.highSymptomCollection
          });
          map.addLayer({
            id: "grid-points",
            type: "circle",
            paint: {
              "circle-radius": [
                "step",
                ["get", "total"],
                30,
                300,
                40,
                900,
                50,
                1500,
                60
              ],
              "circle-color": [
                "step",
                ["get", "total"],
                "#FFC107",
                300,
                "#FF8F00",
                900,
                "#EF6C00",
                1500,
                "#9C27B0"
              ],
              "circle-opacity": 0.3,
              "circle-stroke-width": 1.5,
              "circle-stroke-color": "#fcfcfc"
            },
            source: "grid",
            layout: {
              visibility: "visible"
            }
          });
          let below_layer_id = "grid-points";
          map.addLayer(
            {
              id: "grid-point-counts",
              type: "symbol",
              source: "grid",
              layout: {
                "icon-allow-overlap": true,
                "text-allow-overlap": true,
                "text-field": ["get", "total"],
                "text-font": ["Ubuntu Medium", "Arial Unicode MS Regular"],
                "text-size": 20,
                "text-pitch-alignment": "map",
                visibility: "visible"
              },
              paint: {
                "text-color": "#757575"
              }
            },
            below_layer_id
          );
          map.on("click", "grid-points", this.fetchSelectedItem);
        }
      }
    },

    zoomEnd(map) {
      // update clusters
      const grid_rendering = this.grid_rendering;
      this.symptomCollections = this.updateClusters();
      if (grid_rendering === true) {
        map
          .getSource("grid")
          .setData(this.symptomCollections.highSymptomCollection);
      } else {
        map
          .getSource("small")
          .setData(this.symptomCollections.smallSymptomCollection);
        map
          .getSource("medium")
          .setData(this.symptomCollections.mediumSymptomCollection);
        map
          .getSource("high")
          .setData(this.symptomCollections.highSymptomCollection);
      }

      // update map bounds
      const bounds = this.map.getBounds();
      const west_lng = bounds._sw.lng,
        south_lat = bounds._sw.lat;
      const east_lng = bounds._ne.lng,
        north_lat = bounds._ne.lat;

      this.top_left_bound = [west_lng, north_lat];
      this.top_right_bound = [east_lng, north_lat];
      this.bottom_left_bound = [west_lng, south_lat];
      this.bottom_right_bound = [east_lng, south_lat];

      // Make fetch call
      this.fetchLocationsSymptoms();
      const res = this.symptomCollections;

      if (res.length !== 0 && this.grid_rendering === true) {
        // hide non-grid layers
        if (map.getSource("small") !== undefined) {
          map.setLayoutProperty("small-points", "visibility", "none");
          map.setLayoutProperty("small-clusters", "visibility", "none");
          map.setLayoutProperty("small-cluster-count", "visibility", "none");

          map.setLayoutProperty("medium-clusters", "visibility", "none");
          map.setLayoutProperty("medium-cluster-count", "visibility", "none");

          map.setLayoutProperty("high-clusters", "visibility", "none");
          map.setLayoutProperty("high-cluster-count", "visibility", "none");
        }

        // create grid source if didn't exist before
        if (map.getSource("grid") === undefined) {
          this.fillMapData(map);
        }
        // if otherwise the grid was invisible, unhide it
        if (map.getLayoutProperty("grid-points", "visibility") !== "visible") {
          map.setLayoutProperty("grid-points", "visibility", "visible");
          map.setLayoutProperty("grid-point-counts", "visibility", "visible");
        }
        // update data source
        map.getSource("grid").setData(res.highSymptomCollection);
      } else if (res.length !== 0 && this.grid_rendering === false) {
        // hide grid layer
        if (
          map.getSource("grid") !== undefined &&
          map.getLayoutProperty("grid-points", "visibility") === "visible"
        ) {
          map.setLayoutProperty("grid-points", "visibility", "none");
          map.setLayoutProperty("grid-point-counts", "visibility", "none");
        }

        // create non-grid layers if they don't exist
        if (
          map.getSource("small") === undefined &&
          res.smallSymptomCollection.features.length > 0
        ) {
          this.fillMapData(map);
        }
        if (
          map.getSource("medium") === undefined &&
          res.mediumSymptomCollection.features.length > 0
        ) {
          this.fillMapData(map);
        }

        if (
          map.getSource("high") === undefined &&
          res.highSymptomCollection.features.length > 0
        ) {
          this.fillMapData(map);
        }
        // show non-grid layers if invisible before
        else if (
          map.getLayoutProperty("small-points", "visibility") !== "visible"
        ) {
          map.setLayoutProperty("small-points", "visibility", "visible");
          map.setLayoutProperty("small-clusters", "visibility", "visible");
          map.setLayoutProperty("small-cluster-count", "visibility", "visible");
        } else if (
          map.getLayoutProperty("medium-clusters", "visibility") !== "visible"
        ) {
          map.setLayoutProperty("medium-clusters", "visibility", "visible");
          map.setLayoutProperty(
            "medium-cluster-count",
            "visibility",
            "visible"
          );
        } else if (
          map.getLayoutProperty("high-clusters", "visibility") !== "visible"
        ) {
          map.setLayoutProperty("high-clusters", "visibility", "visible");
          map.setLayoutProperty("high-cluster-count", "visibility", "visible");
        }

        // update data source
        map.getSource("small").setData(res.smallSymptomCollection);
        map.getSource("medium").setData(res.mediumSymptomCollection);
        map.getSource("high").setData(res.highSymptomCollection);
      }
    },

    moved(map) {
      const bounds = map.getBounds();
      const west_lng = bounds._sw.lng,
        south_lat = bounds._sw.lat;
      const east_lng = bounds._ne.lng,
        north_lat = bounds._ne.lat;

      this.top_left_bound = [west_lng, north_lat];
      this.top_right_bound = [east_lng, north_lat];
      this.bottom_left_bound = [west_lng, south_lat];
      this.bottom_right_bound = [east_lng, south_lat];

      this.fetchLocationsSymptoms();
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
