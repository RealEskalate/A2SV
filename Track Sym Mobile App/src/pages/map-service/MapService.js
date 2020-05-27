import { PermissionsAndroid } from "react-native";
import React, { Fragment } from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";
import Supercluster from "supercluster";

import {
  Button,
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
  Modal,
  TouchableHighlight,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import { Avatar } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import anosmia from "../../../assets/images/anosmia.png";
import cough from "../../../assets/images/cough.png";
import diarrhea from "../../../assets/images/diarrhea.png";
import fatigue from "../../../assets/images/fatigue.png";
import fever from "../../../assets/images/fever.png";
import headache from "../../../assets/images/headache.png";
import muscle_pain from "../../../assets/images/muscle-pain.png";
import runny_nose from "../../../assets/images/runny-nose.png";
import shortness from "../../../assets/images/shortness-of-breath.png";
import sneezing from "../../../assets/images/sneezing.png";
import sore from "../../../assets/images/sore-throat.png";
import chills from "../../../assets/images/chills.jpg";
import pneumonia from "../../../assets/images/pneumonia.png";
import conjunctivitis from "../../../assets/images/conjunctivitis.jpg";
import locationAvatar from "../../../assets/images/Heat.jpg";

import manAvatar from "../../../assets/images/avatar.png";
import womanAvatar from "../../../assets/images/person.png";
import Geocoder from "react-native-geocoder";
import userIDStore from "../../data-management/user-id-data/userIDStore";

import SearchableDropdown from "react-native-searchable-dropdown";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g"
);
console.disableYellowBox = true;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const colors = ["#FFC107", "#EF6C00", "#B71C1C"];

const covid = require("../public-data-page/data/covid.json");

const pointInfos = {};
const grid_infos = {};

let currentPointInfo = null;

const zoom_level = null;

