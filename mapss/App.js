import React, {Component, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken('pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g');

const red_coordinates = [
  [-73.98330688476561, 40.76975180901395],
  [-73.96682739257812, 40.761560925502806],
  [-74.00751113891602, 40.746346606483826],
  [-73.95343780517578, 40.7849607714286],
  [-73.99017333984375, 40.71135347314246],
  [-73.95172119140624, 40.82731951134558],
  [-73.9829635620117, 40.769101775774935],
  [-73.9822769165039, 40.76273111352534],
  [-73.98571014404297, 40.748947591479705]
];

const orange_1_coordinates = [
  [-73.9733, 40.7624],
  [-73.9837, 40.7756],
  [-73.9423, 40.8060],
  [-73.9289, 40.8308],
  [-73.9212, 40.8354],
  [-73.91033, 40.82930]
];
const orange_2_coordinates = [
  [-73.90828, 40.83670],
  [-73.90779, 40.83630],
  [-73.90398, 40.83556],
  [-73.90621, 40.83819],
  [-73.92357, 40.83349],
  [-73.98880004882812, 40.758960433915284],
  [-73.96064758300781, 40.718379593199494],
];
const yellow_coordinates = [];

const ANNOTATION_SIZE = 10;

const small_flag_prob = 0.1667;
const medium_flag_prob = 0.25;
const big_flag_prob = 0.5;

const small_flag_syms = new Set(['fatigue', 'runny nose', 'sneezing', 'headaches', 'anosmia', 'conjunctivitis', 'diarrhoea']);
const medium_flag_syms = new Set(['myalgia', 'sore throat', 'medium-grade fever']);
const big_flag_syms = new Set('high-grade fever', 'persistent dry cough', 'difficulty breathing', 'pneumonia');

export default class App extends Component {
  
  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);
    fetch('http://34.70.173.73:3000/api/locations_symptoms', {
      method: 'GET',
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODY1Njk2OTF9.gIronZCVlONIQ2PmTQ6NhRJca9Rk-gv3clFyH6ViQxw",
        Accept: "application/json",
        "Content-type": "application/json",
      }
    })
    .then(res=>res.json())
    .then((data) => {
      console.log(data);
      this.setState({symptoms: data})
    })
    .catch((error) => {
      console.log(error);
    });
    console.log('logging');
    
  }
  constructor (props) {
    super(props);
  
    this.state = {
      red_coordinates: red_coordinates,
      orange_1_coordinates: orange_1_coordinates,
      orange_2_coordinates: orange_2_coordinates,
      symptoms: []
    };
  }

  renderRedAnnotation (coord, idx) {
    const id = `pointAnnotation${idx}`;
    
    return (
      <MapboxGL.PointAnnotation
        key={id}
        id={id}
        title='Test'
        coordinate={coord}>
        <View style={styles.annotationContainerRed}>
          <Image
            style={{width: ANNOTATION_SIZE, height: ANNOTATION_SIZE}}
          />
        </View>
        
      </MapboxGL.PointAnnotation>
    );
  }

  renderOrangeAnnotation1 (coord, idx) {
    const id = `pointAnnotation${idx}`;
 
    return (
      <MapboxGL.PointAnnotation
        key={id}
        id={id}
        title='Test'
        coordinate={coord}>
        <View style={styles.annotationContainerYellow}>
          <Image
            style={{width: ANNOTATION_SIZE, height: ANNOTATION_SIZE}}
          />
        </View>
        
      </MapboxGL.PointAnnotation>
    );
  }

  renderOrangeAnnotation2 (coord, idx) {
    const id = `pointAnnotation${idx}`;
  
    return (
      <MapboxGL.PointAnnotation
        key={id}
        id={id}
        title='Test'
        coordinate={coord}>
        <View style={styles.annotationContainerOrange}>
          <Image
            style={{width: ANNOTATION_SIZE, height: ANNOTATION_SIZE}}
          />
        </View>
        
      </MapboxGL.PointAnnotation>
    );
  }

  returnProbability(symptoms) {
      let total_prob = 0.0;
      for (let i = 0; i < symptoms.length; i++) {
        console.log('log: ' + symptoms[i].name);
        if (big_flag_syms.has(symptoms[i].name.toLowerCase())) {
          total_prob += big_flag_prob;
        }
        else if (medium_flag_syms.has(symptoms[i].name.toLowerCase())) {
          total_prob += medium_flag_prob;
        }
        else {
          total_prob += small_flag_prob;
        }
      }
      return total_prob;
  }

  renderSymptoms() {
    const items = [];
    for (let i = 0; i < this.state.symptoms.length; i++) {
      let total_prob = this.returnProbability(this.state.symptoms[i].symptoms);
      let coord = [parseFloat(this.state.symptoms[i].longitude), Math.min(89, parseFloat(this.state.symptoms[i].latitude))];
      console.log(total_prob);
      console.log(coord);
      
      if (total_prob < 0.5) {
          items.push(this.renderOrangeAnnotation1(coord, i));
      }
      else if (total_prob < 0.8) {
          items.push(this.renderOrangeAnnotation2(coord, i));
      }
      else {
          items.push(this.renderRedAnnotation(coord, i));
      }
    }
    console.log(items.length);
    return items;
  } 

  render () {
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map}
            styleURL={MapboxGL.StyleURL.Light}
          >
            <MapboxGL.Camera
              zoomLevel={14}
              centerCoordinate={[-73.98330688476561, 40.76975180901395]}/>
              {this.renderSymptoms()}
          </MapboxGL.MapView>
        </View>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  annotationContainerOrange: {
    width: ANNOTATION_SIZE,
    height: ANNOTATION_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    borderRadius: ANNOTATION_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'red',
    overflow: 'hidden',
  },
  annotationContainerRed: {
    width: ANNOTATION_SIZE,
    height: ANNOTATION_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: ANNOTATION_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'red',
    overflow: 'hidden',
  },
  annotationContainerYellow: {
    width: ANNOTATION_SIZE,
    height: ANNOTATION_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
    borderRadius: ANNOTATION_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'yellow',
    overflow: 'hidden',
  },
  annotationFill: {
    width: ANNOTATION_SIZE - 3,
    height: ANNOTATION_SIZE - 3,
    borderRadius: (ANNOTATION_SIZE - 3) / 2,
    backgroundColor: 'orange',
    transform: [{scale: 0.6}],
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  container: {
    height: 900,
    width: 900,
    backgroundColor: "tomato"
  },
  map: {
    flex: 1
  }
});