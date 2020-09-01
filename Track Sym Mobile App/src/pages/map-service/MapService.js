import { PermissionsAndroid } from "react-native";
import React, { Fragment } from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";
import Supercluster from "supercluster";
import { PieChart } from "react-native-chart-kit";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
  Modal,
  TouchableHighlight,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import {
  Layout,
  Button,
  Tab,
  TabView,
  TabBar,
  Card,
} from "@ui-kitten/components";

import cluster_icon from "../../../assets/images/chart.jpg";
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
import infections from "../../../assets/images/infections.png";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/female.png";
import undisclosed from "../../../assets/images/undisclosed.png";

import manAvatar from "../../../assets/images/avatar.png";
import womanAvatar from "../../../assets/images/person.png";
import Geocoder from "react-native-geocoder";
import userIDStore from "../../data-management/user-id-data/userIDStore";
import languageStore from "../../data-management/language_data/languageStore";
import { strings } from "../../localization/localization";
import { useIsFocused } from "@react-navigation/native";

import SearchableDropdown from "react-native-searchable-dropdown";
import Ionicons from "react-native-vector-icons/Ionicons";

import { ThemeContext } from "../../../assets/themes/theme-context";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g"
);
console.disableYellowBox = true;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const colors = ["#FFC107", "#EF6C00", "#B71C1C"];

const pointInfos = {};
const grid_infos = {};

let currentPointInfo = null;
let current_grid_info = null;

