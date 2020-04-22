<template>
    <v-container>
        <map-gl-map
                container="map-test"
                :center.sync="center"
                :accessToken="accessToken"
                :mapStyle="mapStyle"
                zoom="2"
        >
            <map-gl-marker
                    :coordinates.sync="markerCoordinates"
                    color='green'
            ></map-gl-marker>
            <map-gl-json-layer
                    type="heatmap"
                    :sourceId="sourceId"
                    layerId="earthquakes-heat"
                    :source="earthquakeSource"
                    :layer="geoJsonLayer"
            ></map-gl-json-layer>
            <map-gl-json-layer
                    type="circle"
                    :sourceId="sourceId"
                    layerId="earthquakes-point"
                    :source="earthquakeSource"
                    :layer="earthQuake"
            ></map-gl-json-layer>
        </map-gl-map>
    </v-container>
</template>

<script>
    import {
        MglMap,
        MglMarker,
        MglGeojsonLayer
    } from 'vue-mapbox'

    export default {
        name: 'App',
        data() {
            return {
                accessToken: process.env.VUE_APP_MAPBOX_API,
                mapStyle: 'mapbox://styles/mapbox/dark-v10',
                geojson: { /* … some geojson */},
                layerId: 'firstLayer',
                sourceId: 'earthquakes',
                markerCoordinates: '[50, 50]',
                earthquakeSource: {
                    'type': 'geojson',
                    'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
                },
                geoJsonLayer:
                    {
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
        components: {
            'map-gl-map': MglMap,
            'map-gl-marker': MglMarker,
            'map-gl-json-layer': MglGeojsonLayer
        }
    }
</script>