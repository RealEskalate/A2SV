import { PermissionsAndroid } from "react-native";
import React from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";
import {
  Button,
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import {
  Platform,
  TouchableOpacity,
  Alert,
  Text,
  Modal,
  TouchableHighlight,
} from "react-native";

import { Avatar } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import anosmia from "../../assets/images/anosmia.png";
import cough from "../../assets/images/cough.png";
import diarrhea from "../../assets/images/diarrhea.png";
import fatigue from "../../assets/images/fatigue.png";
import fever from "../../assets/images/fever.png";
import headache from "../../assets/images/headache.png";
import muscle_pain from "../../assets/images/muscle-pain.png";
import runny_nose from "../../assets/images/runny-nose.png";
import shortness from "../../assets/images/shortness-of-breath.png";
import sneezing from "../../assets/images/sneezing.png";
import sore from "../../assets/images/sore-throat.png";
import chills from "../../assets/images/chills.jpg";
import pneumonia from "../../assets/images/pneumonia.png";

import manAvatar from "../../assets/images/avatar.png";
import womanAvatar from "../../assets/images/person.png";
import Geocoder from "react-native-geocoder";
import userIDStore from "../data-management/user-id-data/userIDStore";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g"
);
console.disableYellowBox = true;

const screenWidth = Dimensions.get("window").width;
const colors = ["#FFC107", "#EF6C00", "#B71C1C"];

const covid = require("../public-data-page/data/covid.json");

const syms = new Set([
  "fatigue",
  "runny nose",
  "sneezing",
  "headaches",
  "anosmia",
  "conjunctivitis",
  "diarrhoea",
  "myalgia",
  "sore throat",
  "medium-grade fever",
  "high-grade fever",
  "persistent dry cough",
  "repeated shaking with chills",
  "difficulty breathing",
  "pneumonia",
]);

// prevalence of kth symptom in corona cases
const Ak = {
  cough: 0.861,
  fever: 0.85,
  "difficulty breathing": 0.8,
  myalgia: 0.344,
  diarrhoea: 0.267,
  "sore throat": 0.178,
  headaches: 0.161,
  "runny nose": 0.161,
  "chest pain": 0.15,
  "abdominal pain": 0.083,
  wheezing: 0.067,
  nausea: 0.244, // everything below needs a proxy
  fatigue: 0.65,
  sneezing: 0.34,
  conjunctivitis: 0.12,
  chills: 0.44,
  pneumonia: 0.53,
  anosmia: 0.12,
};

const Sk = {
  fatigue: 0.355,
  headaches: 0.354,
  "runny nose": 0.344,
  cough: 0.283,
  myalgia: 0.231,
  "difficulty breathing": 0.132,
  diarrhoea: 0.067,
  fever: 0.07,
  "abdominal pain": 0.117, // everything below needs a proxy
  anosmia: 0.04,
  "sore throat": 0.2,
  "chest pain": 0.1,
  wheezing: 0.04,
  nausea: 0.34,
  sneezing: 0.66,
  conjunctivitis: 0.15,
  chills: 0.52,
  pneumonia: 0.12,
};

const pointInfos = {};
let currentPointInfo = null;

