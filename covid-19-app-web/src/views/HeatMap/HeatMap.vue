<template>
    <div id="app" class="mx-auto">
        <v-select :items="countryCode" item-text="country_name" item-value="alpha_3" multiple clearable
                  v-model="select" @input="filterCountry">
        </v-select>
        <mapbox :access-token="mapToken" :map-options="mapOptions" @map-load="loaded"
                @map-init="mapInitialize"/>
    </div>
</template>

<script>
  import Mapbox from 'mapbox-gl-vue'
  import * as axios from "axios";

  export default {
    components: {Mapbox},
    data() {
      return {
        countryCode: null,
        select: ["ETH", "USA"],
        map: null,
        mapOptions: {
          style: 'mapbox://styles/mapbox/dark-v10',
          zoom: 2,
        },
        geoJsonLayer: {
          'id': 'earthquakes-heat',
          'type': 'heatmap',
          'source': 'earthquakes',
          'maxzoom': 9,
          'label': 'waterway-label',
          'paint': {
// Increase the heatmap weight based on frequency and property magnitude
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              0,
              0,
              6,
              1
            ],
// Increase the heatmap color weight weight by zoom level
// heatmap-intensity is a multiplier on top of heatmap-weight
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              1,
              9,
              3
            ],
// Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
// Begin color ramp at 0-stop with a 0-transparancy color
// to create a blur-like effect.
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(33,102,172,0)',
              0.2,
              'rgb(103,169,207)',
              0.4,
              'rgb(209,229,240)',
              0.6,
              'rgb(253,219,199)',
              0.8,
              'rgb(239,138,98)',
              1,
              'rgb(178,24,43)'
            ],
// Adjust the heatmap radius by zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              2,
              9,
              20
            ],
// Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              1,
              9,
              0
            ]
          }
        },
        earthQuake: {
          'id': 'earthquakes-point',
          'type': 'circle',
          'source': 'earthquakes',
          'minzoom': 7,
          'label': 'waterway-label',
          'paint': {
// Size circle radius by earthquake magnitude and zoom level
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
              16,
              ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
            ],
// Color circle by earthquake magnitude
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              1,
              'rgba(33,102,172,0)',
              2,
              'rgb(103,169,207)',
              3,
              'rgb(209,229,240)',
              4,
              'rgb(253,219,199)',
              5,
              'rgb(239,138,98)',
              6,
              'rgb(178,24,43)'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
// Transition from heatmap to circle layer by zoom level
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              0,
              8,
              1
            ]
          }
        },
      }
    },
    methods: {

      loaded(map) {
        map.addSource('earthquakes', {
          'type': 'geojson',
          'data':
              'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
        });
        map.addLayer({ //here we are adding a layer containing the tileset we just uploaded
          'id': 'countries',//this is the name of our layer, which we will need later
          'source': {
            'type': 'vector',
            'url': 'mapbox://byfrost-articles.74qv0xp0' // <--- Add the Map ID you copied here
          },
          'source-layer': 'ne_10m_admin_0_countries-76t9ly', // <--- Add the source layer name you copied here
          'type': 'fill',
          'paint': {
            'fill-color': '#1e136e', //this is the color you want your tileset to have (I used a nice purple color)
            'fill-outline-color': '#F2F2F2' //this helps us distinguish individual countries a bit better by giving them an outline
          }
        });
        map.addLayer(this.earthQuake);
        map.addLayer(this.geoJsonLayer);
        console.log(this.select);
        this.filterCountry();
      },
      mapInitialize(map) {
        this.map = map
      },
      filterCountry() {
        this.map.setFilter('countries', ['in', 'ADM0_A3_IS'].concat(this.select));
      }
    },
    computed: {
      mapToken() {
        return process.env.VUE_APP_MAPBOX_API;
      },
      selectedCountries() {
        return this.select;
      }

    },
    mounted() {
      axios.get('https://res.cloudinary.com/geotargetly/raw/upload/v1579830286/data/iso_3166_country_codes.json')
          .then(
              res => {
                this.countryCode = res.data;
                console.log(res.data);
              },
              error => {
                console.log(error);
              }
          )
    }
  }
</script>
<style scoped>
    #app {
        width: 80%;
    }

    #map {
        height: 350px;
    }

</style>