export default class MapService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      isClusterModalVisible: false,
      symptoms: [],

      user_country: "",
      user_latitude: 0.0,
      user_longitude: 0.0,
      location: [0, 0],

      top_left_bound: 0.0,
      top_right_bound: 0.0,
      bottom_left_bound: 0.0,
      bottom_right_bound: 0.0,

      countries: {},
      cities: {},
      city_names: [],
      selected_city: "",

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
      gridCollections: {
        smallGridCollection: {
          type: "FeatureCollection",
          features: [],
        },
        mediumGridCollection: {
          type: "FeatureCollection",
          features: [],
        },
        heavyGridCollection: {
          type: "FeatureCollection",
          features: [],
        },
      },
      cluster_data: {},
      grid_rendering: false,
    };
    this.onTrackingChange = this.onTrackingChange.bind(this);
    this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);
    this.onSourceLayerPress = this.onSourceLayerPress.bind(this);
    this.onFinishedLoadingMap = this.onFinishedLoadingMap.bind(this);
    this.onRegionDidChange = this.onRegionDidChange.bind(this);
    this.renderClusterInfo = this.renderClusterInfo.bind(this);
    this.metersToPixelsAtMaxZoom = this.metersToPixelsAtMaxZoom.bind(this);
  }

  setModalVisible(visible) {
    this.setState({ isModalVisible: visible });
  }

  onSourceLayerPress(e) {
    const feature = e.nativeEvent.payload;
    if (feature.properties.cluster) {
      const cluster_data = {
        country: this.state.user_country,
        male: 0,
        female: 0,
        fatigue: 0,
        "runny nose": 0,
        sneezing: 0,
        headaches: 0,
        anosmia: 0,
        conjunctivitis: 0,
        diarrhoea: 0,
        myalgia: 0,
        "sore throat": 0,
        "medium-grade fever": 0,
        "high-grade fever": 0,
        "persistent dry cough": 0,
        "difficulty breathing": 0,
        pneumonia: 0,
        chills: 0,
        "repeated shaking with chills": 0,
        "0-10": 0,
        "11-20": 0,
        "21-30": 0,
        "31-40": 0,
        "41-50": 0,
        "51-60": 0,
        "61-70": 0,
        "71-80": 0,
        "81-90": 0,
        "> 90": 0,
      };

      try {
        const leaves = this.state.small_cluster.getLeaves(
          feature.properties.cluster_id,
          Infinity
        );
        for (let i = 0; i < leaves.length; i++) {
          let leaf = leaves[i];
          fetch(
            "http://sym-track.herokuapp.com/api/symptomuser/user/" +
              leaf.id +
              "?demo=true",
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + userIDStore.getState().userToken,
                Accept: "application/json",
                "Content-type": "application/json",
              },
            }
          )
            .then((res) => res.json())
            .then((data) => {
              for (let i = 0; i < data.length; i++) {
                const symptom = data[i].Symptom.name;
                const age_group = data[i].age_group;
                const gender = data[i].gender;

                cluster_data[symptom.toLowerCase()]++;
                cluster_data[age_group]++;
                cluster_data[gender.toLowerCase()]++;
              }
            });
        }
        this.setState({
          cluster_data: cluster_data,
          isClusterModalVisible: true,
        });
        return;
      } catch (e) {
        console.log(e);
      }

      try {
        const leaves = this.state.medium_cluster.getLeaves(
          feature.properties.cluster_id,
          Infinity
        );
        for (let i = 0; i < leaves.length; i++) {
          let leaf = leaves[i];
          fetch(
            "http://sym-track.herokuapp.com/api/symptomuser/user/" +
              leaf.id +
              "?demo=true",
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + userIDStore.getState().userToken,
                Accept: "application/json",
                "Content-type": "application/json",
              },
            }
          )
            .then((res) => res.json())
            .then((data) => {
              for (let i = 0; i < data.length; i++) {
                const symptom = data[i].Symptom.name;
                const age_group = data[i].age_group;
                const gender = data[i].gender;

                cluster_data[symptom.toLowerCase()]++;
                cluster_data[age_group]++;
                cluster_data[gender.toLowerCase()]++;
              }
            });
        }
        this.setState({
          cluster_data: cluster_data,
          isClusterModalVisible: true,
        });
        return;
      } catch (e) {
        console.log(e);
      }

      try {
        const leaves = this.state.high_cluster
          .getLeaves(feature.properties.cluster_id, Infinity)
          .forEach((leaf) => {
            fetch(
              "http://sym-track.herokuapp.com/api/symptomuser/user/" +
                leaf.id +
                "?demo=true",
              {
                method: "GET",
                headers: {
                  Authorization: "Bearer " + userIDStore.getState().userToken,
                  Accept: "application/json",
                  "Content-type": "application/json",
                },
              }
            )
              .then((res) => res.json())
              .then((data) => {
                for (let i = 0; i < data.length; i++) {
                  const symptom = data[i].Symptom.name;
                  const age_group = data[i].age_group;
                  const gender = data[i].gender;

                  cluster_data[symptom.toLowerCase()]++;
                  cluster_data[age_group]++;
                  cluster_data[gender.toLowerCase()]++;
                }
              });
          });
        this.setState({
          cluster_data: cluster_data,
          isClusterModalVisible: true,
        });
        return;
      } catch (e) {
        console.log(e);
      }

      if (
        this.state.small_cluster.getLeaves(
          feature.properties.cluster_id,
          Infinity
        )
      ) {
        console.log("Small");
        console.log(
          this.state.small_cluster.getLeaves(
            feature.properties.cluster_id,
            Infinity
          )
        );
      } else if (
        this.state.medium_cluster.getLeaves(
          feature.properties.cluster_id,
          Infinity
        )
      ) {
        console.log("Medium");
        console.log(
          this.state.medium_cluster.getLeaves(
            feature.properties.cluster_id,
            Infinity
          )
        );
      } else {
        console.log("High");
        console.log(
          this.state.high_cluster.getLeaves(
            feature.properties.cluster_id,
            Infinity
          )
        );
      }
    } else {
      const point_info = {
        gender: "",
        age_group: "",
        symptoms: [],
      };
      const user_id = feature.id;
      const details = fetch(
        "http://sym-track.herokuapp.com/api/symptomuser/user/" +
          user_id +
          "?demo=true",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + userIDStore.getState().userToken,
            Accept: "application/json",
            "Content-type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            const symptom = data[i].Symptom.name;
            point_info.age_group = data[i].age_group;
            point_info.gender = data[i].gender;

            point_info.symptoms.push(symptom);
          }
        });
      currentPointInfo = point_info;
      this.setModalVisible(true);
    }
    // console.log('You pressed a layer here is your feature', feature); // eslint-disable-lin
  }

  async onRegionDidChange() {
    const top_left = await this.map.getCoordinateFromView([0, 0]);
    const top_right = await this.map.getCoordinateFromView([screenWidth, 0]);
    const bottom_left = await this.map.getCoordinateFromView([0, screenHeight]);
    const bottom_right = await this.map.getCoordinateFromView([
      screenWidth,
      screenHeight,
    ]);

    this.setState({ top_left_bound: top_left });
    this.setState({ top_right_bound: top_right });
    this.setState({ bottom_left_bound: bottom_left });
    this.setState({ bottom_right_bound: bottom_right });

    console.log("calling update clusters");
    // call updateClusters
    this.updateClusters();
    zoom_level = this.map.getZoom();
  }

  async onFinishedLoadingMap() {
    console.log(
      "LOCATION: " +
        this.state.user_longitude +
        " , " +
        this.state.user_latitude
    );

    this.setState({
      location: [this.state.user_longitude, this.state.user_latitude],
    });
    zoom_level = this.map.getZoom();
    console.log("--------------------zoom level----------------" + zoom_level);
    var loc = { lat: this.state.user_latitude, lng: this.state.user_longitude };
    try {
      const res = await Geocoder.geocodePosition(loc);
      this.setState({ user_country: res[0].country });
    } catch (err) {
      console.log(err);
    }
    console.log(this.state.user_country);
    this.fetchSymptoms();
  }

  onTrackingChange() {
    console.log("tracking changed!");
    const location_prev = this.state.location;
    const location_new = [this.state.user_longitude, this.state.user_latitude];

    this.setState({
      location: [this.state.user_longitude, this.state.user_latitude],
    });
  }

  onUserLocationUpdate(location) {
    this.setState({
      user_latitude: location.coords.latitude,
      user_longitude: location.coords.longitude,
    });
  }

  FloatingButtonEvent = () => {
    this.onTrackingChange();
  };

  fetchCities() {
    fetch("http://sym-track.herokuapp.com/api/cities", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        city_names = [];
        console.log(data);
        Object.keys(data).forEach((key, idx) => {
          const city_name = key + ", " + data[key][0].country;
          const id = idx;

          const city = {
            id: id,
            name: city_name,
          };
          city_names.push(city);
        });
        console.log("----------- city data loaded --------------");
        this.setState({
          cities: data,
          city_names: city_names,
        });
      });
  }

  fetchSymptoms() {
    // Console.log(
    //   userIDStore.getState().userToken +
    //     ' long ' +
    //     this.state.user_longitude +
    //     ' lat ' +
    //     this.state.user_latitude,
    // );
    fetch("http://sym-track.herokuapp.com/api/locations_symptoms?demo=true", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        longitude: this.state.user_longitude,
        latitude: this.state.user_latitude,

        top_left_bound: this.state.top_left_bound,
        top_right_bound: this.state.top_right_bound,
        bottom_left_bound: this.state.bottom_left_bound,
        bottom_right_bound: this.state.bottom_right_bound,
      }),
    })
      .then((res) => {
        console.log("res = ");
        console.log(res.status);

        if (res.status === 500) {
          console.log("No locations with users and symptoms found.");
          console.log(
            this.state.user_longitude + " , " + this.state.user_latitude
          );
          console.log(this.state.top_left_bound);
          console.log(this.state.top_right_bound);
          console.log(this.state.bottom_left_bound);
          console.log(this.state.bottom_right_bound);
          return;
        } else {
          return res.json();
        }
      })
      .then((data) => {
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

          this.setState({
            gridCollections: gridCollections,
            small_cluster: small_cluster,
            medium_cluster: medium_cluster,
            high_cluster: high_cluster,
            grid_rendering: true,
          });
          this.updateClusters();
        } else {
          console.log("-----------else-------");
          this.setState({
            symptoms: data,
          });
          const featureCollections = this.symptomsToGeoJson(
            this.state.symptoms
          );

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

          this.setState({
            symptomCollections: featureCollections,
            small_cluster: small_cluster,
            medium_cluster: medium_cluster,
            high_cluster: high_cluster,
            grid_rendering: false,
          });
          this.updateClusters();
        }
      })
      .catch((error) => {
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
    console.log("-----------inside fetch symptoms--------");
    this.fetchCities();
    this.timer = setInterval(() => this.fetchSymptoms(), 15000);
  }

  updateClusters = async () => {
    console.log("inside update--");

    const small_cluster = this.state.small_cluster;
    const medium_cluster = this.state.medium_cluster;
    const high_cluster = this.state.high_cluster;

    const SymptomCollection = {
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

    if (small_cluster || medium_cluster || high_cluster) {
      const bounds = await this.map.getVisibleBounds();
      const west_lng = bounds[1][0];
      const south_lat = bounds[1][1];
      const east_lng = bounds[0][0];
      const north_lat = bounds[0][1];

      const zoom = Math.round(await this.map.getZoom());

      if (small_cluster) {
        small_cluster
          .getClusters([west_lng, south_lat, east_lng, north_lat], zoom)
          .forEach((feature) => {
            SymptomCollection.smallSymptomCollection.features.push(feature);
          });
        this.setState({
          small_superclusters: small_cluster.getClusters(
            [west_lng, south_lat, east_lng, north_lat],
            zoom
          ),
        });
      }

      if (medium_cluster) {
        medium_cluster
          .getClusters([west_lng, south_lat, east_lng, north_lat], zoom)
          .forEach((feature) => {
            SymptomCollection.mediumSymptomCollection.features.push(feature);
          });
        this.setState({
          medium_superclusters: medium_cluster.getClusters(
            [west_lng, south_lat, east_lng, north_lat],
            zoom
          ),
        });
      }
      if (high_cluster) {
        high_cluster
          .getClusters([west_lng, south_lat, east_lng, north_lat], zoom)
          .forEach((feature) => {
            SymptomCollection.highSymptomCollection.features.push(feature);
          });
        this.setState({
          high_superclusters: high_cluster.getClusters(
            [west_lng, south_lat, east_lng, north_lat],
            zoom
          ),
        });
      }
      this.setState({ symptomCollections: SymptomCollection });
    }
  };

  getListOfSymptoms = (data, images, num_columns) => {
    return (
      <View style={{ marginTop: 10 }}>
        <FlatList
          data={data}
          horizontal={false}
          numColumns={num_columns}
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

  gridsToGeoJson(grids) {
    console.log("Grids to GeoJson");
    const gridCollections = {
      smallGridCollection: {
        type: "FeatureCollection",
        features: [],
      },
      mediumGridCollection: {
        type: "FeatureCollection",
        features: [],
      },
      heavyGridCollection: {
        type: "FeatureCollection",
        features: [],
      },
    };
    for (let i = 0; i < grids.length; i++) {
      const element = grids[i];
      const feat = {
        type: "Feature",
        id: element._id,
        properties: {
          icon: "pin3",
        },
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(element.location.coordinates[0]),
            parseFloat(element.location.coordinates[1]),
          ],
        },
      };
      // subtitute with number of infections later
      gridCollections.heavyGridCollection.features.push(feat);
      grid_infos[element._id] = element;
    }
    return gridCollections;
  }

  symptomsToGeoJson(symptoms) {
    console.log("symptoms to GeoJson " + symptoms.length);
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

      const feat = {
        type: "Feature",
        id: element.user_id,
        properties: {
          icon: "pin3",
        },
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(element.location.coordinates[0]),
            parseFloat(element.location.coordinates[1]),
          ],
        },
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
  }
  /*
  calculateProbability(symptoms) {
    console.log("Symptoms are:");
    console.log(symptoms);
    let total_prob = 1.0;
    let dates = Object.keys(covid[this.state.user_country]);
    dates = dates.slice(4, dates.length);
    const lastDate = dates[dates.length - 1];
    const confirmed = parseFloat(covid[this.state.user_country][lastDate]); // confirmed cases for this country
    const prevalence =
      confirmed / this.state.test_counts[this.state.user_country];

    console.log('prevalence = ' + prevalence);

    for (let i = 0; i < symptoms.length; i++) {
      var symptom = symptoms[i].name.toLowerCase();
      if (symptom == 'persistent dry cough') {
        symptom = 'cough';
      } else if (
        symptom == 'high-grade fever' ||
        symptom == 'medium-grade fever'
      ) {
        symptom = 'fever';
      } else if (symptom == 'repeated shaking with chills') {
        symptom = 'chills';
      }
      const prob = 1 - (prevalence * Ak[symptom]) / Sk[symptom];
      total_prob *= prob;
    }
    total_prob = 1.0 - total_prob;
    console.log('total probability = ' + total_prob);
    return total_prob;
  }*/

  renderClusterInfo(cluster_data) {
    const data = [];
    Object.keys(cluster_data).forEach((key, idx) => {
      data.push({ id: idx, name: cluster_data[key] + " " + key });
    });
    const images = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].name.search("country") !== -1) {
        images.push(locationAvatar);
      } else if (data[i].name.search("male") !== -1) {
        images.push(manAvatar);
      } else if (data[i].name.search("female") !== -1) {
        images.push(womanAvatar);
      } else if (data[i].name.search("fatigue") !== -1) {
        images.push(fatigue);
      } else if (data[i].name.search("runny nose") !== -1) {
        images.push(runny_nose);
      } else if (data[i].name.search("sneezing") !== -1) {
        images.push(sneezing);
      } else if (data[i].name.search("headaches") !== -1) {
        images.push(headache);
      } else if (data[i].name.search("anosmia") !== -1) {
        images.push(anosmia);
      } else if (data[i].name.search("conjunctivitis") !== -1) {
        images.push(conjunctivitis);
      } else if (data[i].name.search("diarrhoea") !== -1) {
        images.push(diarrhea);
      } else if (data[i].name.search("myalgia") !== -1) {
        images.push(muscle_pain);
      } else if (data[i].name.search("sore throat") !== -1) {
        images.push(sore);
      } else if (data[i].name.search("fever") !== -1) {
        images.push(fever);
      } else if (data[i].name.search("cough") !== -1) {
        images.push(cough);
      } else if (data[i].name.search("difficulty breathing") !== -1) {
        images.push(shortness);
      } else if (data[i].name.search("pneumonia") !== -1) {
        images.push(pneumonia);
      } else if (data[i].name.search("chills") !== -1) {
        images.push(chills);
      } else {
        images.push(manAvatar);
      }
    }
    return (
      <View style={styles.modal}>
        <View style={styles.clusterModalContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarRow}>
              <Image
                resizeMode="contain"
                source={locationAvatar}
                style={styles.cluster_avatar}
              />
            </View>
            <View style={styles.cluster_userInfo}>
              <View style={styles.useData}>
                <View style={styles.tag}>
                  <Text style={styles.tagContent}>GEO</Text>
                </View>
                <Text style={styles.tagData}>{this.state.user_country}</Text>
              </View>
            </View>
          </View>
          <View style={styles.separator}></View>
          <View style={styles.symptomContainer}>
            <View>
              <Text>CLUSTER DATA</Text>
            </View>
          </View>
          <View style={styles.closeModalContainer}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isClusterModalVisible: false });
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

  renderPointInfo(info) {
    // populate data and image arrays <View>{this.getListOfSymptoms(data, images, 2)}</View>

    if (info == null) return;
    const data = [];
    const images = [];
    for (let i = 0; i < info.symptoms.length; i++) {
      var name = info.symptoms[i];
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
                    info.gender.toLowerCase() === "male"
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
              <View>{this.getListOfSymptoms(data, images, 3)}</View>
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

  renderSymptomLayer(id, featureCollection, style, grid_rendering) {
    if (grid_rendering === true) {
      return (
        <MapboxGL.ShapeSource key={id} id={id} shape={featureCollection}>
          <MapboxGL.CircleLayer
            id={id + " singleCluster"}
            style={singleCluster}
          />
        </MapboxGL.ShapeSource>
      );
    }
    return (
      <MapboxGL.ShapeSource
        key={id}
        id={id}
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

  metersToPixelsAtMaxZoom = (meters) =>
    meters / 0.075 / Math.cos((this.state.location[1] * Math.PI) / 180);

  render() {
    const { isModalVisible } = this.state;
    return (
      <View style={[styles.centeredView]}>
        <Modal visible={isModalVisible} animationType="fade" transparent={true}>
          {this.renderPointInfo(currentPointInfo)}
        </Modal>
        <Modal
          visible={this.state.isClusterModalVisible}
          animationType="fade"
          transparent={true}
        >
          {this.renderClusterInfo(this.state.cluster_data)}
        </Modal>
        <View style={{ flex: 1 }}>
          <SearchableDropdown
            onItemSelect={(item) => {
              const city_name = item.name.substring(0, item.name.search(","));

              console.log("City name = " + city_name);

              const latitude = this.state.cities[city_name][0].latitude;
              const longitude = this.state.cities[city_name][0].longitude;
              this.setState({
                selected_city: item,
                location: [longitude, latitude],
              });
            }}
            containerStyle={{ padding: 5, backgroundColor: "#39363E" }}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: "#39363E",
              borderColor: "#3E2723",
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{ color: "white" }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={this.state.city_names}
            resetValue={false}
            textInputProps={{
              placeholder: "Search City",
              placeholderTextColor: "white",
              underlineColorAndroid: "transparent",
              style: {
                padding: 12,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                color: "white",
              },
            }}
            listProps={{
              nestedScrollEnabled: true,
            }}
          />
        </View>
        <View style={styles.container}>
          <MapboxGL.MapView
            ref={(ref) => (this.map = ref)}
            style={smallStyles.matchParent}
            styleURL={"mapbox://styles/mapbox/dark-v10"}
            compassEnabled
            compassViewPosition={1}
            onDidFinishLoadingMap={this.onFinishedLoadingMap}
            onRegionDidChange={this.onRegionDidChange}
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
              smallStyles,
              this.state.grid_rendering
            )}
            {this.renderSymptomLayer(
              "medium",
              this.state.symptomCollections.mediumSymptomCollection,
              mediumStyles,
              this.state.grid_rendering
            )}
            {this.renderSymptomLayer(
              "high",
              this.state.symptomCollections.highSymptomCollection,
              highStyles,
              this.state.grid_rendering
            )}
          </MapboxGL.MapView>
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.FloatingButtonEvent}
          style={styles.TouchableOpacityStyle}
        >
          <Image
            source={require("../../../assets/images/location_dark.jpg")}
            style={styles.FloatingButtonStyle}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const singleCluster = {
  circleColor: "#9C27B0",
  circleStrokeWidth: 5,
  circleStrokeColor: "#3E2723",
  circleRadius: 50,
  circleOpacity: 0.6,
};

const singleClusterCount = {
  textField: "{120}",
  textSize: 15,
  textPitchAlignment: "map",
  textColor: "white",
};

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
  clusterModalContent: {
    backgroundColor: "#fff",
    width: screenWidth - 20,
    height: screenHeight - 60,
    marginBottom: 20,
    borderRadius: 10,
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
  cluster_avatar: { width: 80, height: 80, borderRadius: 50 },
  cluster_userInfo: { marginTop: 0 },
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
    width: 500,
    height: screenHeight - 200,
    backgroundColor: "white",
  },
  map: {
    flex: 1,
  },
});

const smallStyles = {
  singlePoint: {
    circleColor: "#FFC107",
    circleStrokeWidth: 1,
    circleStrokeColor: "white",
    circleRadius: 5,
    circleOpacity: 0.8,
    circlePitchAlignment: "map",
  },
  matchParent: {
    flex: 3,
  },
  clusteredPoints: {
    circlePitchAlignment: "map",
    circleColor: [
      "step",
      ["get", "point_count"],
      "#FFC107",
      100,
      "#FF8F00",
      750,
      "#FF6F00",
    ],

    circleRadius: ["step", ["get", "point_count"], 20, 100, 30, 750, 40],

    circleOpacity: 0.6,
    circleStrokeWidth: 4,
    circleStrokeColor: "#3E2723",
  },

  clusterCount: {
    textField: "{point_count}",
    textSize: 15,
    textPitchAlignment: "map",
    textColor: "white",
  },
};

const mediumStyles = {
  singlePoint: {
    circleColor: "#EF6C00",
    circleStrokeWidth: 1,
    circleStrokeColor: "white",
    circleRadius: 6,
    circleOpacity: 0.8,
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
      "#E65100",
      750,
      "#FF5722",
    ],

    circleRadius: ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    circleOpacity: 0.6,
    circleStrokeWidth: 4,
    circleStrokeColor: "#3E2723",
  },

  clusterCount: {
    textField: "{point_count}",
    textSize: 15,
    textPitchAlignment: "map",
    textColor: "white",
  },
};

const highStyles = {
  singlePoint: {
    circleColor: "#B71C1C",
    circleStrokeWidth: 1,
    circleStrokeColor: "white",
    circleRadius: 8,
    circleOpacity: 0.8,
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
      "#E91E63",
      750,
      "#9C27B0",
    ],

    circleRadius: ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    circleOpacity: 0.6,
    circleStrokeWidth: 4,
    circleStrokeColor: "#3E2723",
  },

  clusterCount: {
    textField: "{point_count}",
    textSize: 15,
    textPitchAlignment: "map",
    textColor: "white",
  },
  tabContainer: {
    height: 80,
  },
};