export default class MapService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      symptoms: [],

      user_country: "",
      user_latitude: 0.0,
      user_longitude: 0.0,
      location: [0, 0],

      countries: {},
      test_counts: {},

      featureCollection: {
        type: "FeatureCollection",
        features: [],
      },
      symptomCollections: {
        smallSymptomCollection: {
          type: "FeatureCollection",
          features: [],
        },
        mediumSymptomCollection: {
          type: "FeatureCollection",
          features: [],
        },
        highSymptomCollection: {
          type: "FeatureCollection",
          features: [],
        },
      },
    };
    this.onTrackingChange = this.onTrackingChange.bind(this);
    this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);
    this.onSourceLayerPress = this.onSourceLayerPress.bind(this);
    this.onFinishedLoadingMap = this.onFinishedLoadingMap.bind(this);
  }

  setModalVisible(visible) {
    this.setState({ isModalVisible: visible });
  }

  onSourceLayerPress(e) {
    const feature = e.nativeEvent.payload;
    if (feature.properties.cluster) {
    } else {
      const pointInfo = pointInfos[feature.id];
      currentPointInfo = pointInfo;
      this.setModalVisible(true);
    }
    // console.log('You pressed a layer here is your feature', feature); // eslint-disable-lin
  }

  async onFinishedLoadingMap() {
    console.log(
      "LOCATION: " + this.state.user_longitude + " , " + this.state.user
    );
    this.setState({
      location: [this.state.user_longitude + 0.02, this.state.user_latitude],
    });

    var loc = { lat: this.state.user_latitude, lng: this.state.user_longitude };
    try {
      const res = await Geocoder.geocodePosition(loc);
      this.setState({ user_country: res[0].country });
    } catch (err) {
      console.log(err);
    }
    console.log(this.state.user_country);
  }
  onTrackingChange() {
    console.log("tracking changed!");
    this.setState({
      location: [this.state.user_longitude + 0.02, this.state.user_latitude],
    });
    console.log(this.state.user_longitude + " , " + this.state.user_latitude);
  }
  onUserLocationUpdate(location) {
    this.setState({
      user_latitude: location.coords.latitude,
      user_longitude: location.coords.longitude,
    });
    console.log(this.state.user_latitude + " , " + this.state.user_longitude);
  }

  FloatingButtonEvent = () => {
    this.onTrackingChange();
  };

  fetchTestCounts() {
    console.log("Fetching countries);");
    fetch("https://sym-track.herokuapp.com/api/statistics/countries", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const countries = data;
        // console.log("countries fetched with size = " + countries.length);
        // console.log("Fetching test counts");
        const test_counts = {};
        for (let i = 0; i < countries.length; i++) {
          const slug = countries[i].slug;
          console.log("slug = " + slug);
          const country = countries[i].name;
          fetch(
            "https://sym-track.herokuapp.com/api/statistics?criteria=Tests&country=" +
              slug,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-type": "application/json",
              },
            }
          )
            .then((res) => res.json())
            .then((data) => {
              // store only the last value
              const latest_tests = data[data.length - 1].y;
              test_counts[country] = latest_tests;
            });
        }
        this.setState({ test_counts: test_counts });
      });
  }
  fetchSymptoms() {
    console.log(
      "Fetching symptoms token : " +
        this.state.user_longitude +
        "," +
        this.state.user_latitude
    );
    fetch("http://sym-track.herokuapp.com/api/locations_symptoms", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        longitude: this.state.user_longitude,
        latitude: this.state.user_latitude,
      }),
    })
      .then((res) => {
        if (res.status === 500) {
          console.log("No locations with users and symptoms found.");
          return;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log("Data successfully" + data);
        this.setState({ symptoms: data });
        const featureCollections = this.symptomsToGeoJson(this.state.symptoms);
        this.setState({ symptomCollections: featureCollections });
      })
      .catch((error) => {
        console.log("Error in symptom fetching");
        console.log(error);
      });
  }
  componentDidMount() {
    PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ],
      {
        title: "Give Location Permission",
        message: "App needs location permission to find your position.",
      }
    )
      .then((granted) => {
        console.log(granted);
        //resolve();
      })
      .catch((err) => {
        console.warn(err);
        reject(err);
      });
    MapboxGL.setTelemetryEnabled(false);
    console.log("-----------------------");
    this.fetchTestCounts();
    this.fetchSymptoms();

    this.timer = setInterval(() => this.fetchSymptoms(), 15000);
  }

  getListOfSymptoms = (data, images) => {
    return (
      <View style={{ marginTop: 10 }}>
        <FlatList
          data={data}
          horizontal={false}
          numColumns={3}
          renderItem={({ item, index }) => (
            <View style={{ alignItems: "center", margin: 10 }}>
              <Image style={{ width: 60, height: 60 }} source={images[index]} />
              <Text style={{ fontSize: 10 }}>{item.name}</Text>
            </View>
          )}
        />
      </View>
    );
  };

  symptomsToGeoJson(symptoms) {
    console.log("symptoms to GeoJson");
    const symptomCollections = {
      smallSymptomCollection: {
        type: "FeatureCollection",
        features: [],
      },
      mediumSymptomCollection: {
        type: "FeatureCollection",
        features: [],
      },
      highSymptomCollection: {
        type: "FeatureCollection",
        features: [],
      },
    };
    for (let index = 0; index < symptoms.length; index++) {
      let element = symptoms[index];
      if (
        element.longitude == this.state.user_longitude &&
        element.latitude == this.state.user_latitude
      ) {
        continue;
      }
      var age_group = "";
      if (
        element.age_group.search("ABOVE") != -1 ||
        element.age_group.search("UNDER") != -1
      ) {
        var idx = element.age_group.search("_");
        age_group =
          element.age_group.substring(0, idx) +
          " " +
          element.age_group.substring(idx + 1);
      } else {
        var first_idx = element.age_group.search("_");
        age_group = element.age_group.substring(0, first_idx);
        age_group += " - " + element.age_group.substring(first_idx + 4);
      }
      const feat = {
        type: "Feature",
        id: `index-${index}`,
        properties: {
          icon: "pin3",
        },
        geometry: {
          type: "Point",
          coordinates: [element.longitude, element.latitude],
        },
      };
      const prob = this.calculateProbability(element.symptoms);
      if (prob < 0.2) {
        console.log("Pushing to small");
        symptomCollections.smallSymptomCollection.features.push(feat);
      } else if (prob < 0.4) {
        console.log("pushing to medium");
        symptomCollections.mediumSymptomCollection.features.push(feat);
      } else {
        console.log("pushing to large");
        symptomCollections.highSymptomCollection.features.push(feat);
      }
      pointInfos[`index-${index}`] = element;
    }
    return symptomCollections;
  }

  calculateProbability(symptoms) {
    let total_prob = 1.0;
    let dates = Object.keys(covid[this.state.user_country]);
    dates = dates.slice(4, dates.length);
    const lastDate = dates[dates.length - 1];
    const confirmed = parseFloat(covid[this.state.user_country][lastDate]); // confirmed cases for this country
    const prevalence =
      confirmed / this.state.test_counts[this.state.user_country];

    console.log("prevalence = " + prevalence);

    for (let i = 0; i < symptoms.length; i++) {
      var symptom = symptoms[i].name.toLowerCase();
      if (symptom == "persistent dry cough") {
        symptom = "cough";
      } else if (
        symptom == "high-grade fever" ||
        symptom == "medium-grade fever"
      ) {
        symptom = "fever";
      } else if (symptom == "repeated shaking with chills") {
        symptom = "chills";
      }
      const prob = 1 - (prevalence * Ak[symptom]) / Sk[symptom];
      total_prob *= prob;
    }
    total_prob = 1.0 - total_prob;
    console.log("total probability = " + total_prob);
    return total_prob;
  }

  renderPointInfo(info) {
    // populate data and image arrays

    if (info == null) return;
    console.log("Symptoms are: ");
    console.log(info.symptoms);
    const data = [];
    const images = [];
    for (let i = 0; i < info.symptoms.length; i++) {
      var name = info.symptoms[i].name;
      var sym = { id: (i + 1).toString(), name: name };
      data.push(sym);
      name = name.toLowerCase();
      if (name == "anosmia") {
        images.push(anosmia);
      } else if (name == "persistent dry cough") {
        images[i] = cough;
      } else if (name == "diarrhoea") {
        images[i] = diarrhea;
      } else if (name == "fatigue") {
        images[i] = fatigue;
      } else if (name == "high-grade fever" || name == "medium-grade fever") {
        images.push(fever);
      } else if (name == "headaches") {
        images.push(headache);
      } else if (name == "myalgia") {
        images.push(muscle_pain);
      } else if (name == "runny nose") {
        images.push(runny_nose);
      } else if (name == "difficulty breathing") {
        images.push(shortness);
      } else if (name == "sneezing") {
        images.push(sneezing);
      } else if (name == "sore throat") {
        images.push(sore);
      } else if (name == "repeated shaking with chills") {
        images.push(chills);
      } else if (name == "pneumonia") {
        images.push(pneumonia);
      } else {
        images.push(cough);
      }
    }
    if (info == null) {
      return (
        <View style={styles.modalView}>
          <Text style={styles.modalText}></Text>

          <TouchableHighlight
            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
            onPress={() => {
              this.setModalVisible(!isModalVisible);
            }}
          >
            <Text style={styles.textStyle}>Hide Modal</Text>
          </TouchableHighlight>
        </View>
      );
    } else {
      return (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarRow}>
                <Avatar.Image
                  source={
                    info.gender.toLowerCase() == "male"
                      ? manAvatar
                      : womanAvatar
                  }
                  size={80}
                  style={styles.avatar}
                />
                <View style={styles.userInfo}>
                  <View style={styles.useData}>
                    <View style={styles.tag}>
                      <Text style={styles.tagContent}>AGE</Text>
                    </View>
                    <Text style={styles.tagData}>{info.age_group}</Text>
                  </View>
                  <View style={styles.useData}>
                    <View style={styles.tag}>
                      <Text style={styles.tagContent}>GEO</Text>
                    </View>
                    <Text style={styles.tagData}>
                      {this.state.user_country}{" "}
                    </Text>
                  </View>
                  <View style={styles.userDegree}>
                    <FontAwesome
                      name="exclamation-triangle"
                      color={colors[0]}
                      size={25}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.separator}></View>
            </View>
            <View style={styles.symptomContainer}>
              <View>
                <Text>SYMPTOMS</Text>
              </View>
              <View>{this.getListOfSymptoms(data, images)}</View>
            </View>
            <View style={styles.closeModalContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isModalVisible: false });
                }}
                style={styles.closeModal}
                activeOpacity={0.9}
              >
                <Text style={styles.closeModalText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  }

  renderSymptomLayer(id, featureCollection, style) {
    console.log("feature collection = " + featureCollection.features);
    return (
      <MapboxGL.ShapeSource
        key={id}
        id={id}
        cluster
        clusterRadius={50}
        clusterMaxZoom={14}
        onPress={this.onSourceLayerPress}
        shape={featureCollection}
      >
        <MapboxGL.SymbolLayer
          id={id + " pointCount"}
          style={style.clusterCount}
        />

        <MapboxGL.CircleLayer
          id={id + " clusteredPoints"}
          belowLayerID={id + " pointCount"}
          filter={["has", "point_count"]}
          style={style.clusteredPoints}
        />

        <MapboxGL.CircleLayer
          id={id + " singlePoint"}
          filter={["!", ["has", "point_count"]]}
          style={style.singlePoint}
        ></MapboxGL.CircleLayer>
      </MapboxGL.ShapeSource>
    );
  }

  render() {
    const { isModalVisible } = this.state;
    return (
      <View style={[styles.centeredView]}>
        <Modal visible={isModalVisible} animationType="fade" transparent={true}>
          {this.renderPointInfo(currentPointInfo)}
        </Modal>
        <View style={styles.container}>
          <MapboxGL.MapView
            style={smallStyles.matchParent}
            styleURL={MapboxGL.StyleURL.Light}
            compassEnabled
            compassViewPosition={1}
            onDidFinishLoadingMap={this.onFinishedLoadingMap}
          >
            <MapboxGL.UserLocation
              visible={true}
              showsUserHeadingIndicator={true}
              onUpdate={this.onUserLocationUpdate}
            />
            <MapboxGL.Camera
              zoomLevel={13}
              pitch={45}
              centerCoordinate={this.state.location}
            />
            {this.renderSymptomLayer(
              "small",
              this.state.symptomCollections.smallSymptomCollection,
              smallStyles
            )}
            {this.renderSymptomLayer(
              "medium",
              this.state.symptomCollections.mediumSymptomCollection,
              mediumStyles
            )}
            {this.renderSymptomLayer(
              "high",
              this.state.symptomCollections.highSymptomCollection,
              highStyles
            )}
          </MapboxGL.MapView>
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.FloatingButtonEvent}
          style={styles.TouchableOpacityStyle}
        >
          <Image
            source={require("../../assets/images/locate.jpg")}
            style={styles.FloatingButtonStyle}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    // marginTop: 22,
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: screenWidth - 40,
    height: 400,
    borderRadius: 10,
  },
  avatarContainer: {
    flex: 1,
    padding: 20,
  },
  avatarRow: { flexDirection: "row" },
  avatar: { backgroundColor: "#2196f3" },
  userInfo: { flex: 1 },
  useData: { flexDirection: "row", marginLeft: 15, padding: 5 },
  tag: {
    backgroundColor: "#2196f3",
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 2,
    paddingBottom: 2,
  },
  tagContent: { color: "white", fontSize: 10 },
  tagData: { marginLeft: 10, fontSize: 10 },
  userDegree: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  separator: {
    height: 1,
    backgroundColor: colors[0],
    marginTop: 5,
  },
  symptomContainer: {
    flex: 3,
    alignItems: "center",
    padding: 10,
    paddingTop: 20,
  },
  closeModalContainer: { flex: 1, justifyContent: "flex-end" },
  closeModal: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196f3",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  closeModalText: { color: "#fff" },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  TouchableOpacityStyle: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
  },
  FloatingButtonStyle: {
    resizeMode: "contain",
    width: 50,
    height: 50,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  container: {
    height: 900,
    width: 900,
    backgroundColor: "tomato",
  },
  map: {
    flex: 1,
  },
});
const smallStyles = {
  singlePoint: {
    circleColor: "#FFC107",
    circleStrokeWidth: 2,
    circleStrokeColor: "white",
    circleRadius: 5,
    circlePitchAlignment: "map",
  },
  matchParent: {
    flex: 1,
  },
  clusteredPoints: {
    circlePitchAlignment: "map",
    circleColor: [
      "step",
      ["get", "point_count"],
      "#FFC107",
      100,
      "#f1f075",
      750,
      "#f28cb1",
    ],

    circleRadius: ["step", ["get", "point_count"], 20, 100, 30, 750, 40],

    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: "white",
  },

  clusterCount: {
    textField: "{point_count}",
    textSize: 12,
    textPitchAlignment: "map",
  },
};

