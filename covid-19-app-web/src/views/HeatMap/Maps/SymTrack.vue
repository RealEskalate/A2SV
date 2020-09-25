<template>
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
    @map-zoomend="changed"
    @map-moveend="changed"
  />
</template>

<script>
import store from "@/store";
import Mapbox from "mapbox-gl-vue";
import Supercluster from "supercluster";

export default {
  name: "SymTrack",

  components: { Mapbox },

  created() {
    setInterval(this.fetchLocationsSymptoms, 5 * 60 * 1000);
  },

  props: {
    selectedCity: {
      type: Object,
      default() {
        return null;
      }
    }
  },

  data: function() {
    return {
      api_token: process.env.VUE_APP_MAPBOX_API,
      selectedInfo: null,

      pointInfos: {},
      gridInfos: {},

      mode: "points",

      small_cluster: null,
      medium_cluster: null,
      high_cluster: null,

      layers: {
        grid: ["grid-points", "grid-point-counts"],
        non_grid: [
          "small-points",
          "small-clusters",
          "small-cluster-count",

          "medium-points",
          "medium-clusters",
          "medium-cluster-count",

          "high-points",
          "high-clusters",
          "high-cluster-count"
        ]
      },

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
    };
  },

  watch: {
    selectedCity(newValue) {
      this.map.flyTo({
        center: [newValue.longitude, newValue.latitude],
        essential: true
      });
    },
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
      this.updateMap();
    },
    userSymptoms(newValue) {
      this.selectedInfo.gender = this.$t("auth." + newValue[0].toLowerCase());
      this.selectedInfo.age_group = newValue[1];
      this.selectedInfo.value = newValue[2];
      this.$emit("updateSelectedInfo", this.selectedInfo);
    }
  },

  computed: {
    loadedData: () => store.getters.getLocationsSymptoms,
    userSymptoms: () => {
      let res = [];
      let gender = null;
      let age_group = null;
      let retrieved = store.getters.getSymptomUser;
      retrieved.symptom_info.forEach(function(sym) {
        res.push(sym.Symptom.name);
        if (!gender) gender = sym.gender;
        if (!age_group) age_group = sym.age_group;
      });
      return [gender, age_group, res];
    },
    loadedCities: () => store.getters.getCities
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
            id: element.user_id,
            color: this.rateToColor(element.probability, 60, 0)
          },
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(element.location.coordinates[0]),
              parseFloat(element.location.coordinates[1])
            ]
          }
        };
        // symptomCollections.smallSymptomCollection.features.push(feat);
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
          parseInt(element.genders.MALE) +
          parseInt(element.genders.FEMALE) +
          parseInt(element.genders.UNDISCLOSED);

        const feat = {
          type: "Feature",
          id: element._id,
          properties: {
            icon: "pin3",
            total: total,
            id: element._id,
            color: this.rateToColor(total / 2000, 60, 0),
            size: 25 + Math.min(total / 2000, 1) * 45
          },
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(element.location.coordinates[0]),
              parseFloat(element.location.coordinates[1])
            ]
          }
        };
        // substitute with number of infections later
        gridCollections.heavyGridCollection.features.push(feat);
        this.gridInfos[element._id] = element;
      }
      return gridCollections;
    },

    fetchLocationsSymptoms() {
      store.dispatch("setLocationsSymptoms", {
        longitude: this.user_longitude,
        latitude: this.user_latitude,

        top_left_bound: this.top_left_bound,
        top_right_bound: this.top_right_bound,
        bottom_left_bound: this.bottom_left_bound,
        bottom_right_bound: this.bottom_right_bound,

        language: this.$i18n.locale
      });
    },

    fetchSelectedItem(event) {
      this.sidebar = true;
      const id = event.features[0].properties.id;
      if (!id) this.selectedInfo = null;
      else if (this.gridInfos[id]) this.selectedInfo = this.gridInfos[id];
      else if (this.pointInfos[id]) {
        store.dispatch("setSymptomUser", {
          userId: id,
          lang: this.$i18n.locale,
          demo: false
        });
        this.selectedInfo = this.pointInfos[id];
      }
      this.$emit("updateSelectedInfo", this.selectedInfo);
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
              let point_count = feature.properties.point_count;
              if (point_count) {
                this.mode = "cluster";
                feature.properties.color = this.rateToColor(
                  point_count / 15,
                  55,
                  10
                );
                feature.properties.size =
                  15 + Math.min(point_count / 15, 1) * 5;
                feature.properties.point_opacity = 0;
              } else {
                this.mode = "points";
                feature.properties.point_opacity = 0.5;
              }
              SymptomCollection.smallSymptomCollection.features.push(feature);
            });
        }

        if (medium_cluster) {
          medium_cluster
            .getClusters([west_lng, south_lat, east_lng, north_lat], zoom)
            .forEach(feature => {
              let point_count = feature.properties.point_count;
              if (point_count) {
                this.mode = "cluster";
                feature.properties.color = this.rateToColor(
                  point_count / 30,
                  40,
                  5
                );
                feature.properties.size =
                  15 + Math.min(point_count / 30, 1) * 10;
                feature.properties.point_opacity = 0;
              } else {
                this.mode = "points";
                feature.properties.point_opacity = 0.5;
              }
              SymptomCollection.mediumSymptomCollection.features.push(feature);
            });
        }
        if (high_cluster) {
          high_cluster
            .getClusters([west_lng, south_lat, east_lng, north_lat], zoom)
            .forEach(feature => {
              let point_count = feature.properties.point_count;
              if (point_count) {
                this.mode = "cluster";
                feature.properties.color = this.rateToColor(
                  point_count / 300,
                  35,
                  0
                );
                feature.properties.size =
                  20 + Math.min(point_count / 300, 1) * 15;
                feature.properties.point_opacity = 0;
              } else {
                this.mode = "points";
                feature.properties.point_opacity = 0.5;
              }
              SymptomCollection.highSymptomCollection.features.push(feature);
            });
        }
      }
      return SymptomCollection;
    },

    loaded(map) {
      this.map = map;
      let res = this.symptomCollections;

      map.addSource("small", {
        type: "geojson",
        data: res.smallSymptomCollection
      });
      map.addLayer(this.makeDataPoint("small"));
      map.addLayer(this.makeDataClusters("small"));
      map.addLayer(this.makeDataCounts("small", "#757575"));
      map.on("click", "small-points", this.fetchSelectedItem);

      map.addSource("medium", {
        type: "geojson",
        data: res.mediumSymptomCollection
      });
      map.addLayer(this.makeDataPoint("medium"));
      map.addLayer(this.makeDataClusters("medium"));
      map.addLayer(this.makeDataCounts("medium", "#757575"));
      map.on("click", "medium-points", this.fetchSelectedItem);

      map.addSource("high", {
        type: "geojson",
        data: res.highSymptomCollection
      });
      map.addLayer(this.makeDataPoint("high"));
      map.addLayer(this.makeDataClusters("high"));
      map.addLayer(this.makeDataCounts("high", "#757575"));
      map.on("click", "high-points", this.fetchSelectedItem);

      map.addSource("grid", {
        type: "geojson",
        data: res.highSymptomCollection
      });
      map.addLayer(this.makeDataPoint("grid", false, ["get", "size"], 0.3));
      map.addLayer({
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
      });
      map.on("click", "grid-points", this.fetchSelectedItem);

      this.changed(map);
    },

    makeDataPoint(
      size,
      cluster = true,
      radius = 8,
      opacity = ["get", "point_opacity"]
    ) {
      return {
        id: size + "-points",
        type: "circle",
        paint: {
          "circle-radius": radius,
          "circle-opacity": opacity,
          "circle-color": ["get", "color"]
        },
        source: size,
        cluster: cluster,

        layout: {
          visibility: "visible"
        }
      };
    },

    makeDataClusters(size) {
      return {
        id: size + "-clusters",
        type: "circle",
        source: size,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": ["get", "color"],
          "circle-radius": ["get", "size"],
          "circle-opacity": 0.3
        },
        layout: {
          visibility: "visible"
        }
      };
    },

    makeDataCounts(size, color) {
      return {
        id: size + "-cluster-count",
        type: "symbol",
        source: size,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Ubuntu Medium", "Arial Unicode MS Regular"],
          "text-size": 12,
          visibility: "visible"
        },
        paint: {
          "text-color": color
        }
      };
    },

    setVisibility(items, value = true) {
      items.forEach(item => {
        this.map.setLayoutProperty(item, "visibility", value);
      });
    },

    updateMap() {
      if (this.grid_rendering) {
        this.map
          .getSource("grid")
          .setData(this.symptomCollections.highSymptomCollection);
        this.setVisibility(this.layers.non_grid, "none");
        this.setVisibility(this.layers.grid, "visible");
      } else {
        ["small", "medium", "high"].forEach(item => {
          this.map
            .getSource(item)
            .setData(this.symptomCollections[item + "SymptomCollection"]);
        });
        this.setVisibility(this.layers.grid, "none");
        this.setVisibility(this.layers.non_grid, "visible");
      }

      if (this.mode === "cluster") {
        this.setVisibility(
          ["small-points", "medium-points", "high-points"],
          "none"
        );
      }
    },

    changed(map) {
      const bounds = map.getBounds();
      this.top_left_bound = [bounds._sw.lng, bounds._ne.lat];
      this.top_right_bound = [bounds._ne.lng, bounds._ne.lat];
      this.bottom_left_bound = [bounds._sw.lng, bounds._sw.lat];
      this.bottom_right_bound = [bounds._ne.lng, bounds._sw.lat];

      this.fetchLocationsSymptoms();
    }
  }
};
</script>

<style>
#map {
  width: 100%;
  height: 100% !important;
}
</style>

<style>
@import url("https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css");
</style>
