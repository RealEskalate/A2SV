<template>
  <div id="app">
    <mapbox
      access-token="pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g"
      :map-options="{
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [38.811684, 9.015326],
        zoom: 12
      }"
      :geolocate-control="{
        show: true,
        position: 'bottom-right'
      }"
      @map-load="loaded"
    />
  </div>
</template>

<script>
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
  methods: {
    symptomsToGeoJson(symptoms) {
      console.log("symptoms to GeoJson " + symptoms.length);
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
      console.log("Grids to GeoJson");
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

    async updateClusters() {
      console.log("inside update--", this);

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
        const bounds = await this.map.getBounds();
        const west_lng = bounds._sw.lng,
          south_lat = bounds._sw.lat;
        const east_lng = bounds._ne.lng,
          north_lat = bounds._ne.lat;

        const zoom = Math.round(await this.map.getZoom());

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
          console.log("High cluster");
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
      console.log("returning from update clusters: ");
      console.log(SymptomCollection.highSymptomCollection.features);
      return SymptomCollection;
    },
    async fetchSymptoms() {
      const res = await fetch(
        "https://sym-track.herokuapp.com/api/locations_symptoms?demo=true",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI0MS01MCIsIl9pZCI6IjVlYmFkZTdlZGRhMzk3MDAxNzcwNDI0ZCIsInVzZXJuYW1lIjoid2VybyIsInBhc3N3b3JkIjoiJDJhJDEwJERhbHVPZjNNaHhOVE1ZaTZrci9WdmVyR0xJR0pFM3l3N2ZOc3RGN3F1RjY4UDU5UnBtWVJPIiwiX192IjowLCJjdXJyZW50X2NvdW50cnkiOiJVbml0ZWQgU3RhdGVzIn0sImlhdCI6MTU4OTMwNDk3M30.oYX_IVUUu5yMObci5W5P6iFlqah-M4LMd30niQ31kM4",
            Accept: "application/json",
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            longitude: this.user_longitude,
            latitude: this.user_latitude,

            top_left_bound: this.top_left_bound,
            top_right_bound: this.top_right_bound,
            bottom_left_bound: this.bottom_left_bound,
            bottom_right_bound: this.bottom_right_bound
          })
        }
      );

      if ((await res.status) === 500) {
        // animating = false;
        console.log("No locations with users and symptoms found.");
        console.log(this.user_longitude + " , " + this.user_latitude);
        console.log(this.top_left_bound);
        console.log(this.top_right_bound);
        console.log(this.bottom_left_bound);
        console.log(this.bottom_right_bound);
        return;
      } else {
        const data = await res.json();
        console.log("Data loaded!!!!!!!!");
        if (data.length > 0 && data[0].probability === undefined) {
          // we're getting grid results
          // just log them for now
          console.log("-----------if---------");
          console.log(data);
          const gridCollections = this.gridsToGeoJson(data);
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
          console.log("small cluster = " + this.small_cluster);
          // this.grid_rendering = true;
          // if (animating === true) {
          //   animating = false;
          // }
          this.symptomCollections = await this.updateClusters();
          console.log("got result from update clusters");
          return this.symptomCollections;
        } else {
          console.log("-----------else-------");

          const featureCollections = this.symptomsToGeoJson(data);

          const small_cluster = new Supercluster({ radius: 40, maxZoom: 14 });
          const medium_cluster = new Supercluster({ radius: 40, maxZoom: 14 });
          const high_cluster = new Supercluster({ radius: 40, maxZoom: 14 });

          small_cluster.load(
            featureCollections.smallSymptomCollection.features
          );
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
          this.symptomCollections = await this.updateClusters();
          return this.symptomCollections;
        }
      }
    },
    async loaded(map) {
      console.log("LOADED!");
      if (this.map === undefined) {
        console.log("saving map");
        this.map = map; // save the map for use by other components
      }
      const bounds = await this.map.getBounds();
      console.log(bounds);
      const west_lng = bounds._sw.lng,
        south_lat = bounds._sw.lat;
      const east_lng = bounds._ne.lng,
        north_lat = bounds._ne.lat;

      this.top_left_bound = [west_lng, north_lat];
      this.top_right_bound = [east_lng, north_lat];
      this.bottom_left_bound = [west_lng, south_lat];
      this.bottom_right_bound = [east_lng, south_lat];

      var res = await this.fetchSymptoms();

      console.log(await res);
      console.log("Logging symptomCollections");
      console.log(await res.highSymptomCollection.features);
      if ((await res.smallSymptomCollection.features.length) !== 0) {
        map.addLayer({
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

      if ((await res.highSymptomCollection.features.length) !== 0) {
        console.log("adding layer!");
        map.addLayer({
          id: "points",
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
            "circle-stroke-width": 5,
            "circle-stroke-color": "#3E2723",
            "circle-opacity": 0.6
          },
          source: {
            type: "geojson",
            data: res.highSymptomCollection
          }
        });
        var below_layer_id = "points";
        map.addLayer(
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
              "text-size": 20,
              "text-pitch-alignment": "map"
            },
            paint: {
              "text-color": "white"
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
#map {
  width: 100%;
  height: 500px;
}
</style>