let zoom_level = null;
let animating = true;
export default class MapService extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      isClusterModalVisible: false,
      runInBackground: true,

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
    this.onGridLayerPress = this.onGridLayerPress.bind(this);
    this.onFinishedLoadingMap = this.onFinishedLoadingMap.bind(this);
    this.onRegionDidChange = this.onRegionDidChange.bind(this);
    this.renderClusterInfo = this.renderClusterInfo.bind(this);
    this.rateToColor = this.rateToColor.bind(this);

    this.metersToPixelsAtMaxZoom = this.metersToPixelsAtMaxZoom.bind(this);
    languageStore.subscribe(() => {
      strings.setLanguage(languageStore.getState());
      this.componentDidMount();
    });
  }

  // Sets visibility of symptom (cluster) details modal
  setModalVisible(visible) {
    this.setState({ isModalVisible: visible });
  }

  // Cluster has been clicked. Identifies the cluster that has been clicked and sets modal to visible
  async onGridLayerPress(e) {
    console.log("Inside grid layer press");
    const feature = e.nativeEvent.payload;
    animating = true;
    const user_id = feature.id;

    current_grid_info = grid_infos[user_id];
    this.setState({ isClusterModalVisible: true });
  }

  // Assigns colors based on probability of having the virus
  rateToColor(rate, hue0 = 0, hue1 = 100, reverse = false) {
    let hue = Math.min(rate, 1) * (hue1 - hue0) + hue0;
    if (reverse) hue = hue1 - hue;
    return `hsl(${hue}, 100%, 45%)`;
  }

  // Data point has been clicked.
  async onSourceLayerPress(e) {
    const feature = e.nativeEvent.payload;
    animating = true;
    if (feature.properties.cluster) {
      console.log("cluster clicked");
      const cluster_data = {
        male: 0,
        female: 0,
        undisclosed: 0,
        fatigue: 0,
        "runny nose": 0,
        sneezing: 0,
        headaches: 0,
        anosmia: 0,
        conjunctivitis: 0,
        diarrhea: 0,
        myalgia: 0,
        fever: 0,
        "sore throat": 0,
        "difficulty breathing": 0,
        pneumonia: 0,
        chills: 0,
        cough: 0,
        "0-10": 0,
        "11-20": 0,
        "21-30": 0,
        "31-40": 0,
        "41-50": 0,
        "51-60": 0,
        "61-70": 0,
        "71-80": 0,
        "81-90": 0,
        ">90": 0,
        address: "",
      };
      const user_location = feature.geometry.coordinates;
      var loc = { lat: user_location[1], lng: user_location[0] };
      const res = await Geocoder.geocodePosition(loc);
      const address = res[1].formattedAddress.toString();
      cluster_data.address = address;
      console.log(
        "-----------CLUSTER ADDRESS-------------" + cluster_data.address
      );
      try {
        const leaves = this.state.small_cluster.getLeaves(
          feature.properties.cluster_id,
          Infinity
        );
        for (let i = 0; i < leaves.length; i++) {
          let leaf = leaves[i];
          fetch(
            "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptomuser/user/" +
              leaf.id +
              "",
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
                const symptom = data[i].Symptom.name.toLowerCase();
                const age_group = data[i].age_group;
                const gender = data[i].gender.toLowerCase();

                cluster_data[age_group]++;
                cluster_data[gender]++;
                if (symptom.search("fever") !== -1) {
                  cluster_data.fever++;
                } else if (symptom.search("chills") !== -1) {
                  cluster_data.chills++;
                } else if (symptom.search("cough") !== -1) {
                  cluster_data.cough++;
                } else {
                  cluster_data[symptom]++;
                }
              }
            })
            .catch((err) => {
              console.log(err);
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
            "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptomuser/user/" +
              leaf.id +
              "",
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
                const symptom = data[i].Symptom.name.toLowerCase();
                const age_group = data[i].age_group;
                const gender = data[i].gender.toLowerCase();

                if (symptom.search("fever") !== -1) {
                  cluster_data.fever++;
                } else if (symptom.search("chills") !== -1) {
                  cluster_data.chills++;
                } else if (symptom.search("cough") !== -1) {
                  cluster_data.cough++;
                } else {
                  cluster_data[symptom.toLowerCase()]++;
                }
                cluster_data[age_group]++;
                cluster_data[gender.toLowerCase()]++;
              }
            })
            .catch((err) => {
              console.log(err);
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
              "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptomuser/user/" +
                leaf.id +
                "",
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
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                  const symptom = data[i].Symptom.name.toLowerCase();
                  const age_group = data[i].age_group;
                  const gender = data[i].gender.toLowerCase();

                  if (symptom.search("fever") !== -1) {
                    cluster_data.fever++;
                  } else if (symptom.search("chills") !== -1) {
                    cluster_data.chills++;
                  } else if (symptom.search("cough") !== -1) {
                    cluster_data.cough++;
                  } else {
                    cluster_data[symptom.toLowerCase()]++;
                  }
                  cluster_data[age_group]++;
                  cluster_data[gender.toLowerCase()]++;
                }
                console.log("Cluster data");
                console.log(cluster_data);
              })
              .catch((err) => {
                console.log(err);
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
        address: "",
      };
      const user_id = feature.id;
      const user_location = feature.geometry.coordinates;

      var loc = { lat: user_location[1], lng: user_location[0] };
      const res = await Geocoder.geocodePosition(loc);
      point_info.address = res[1].formattedAddress.toString();

      const details = fetch(
        "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptomuser/user/" +
          user_id +
          "",
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
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            const symptom = data[i].Symptom.name.toLowerCase();
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

  // gets the four corners on the map and calls updateClusters
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

    // call fetch symptoms
    console.log("calling fetch symptoms");
    this.fetchSymptoms();
    console.log("calling update clusters");
    // call updateClusters
    this.updateClusters();
    zoom_level = this.map.getZoom();
  }

  // gets user city and calls fetchSymptoms
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
    var loc = { lat: this.state.user_latitude, lng: this.state.user_longitude };
    try {
      const res = await Geocoder.geocodePosition(loc);
      this.setState({ user_country: res[0].country });
    } catch (err) {
      console.log(err);
    }
    zoom_level = this.map.getZoom();

    const top_left = await this.map.getCoordinateFromView([0, 0]);
    const top_right = await this.map.getCoordinateFromView([screenWidth, 0]);
    const bottom_left = await this.map.getCoordinateFromView([0, screenHeight]);
    const bottom_right = await this.map.getCoordinateFromView([
      screenWidth,

      screenHeight,
    ]);

    this.setState({
      top_left_bound: top_left,
      top_right_bound: top_right,
      bottom_left_bound: bottom_left,
      bottom_right_bound: bottom_right,
    });
    animating = false;
    console.log(
      "-----------------SETTING COUNTRY ---------- " + this.state.user_country
    );
    this.fetchSymptoms();
  }

  // handles user navigating through the map
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

  // fetches list of cities in the world
  fetchCities() {
    fetch("https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/cities", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const city_names = [];
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

  // fetches symptoms from backend
  fetchSymptoms = async () => {
    if (!this.state.isClusterModalVisible) {
      animating = true;
    }
    await fetch(
      "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/locations_symptoms",
      {
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
      }
    )
      .then((res) => {
        console.log("res = ");
        console.log(res.status);

        if (res.status === 500) {
          animating = false;
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
          console.log("Rendering Grids");
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
          if (animating === true) {
            animating = false;
          }
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
          if (animating === true) {
            animating = false;
          }
          this.updateClusters();
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
    console.log("-----------inside fetch symptoms--------");
    this.fetchCities();

    this.props.navigation.addListener("focus", async () => {
      this.timer = setInterval(() => this.fetchSymptoms(), 15000);
    });
    this.props.navigation.addListener("blur", () => {
      clearInterval(this.timer);
    });

    //map_string : contextType.theme === "light" ? "mapbox://styles/mapbox/light-v10" : "mapbox://styles/mapbox/dark-v10",
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
            let point_count = feature.properties.point_count;
            if (point_count) {
              feature.properties.color = this.rateToColor(
                point_count / 15,
                55,
                10
              );
              feature.properties.size = 15 + Math.min(point_count / 15, 1) * 5;
              feature.properties.point_opacity = 0;
            } else {
              feature.properties.point_opacity = 0.5;
            }
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
            let point_count = feature.properties.point_count;
            if (point_count) {
              this.mode = "cluster";
              feature.properties.color = this.rateToColor(
                point_count / 30,
                40,
                5
              );
              feature.properties.size = 15 + Math.min(point_count / 30, 1) * 10;
              feature.properties.point_opacity = 0;
            } else {
              this.mode = "points";
              feature.properties.point_opacity = 0.5;
            }
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
            let point_count = feature.properties.point_count;
            if (point_count) {
              // this.mode = "cluster";
              feature.properties.color = this.rateToColor(
                point_count / 300,
                35,
                0
              );
              feature.properties.size =
                20 + Math.min(point_count / 300, 1) * 15;
              feature.properties.point_opacity = 0;
            } else {
              //this.mode = "points";
              feature.properties.point_opacity = 0.5;
            }
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

  getClusterSymptoms = (data, images) => {
    return (
      <View style={{ marginTop: 10 }}>
        <FlatList
          data={data}
          horizontal={false}
          numColumns={1}
          renderItem={({ item, index }) => (
            <Card>
              <View
                style={{ marginLeft: 15, marginTop: 15, flexDirection: "row" }}
              >
                <Image
                  style={{ marginLeft: 50, width: 60, height: 60 }}
                  source={images[index]}
                />
                <Text style={{ marginTop: 30, fontSize: 16, marginLeft: 15 }}>
                  {item.name}
                </Text>
              </View>
            </Card>
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
          color: this.rateToColor(element.probability, 60, 0),
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
          color: this.rateToColor(element.probability, 60, 0),
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

  renderClusterInfo(cluster_data, country) {
    console.log("ADDRESS IS: " + cluster_data.address);
    const chartConfig = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
    };

    const piechart_data = [];
    const age_groups = [
      "0-10",
      "11-20",
      "21-30",
      "31-40",
      "41-50",
      "51-60",
      "61-70",
      "71-80",
      "81-90",
      ">90",
    ];
    const age_colors = [
      "#6208F8",
      "#F8BA08",
      "#47F808",
      "#F80F08",
      "#0908F8",
      "#08F8CB",
      "#E608F8",
      "#8CF808",
      "#A508F8",
      "#F85B08",
    ];
    const images = [];
    const data = [];
    let total_symptoms = 0,
      male_symps = 0,
      female_symps = 0,
      undisclosed_symps = 0;
    if (this.state.grid_rendering === true) {
      female_symps = parseInt(current_grid_info.genders.FEMALE);
      male_symps = parseInt(current_grid_info.genders.MALE);
      undisclosed_symps = parseInt(current_grid_info.genders.UNDISCLOSED);

      total_symptoms = male_symps + female_symps + undisclosed_symps;
      if (
        current_grid_info.value["Repeated Shaking with Chills"] !== undefined &&
        current_grid_info.value["Repeated Shaking with Chills"] !== -1
      ) {
        const shaking_chills = parseInt(
          current_grid_info.value["Repeated Shaking with Chills"]
        );
        const chills =
          current_grid_info.value["Chills"] !== undefined
            ? parseInt(current_grid_info.value["Chills"])
            : 0;
        const total_chills = shaking_chills + chills;
        current_grid_info.value["Chills"] = total_chills;
        console.log("-----------Total chills = " + total_chills);
        current_grid_info.value["Repeated Shaking with Chills"] = -1;
      }

      Object.keys(current_grid_info.value).forEach((key, idx) => {
        if (key.toLowerCase() !== "repeated shaking with chills") {
          data.push({
            id: idx,
            name: current_grid_info.value[key] + " " + key.toLowerCase(),
          });
        }
      });

      let i = 0;
      for (i = 0; i < data.length; i++) {
        if (data[i].name.search("fatigue") !== -1) {
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
        } else if (
          data[i].name.search("diarrhoea") !== -1 ||
          data[i].name.search("diarrhea") !== -1
        ) {
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
      if (i === data.length - 1) {
        animating = false;
      }
      for (i = 0; i < age_groups.length; i++) {
        const age_group = age_groups[i];
        if (parseInt(current_grid_info.ages[age_group]) > 0) var chart_element;
        if (age_group === ">90") {
          chart_element = {
            name: age_group,
            symptomatic: current_grid_info.ages[age_group],
            color: age_colors[i],
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          };
        } else {
          chart_element = {
            name: " between " + age_group,
            symptomatic: current_grid_info.ages[age_group],
            color: age_colors[i],
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          };
        }
        piechart_data.push(chart_element);
      }
    } else {
      male_symps = parseInt(cluster_data.male);
      female_symps = parseInt(cluster_data.female);
      undisclosed_symps = parseInt(cluster_data.undisclosed);
      total_symptoms = male_symps + female_symps + undisclosed_symps;

      Object.keys(cluster_data).forEach((key, idx) => {
        if (
          key !== "total" &&
          key !== "male" &&
          key !== "female" &&
          key !== "undisclosed" &&
          key.search("-") === -1 &&
          key.search(">") === -1
        ) {
          if (parseInt(cluster_data[key]) > 0) {
            data.push({ id: idx, name: cluster_data[key] + " " + key });
          }
        }
      });
      let i = 0;
      for (i = 0; i < data.length; i++) {
        if (data[i].name.search("fatigue") !== -1) {
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
        } else if (
          data[i].name.search("diarrhoea") !== -1 ||
          data[i].name.search("diarrhea") !== -1
        ) {
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
      if (i === cluster_data.length - 1) {
        console.log("setting animating to false");
        animating = false;
      }

      for (i = 0; i < age_groups.length; i++) {
        const age_group = age_groups[i];
        var chart_element;
        if (parseInt(cluster_data[age_group]) > 0) {
          if (age_group === ">90") {
            chart_element = {
              name: age_group,
              symptomatic: cluster_data[age_group],
              color: age_colors[i],
              legendFontColor: "#7F7F7F",
              legendFontSize: 15,
            };
          } else {
            chart_element = {
              name: " between " + age_group,
              symptomatic: cluster_data[age_group],
              color: age_colors[i],
              legendFontColor: "#7F7F7F",
              legendFontSize: 15,
            };
          }
          piechart_data.push(chart_element);
        }
      }
    }

    return (
      <Layout style={styles.clusterModal}>
        <Layout style={styles.clusterModalContent}>
          <Layout style={{ flex: 1, borderRadius: 10 }}>
            <View style={styles.clusterAvatarContainer}>
              <View style={styles.clusterAvatarRow}>
                <Image
                  width="90"
                  height="90"
                  source={cluster_icon}
                  style={styles.cluster_avatar}
                />
              </View>
              <View style={styles.userInfo}>
                <View style={styles.useData}>
                  <View style={styles.tag}>
                    <Text style={styles.tagContent}>GEO</Text>
                  </View>
                  <Text style={styles.tagData}>{cluster_data.address}</Text>
                </View>
              </View>
            </View>
          </Layout>
          <Layout
            style={{
              flex: 3,
              borderRadius: 10,
            }}
          >
            <TabView
              style={{ flex: 1, borderRadius: 10 }}
              selectedIndex={this.state.selected_index}
              onSelect={(index) => this.setState({ selected_index: index })}
            >
              <Tab title="GENERAL INFO">
                <ScrollView>
                  <Layout style={styles.tabContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 40,
                        marginLeft: 50,
                      }}
                    >
                      <Image
                        resizeMode="contain"
                        source={infections}
                        style={styles.cluster_avatar}
                      />
                      <Text
                        category="h5"
                        style={{ marginLeft: 20, marginTop: 30 }}
                      >
                        {total_symptoms + " total symptomatic users"}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 20,
                        marginLeft: 20,
                      }}
                    >
                      <View style={{ flexDirection: "column" }}>
                        <Image
                          resizeMode="contain"
                          source={male}
                          style={styles.cluster_avatar}
                        />
                        <Text
                          category="h5"
                          style={{ marginLeft: 20, marginTop: 30 }}
                        >
                          {male_symps + " male"}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "column", marginLeft: 15 }}>
                        <Image
                          resizeMode="contain"
                          source={female}
                          style={styles.cluster_avatar}
                        />
                        <Text
                          category="h5"
                          style={{ marginLeft: 20, marginTop: 30 }}
                        >
                          {female_symps + " female"}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "column", marginLeft: 15 }}>
                        <Image
                          resizeMode="contain"
                          source={undisclosed}
                          style={styles.cluster_avatar}
                        />
                        <Text
                          category="h5"
                          style={{ marginLeft: 5, marginTop: 30 }}
                        >
                          {undisclosed_symps + " undisclosed"}
                        </Text>
                      </View>
                    </View>
                  </Layout>
                </ScrollView>
              </Tab>
              <Tab title="DEMOGRAPHICS">
                <Layout style={styles.tabContainer}>
                  <PieChart
                    data={piechart_data}
                    width={screenWidth - 40}
                    height={200}
                    chartConfig={chartConfig}
                    accessor="symptomatic"
                    backgroundColor="transparent"
                    absolute
                    style={{ marginTop: 30 }}
                  />
                </Layout>
              </Tab>
              <Tab title="SYMPTOMS">
                <Layout style={styles.tabContainer}>
                  <View>{this.getClusterSymptoms(data, images)}</View>
                </Layout>
              </Tab>
            </TabView>
            <Button
              onPress={() => this.setState({ isClusterModalVisible: false })}
            >
              CLOSE
            </Button>
          </Layout>
        </Layout>
      </Layout>
    );
  }

  renderPointInfo(info) {
    // populate data and image arrays <View>{this.getListOfSymptoms(data, images, 2)}</View>

    if (info == null) return;
    const data = [];
    const images = [];
    let i = 0;
    for (i; i < info.symptoms.length; i++) {
      var name = info.symptoms[i];
      var sym = { id: (i + 1).toString(), name: name };
      data.push(sym);
      name = name.toLowerCase();
      if (name === "anosmia") {
        images.push(anosmia);
      } else if (name.search(cough) !== -1) {
        images[i] = cough;
      } else if (name === "diarrhoea" || name === "diarrhea") {
        images[i] = diarrhea;
      } else if (name === "fatigue") {
        images[i] = fatigue;
      } else if (name === "high-grade fever" || name === "medium-grade fever") {
        images.push(fever);
      } else if (name === "headaches") {
        images.push(headache);
      } else if (name === "myalgia") {
        images.push(muscle_pain);
      } else if (name === "runny nose") {
        images.push(runny_nose);
      } else if (name === "difficulty breathing") {
        images.push(shortness);
      } else if (name === "sneezing") {
        images.push(sneezing);
      } else if (name === "sore throat") {
        images.push(sore);
      } else if (name.search("chills") !== -1) {
        images.push(chills);
      } else if (name === "pneumonia") {
        images.push(pneumonia);
      } else if (name === "conjunctivitis") {
        images.push(conjunctivitis);
      } else {
        images.push(cough);
      }
    }

    if (i === info.symptoms.length - 1) {
      console.log("setting animating to false");
      animating = false;
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
                    <Text style={styles.tagData}>{info.address}</Text>
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
        <MapboxGL.ShapeSource
          key={id}
          id={id}
          shape={featureCollection}
          onPress={this.onGridLayerPress}
        >
          <MapboxGL.SymbolLayer
            id={id + " pointcount"}
            style={{
              textAllowOverlap: true,
              iconAllowOverlap: true,
              textIgnorePlacement: true,
              textField: ["get", "total"],
              textFont: ["Ubuntu Medium", "Arial Unicode MS Regular"],
              textSize: 20,
              textPitchAlignment: "map",
              textColor: "white",
            }}
            aboveLayerID={id + " singleCluster"}
          />
          <MapboxGL.CircleLayer
            id={id + " gridCluster"}
            belowLayerID={id + " singleCluster"}
            filter={["has", "point_count"]}
            style={style.clusteredPoints}
          />
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
        {animating && (
          <View
            style={{
              backgroundColor: "#39363E",
              zIndex: 9998,
              width: 20,
              height: 0,
            }}
          >
            <ActivityIndicator
              style={{
                zIndex: 9999,
                marginTop: parseInt(screenHeight / 2),
                marginLeft: parseInt(screenWidth / 2),
              }}
              size="large"
              color="#9B9696"
            />
          </View>
        )}
        {this.state.isModalVisible && (
          <Modal
            visible={animating === false}
            animationType="fade"
            transparent={true}
          >
            {this.renderPointInfo(currentPointInfo)}
          </Modal>
        )}

        {this.state.isClusterModalVisible && (
          <Modal visible={true} animationType="fade" transparent={true}>
            {this.renderClusterInfo(
              this.state.cluster_data,
              this.state.user_country
            )}
          </Modal>
        )}

        <View>
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
            containerStyle={{
              padding: 5,
              backgroundColor:
                this.context.theme === "light" ? "#F5F5F5" : "#39363E",
            }}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor:
                this.context.theme === "light" ? "#F5F5F5" : "#39363E",
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
              placeholderTextColor:
                this.context.theme === "light" ? "black" : "white",
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
            styleURL={
              this.context.theme === "light"
                ? "mapbox://styles/mapbox/light-v10"
                : "mapbox://styles/mapbox/dark-v10"
            }
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
            {animating === false &&
              this.renderSymptomLayer(
                "small",
                this.state.symptomCollections.smallSymptomCollection,
                smallStyles,
                this.state.grid_rendering
              )}
            {animating === false &&
              this.renderSymptomLayer(
                "medium",
                this.state.symptomCollections.mediumSymptomCollection,
                mediumStyles,
                this.state.grid_rendering
              )}
            {animating === false &&
              this.renderSymptomLayer(
                "high",
                this.state.symptomCollections.highSymptomCollection,
                highStyles,
                this.state.grid_rendering
              )}
          </MapboxGL.MapView>
        </View>
        <TouchableOpacity
          // activeOpacity={0.5}
          onPress={this.FloatingButtonEvent}
          style={styles.TouchableOpacityStyle}
        >
          {/* <Image
            source={require('../../../assets/images/location_dark.jpg')}
            style={styles.FloatingButtonStyle}
          /> */}
          <Ionicons name="md-locate" size={30} color="#9B9696" />
        </TouchableOpacity>
      </View>
    );
  }
}

const singleCluster = {
  circleColor: [
    "step",
    ["get", "total"],
    "#FFC107",
    300,
    "#FF8F00",
    900,
    "#EF6C00",
    1500,
    "#9C27B0",
  ],
  circleStrokeWidth: 5,
  circleStrokeColor: "#3E2723",
  circleRadius: ["step", ["get", "total"], 30, 300, 40, 900, 50, 1500, 60],
  circleOpacity: 0.6,
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
  clusterModal: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  clusterModalContent: {
    width: screenWidth - 40,
    height: screenHeight - 100,
    borderRadius: 10,
  },
  clusterAvatarContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  clusterAvatarRow: { flexDirection: "row" },
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
    right: 20,
    bottom: 20,
    borderRadius: 5,
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
    //width: 500,
    //height: screenHeight - 200,
    backgroundColor: "white",
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

const smallStyles = {
  singlePoint: {
    circleColor: ["get", "color"],
    circleStrokeWidth: 1,
    circleStrokeColor: "white",
    circleRadius: 5,
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
    circleColor: ["get", "color"],
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
    circleColor: ["get", "color"],
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
