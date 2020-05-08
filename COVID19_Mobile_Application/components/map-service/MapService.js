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
import fatigue from "../../assets/images/fever.png";
import fever from "../../assets/images/fever.png";
import headache from "../../assets/images/headache.png";
import muscle_pain from "../../assets/images/muscle-pain.png";
import runny_nose from "../../assets/images/runny-nose.png";
import shortness from "../../assets/images/shortness-of-breath.png";
import sneezing from "../../assets/images/sneezing.png";
import sore from "../../assets/images/sore-throat.png";

import manAvatar from "../../assets/images/avatar.png";
import womanAvatar from "../../assets/images/person.png";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g"
);
console.disableYellowBox = true;

const screenWidth = Dimensions.get("window").width;
const colors = ["#c62828", "#ef6c00", "#ffb300"];

const small_flag_prob = 0.1667;
const medium_flag_prob = 0.25;
const big_flag_prob = 0.5;

const small_flag_syms = new Set([
  "fatigue",
  "runny nose",
  "sneezing",
  "headaches",
  "anosmia",
  "conjunctivitis",
  "diarrhoea",
]);
const medium_flag_syms = new Set([
  "myalgia",
  "sore throat",
  "medium-grade fever",
]);
const big_flag_syms = new Set(
  "high-grade fever",
  "persistent dry cough",
  "repeated shaking with chills",
  "difficulty breathing",
  "pneumonia"
);

const pointInfos = {};
let currentPointInfo = null;

export default class MapService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      symptoms: [],
      bounds: {
        ne: [],
        sw: [],
      },
      user_latitude: 0.0,
      user_longitude: 0.0,
      location: [0, 0],
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
    this.onFinishRenderingMap = this.onFinishRenderingMap.bind(this);
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
    // console.log('You pressed a layer here is your feature', feature); // eslint-disable-line
  }

  onTrackingChange() {
    console.log("tracking changed!");
    this.setState({
      location: [this.state.user_longitude + 0.02, this.state.user_latitude],
    });
  }
  onUserLocationUpdate(location) {
    this.setState({
      user_latitude: location.coords.latitude,
      user_longitude: location.coords.longitude,
    });
    console.log(this.state.user_latitude + " , " + this.state.user_longitude);
  }

  onFinishRenderingMap() {
    this.setState({
      location: [this.state.user_longitude + 0.02, this.state.user_latitude],
    });
    this.state.bounds.ne = [
      this.state.location[0] + 0.3,
      this.state.location[1] - 0.3,
    ];
    this.state.bounds.sw = [
      this.state.location[0] - 0.3,
      this.state.location[1] + 0.3,
    ];
    console.log(this.state.bounds.ne + " ,, " + this.state.bounds.sw);
  }

  FloatingButtonEvent = () => {
    this.onTrackingChange();
  };

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
    this.timer = setInterval(
      () =>
        fetch("http://sym-track.herokuapp.com/api/locations_symptoms", {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODY1Njk2OTF9.gIronZCVlONIQ2PmTQ6NhRJca9Rk-gv3clFyH6ViQxw",
            Accept: "application/json",
            "Content-type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Symptoms fetched");
            this.setState({ symptoms: data });
            const featureCollections = this.symptomsToGeoJson(
              this.state.symptoms
            );
            this.setState({ symptomCollections: featureCollections });
          })
          .catch((error) => {
            console.log(error);
          }),
      15000
    );
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
      if (prob < 0.4) {
        symptomCollections.smallSymptomCollection.features.push(feat);
      } else if (prob < 0.6) {
        symptomCollections.mediumSymptomCollection.features.push(feat);
      } else {
        symptomCollections.highSymptomCollection.features.push(feat);
      }
      pointInfos[`index-${index}`] = element;
    }
    return symptomCollections;
  }

  calculateProbability(symptoms) {
    let total_prob = 0.0;
    for (let i = 0; i < symptoms.length; i++) {
      if (big_flag_syms.has(symptoms[i].name.toLowerCase())) {
        total_prob += big_flag_prob;
      } else if (medium_flag_syms.has(symptoms[i].name.toLowerCase())) {
        total_prob += medium_flag_prob;
      } else {
        total_prob += small_flag_prob;
      }
    }
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
      } else {
        images.push(cough);
      }
      console.log("logging symptom details");
      console.log(data);
      for (let j = 0; j < images.length; j++) {
        console.log(images[j]);
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
                    <Text style={styles.tagData}>ETHIOPIA</Text>
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
            onDidFinishLoadingMap={this.onFinishRenderingMap}
            compassViewPosition={1}
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
    circleColor: "yellow",
    circleOpacity: 0.84,
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
      "yellow",
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
    circleColor: "orange",
    circleOpacity: 0.84,
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
      "orange",
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

const highStyles = {
  singlePoint: {
    circleColor: "red",
    circleOpacity: 0.84,
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
      "red",
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