const mediumStyles = {
  singlePoint: {
    circleColor: "#EF6C00",
    circleStrokeWidth: 2,
    circleStrokeColor: "white",
    circleRadius: 6,
    circlePitchAlignment: "map",
  },
  matchParent: {
    flex: 1,
  },
  clusteredPoints: {
    circlePitchAlignment: "map",
    circleColor: [
      "step",
      ["get", "point_count"],
      "#EF6C00",
      100,
      "#f1f075",
      750,
      "#f28cb1",
    ],

    circleRadius: ["step", ["get", "point_count"], 20, 100, 30, 750, 40],

    circleStrokeWidth: 2,
    circleStrokeColor: "white",
  },

  clusterCount: {
    textField: "{point_count}",
    textSize: 12,
    textPitchAlignment: "map",
  },
};

const highStyles = {
  singlePoint: {
    circleColor: "#B71C1C",
    circleStrokeWidth: 2,
    circleStrokeColor: "white",
    circleRadius: 8,
    circlePitchAlignment: "map",
  },
  matchParent: {
    flex: 1,
  },
  clusteredPoints: {
    circlePitchAlignment: "map",
    circleColor: [
      "step",
      ["get", "point_count"],
      "#B71C1C",
      100,
      "#f1f075",
      750,
      "#f28cb1",
    ],

    circleRadius: ["step", ["get", "point_count"], 20, 100, 30, 750, 40],

    circleStrokeWidth: 2,
    circleStrokeColor: "white",
  },

  clusterCount: {
    textField: "{point_count}",
    textSize: 12,
    textPitchAlignment: "map",
  },
};
