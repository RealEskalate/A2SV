import React from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Picker,
  FlatList,
  Dimensions,
} from "react-native";
import SlidingUpPanel from "rn-sliding-up-panel";
import { Slider } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { RadioButton } from "react-native-paper";
import MapboxGL from "@react-native-mapbox-gl/maps";

import Heat from "../../assets/images/Heat.jpg";
import Regional from "../../assets/images/Regional.jpg";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g"
);

console.disableYellowBox = true;

const nycJSON = require("./data/countries.json");
const covid = require("./data/covid.json");
const { height } = Dimensions.get("window");
const screenWidth = Dimensions.get("window").width;

export default class DataAnalyticsMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      play: false,
      pick: "",
      renderFunction: 0, // heatmaps rendered by default
      groupCollections: {},
      screenCoords: [],
      selectedGeoJSON: null,
      country2boundary: {},
      featureCollection: {
        type: "FeatureCollection",
        features: [],
      },
      index2date: [],
      maxDateLength: 0,
      max: 0.0,
      slider_date: 0,
      dataToView: "confirmed",
      regional_checked: false,
      heatmap_checked: true,
      visible: false,
    };
    this.onPress = this.onPress.bind(this);
    this.getCheckBox = this.getCheckBox.bind(this);
    this.playMapEvent = this.playMapEvent.bind(this);
    this.pauseMapEvent = this.pauseMapEvent.bind(this);
  }

  _toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    this.setState({ visible: !this.state.visible });
  };

  async onPress(e) {
    const { screenPointX, screenPointY } = e.properties;

    // const screenCoords = Object.assign([], this.state.screenCoords);
    // screenCoords.push([screenPointX, screenPointY]);

    // if (screenCoords.length === 2) {
    //   const featureCollection = await this._map.queryRenderedFeaturesInRect(
    //     this.getBoundingBox(screenCoords),
    //     null,
    //     ['nycFill'],
    //   );

    //   this.setState({
    //     screenCoords: [],
    //     selectedGeoJSON: featureCollection.features.length
    //       ? featureCollection
    //       : null,
    //   });
    // } else {
    //   this.setState({screenCoords});
    // }
  }

  componentDidMount() {
    const country2boundary = this.prepareBoundaries(nycJSON);
    this.setState({ country2boundary: country2boundary });
    this.dataToGeoJson();
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

  dataToGeoJson() {
    const featureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    let dates = Object.keys(covid["Ethiopia"]);
    dates = dates.slice(4, dates.length); // remove the name, lat, long and get the dates only

    const lastDate = dates[dates.length - 1];
    let max = 0.0;
    for (const countryName in covid) {
      const countryInfo = covid[countryName];
      const Lat = countryInfo["lat"];
      const Long = countryInfo["long"];
      const confirmed = Math.log(parseFloat(countryInfo[lastDate][0]));
      const death = Math.log(parseFloat(countryInfo[lastDate][1]));
      const recovered = Math.log(parseFloat(countryInfo[lastDate][2]));
      const feat = {
        type: "Feature",
        id: countryName,
        properties: {
          confirmed: confirmed,
          death: death,
          recovered: recovered,
          countryName: countryName,
        },
        geometry: {
          type: "Point",
          coordinates: [parseFloat(Long), parseFloat(Lat)],
        },
      };
      if (confirmed > max) {
        max = confirmed;
      }
      featureCollection.features.push(feat);
    }
    this.setState({ max: max });
    this.setState({ featureCollection: featureCollection });
    this.setState({ index2date: dates });
    this.setState({ maxDateLength: dates.length - 1 });
    this.featureToGroupCollection();
  }

  featureToGroupCollection() {
    const groupCollections = {};
    for (let i = 0; i <= 10; i++) {
      let key = i;
      groupCollections[key] = {
        type: "FeatureCollection",
        features: [],
      };
    }
    for (
      let index = 0;
      index < this.state.featureCollection.features.length;
      index++
    ) {
      const element = this.state.featureCollection.features[index];
      if (element.properties.confirmed != 0) {
        element.properties.confirmed = parseFloat(
          Math.log(element.properties.confirmed)
        );
      }
      element.properties.confirmed =
        element.properties.confirmed / this.state.max;
      let groupKey = Math.round(element.properties.confirmed * 10);
      const geoJsonElement = this.state.country2boundary[element.id];
      if (geoJsonElement) {
        groupCollections[groupKey].features.push(geoJsonElement);
      }
    }
    this.setState({ groupCollections: groupCollections });
  }

  prepareBoundaries(geoJson) {
    const collections = {};
    for (let index = 0; index < geoJson.features.length; index++) {
      const element = geoJson.features[index];
      const country = element.properties.ADMIN;
      collections[country] = element;
    }
    return collections;
  }

  getBoundingBox(screenCoords) {
    const maxX = Math.max(screenCoords[0][0], screenCoords[1][0]);
    const minX = Math.min(screenCoords[0][0], screenCoords[1][0]);
    const maxY = Math.max(screenCoords[0][1], screenCoords[1][1]);
    const minY = Math.min(screenCoords[0][1], screenCoords[1][1]);
    return [maxY, maxX, minY, minX];
  }

  loadDataByDate(date) {
    const featureCollection = this.state.featureCollection;
    this.state.max = 0.0;
    for (let index = 0; index < featureCollection.features.length; index++) {
      const element = featureCollection.features[index];
      const countryInfo = covid[element.id];
      element.properties.confirmed = parseFloat(countryInfo[date][0]);
      element.properties.death = parseFloat(countryInfo[date][1]);
      element.properties.recovered = parseFloat(countryInfo[date][2]);

      if (Math.log(element.properties.confirmed) > this.state.max)
        this.state.max = Math.log(element.properties.confirmed);
    }
    this.setState({ featureCollection: featureCollection });
  }

  renderGroup(key, featureCollection, color) {
    return (
      <MapboxGL.ShapeSource key={key} id={`${key}`} shape={featureCollection}>
        <MapboxGL.FillLayer
          id={`${key}-fill`}
          style={{
            fillAntialias: true,
            fillColor: color,
            fillOutlineColor: "black",
            fillOpacity: 0.84,
          }}
        />
      </MapboxGL.ShapeSource>
    );
  }

  renderGroups() {
    console.log("Rendering regional map");
    const shapes = [];
    let k = 0;
    var gradientColors = [];
    for (var n = 0; n <= 11; n++) {
      gradientColors.push(`rgba(${255}, ${0}, ${0}, ${n / 11.0})`);
    }
    for (let key in this.state.groupCollections) {
      const featureCollection = this.state.groupCollections[key];
      if (featureCollection !== undefined) {
        const view = this.renderGroup(
          key,
          featureCollection,
          gradientColors[k]
        );
        shapes.push(view);
        k += 1;
      }
    }
    return shapes;
  }

  renderMap() {
    if (this.state.renderFunction == 0) {
      return this.renderHeatmap();
    } else {
      return this.renderGroups();
    }
  }

  renderHeatmap() {
    console.log("Rendering heatmap");
    return (
      <MapboxGL.ShapeSource
        id="earthquakes"
        shape={this.state.featureCollection}
      >
        <MapboxGL.HeatmapLayer
          id="earthquakes"
          sourceID="earthquakes"
          style={{
            heatmapWeight: [
              "interpolate",
              ["linear"],
              ["get", "confirmed"],
              0,
              1,
              4,
              2,
            ],
            heatmapIntensity: ["interpolate", ["linear"], ["zoom"], 0, 1, 7, 2],
            heatmapColor: [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(33,102,172,0)",
              0.2,
              "rgb(103,169,207)",
              0.4,
              "rgb(209,229,240)",
              0.6,
              "rgb(253,219,199)",
              0.8,
              "rgb(239,138,98)",
              1,
              "rgb(178,24,43)",
            ] /*
           heatmapRadius: [
               'interpolate',
               ['linear'],
               ['zoom'],
               0, 
               40,
               50,
               70
           ],*/,
            heatmapOpacity: ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0],
          }}
        />
      </MapboxGL.ShapeSource>
    );
  }

  getCheckBox(name, status, code, img) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={img}
          style={{ height: 50, width: 50 }}
          resizeMode="contain"
        />
        <RadioButton
          status={status == true ? "checked" : "unchecked"}
          color="#1e88e5"
          onPress={() => {
            if (code == 0) {
              this.setState({ heatmap_checked: true });
              this.setState({ regional_checked: false });
              this.setState({ play: false });
              this.setState({ renderFunction: 0 });
            } else {
              this.setState({ heatmap_checked: false });
              this.setState({ regional_checked: true });
              this.setState({ play: false });
              this.setState({ renderFunction: 1 });
            }
          }}
        />
        <Text style={{ color: "#1e88e5", marginLeft: 30 }}>{name}</Text>
      </View>
    );
  }

  pauseMapEvent() {
    this.setState({ play: false });
  }
  playMapEvent() {
    this.setState({ play: true });
    var refresh_rate = 250;
    var slider_rate = 1;
    if (this.state.renderFunction == 1) {
      slider_rate = 5;
    }
    console.log("refresh rate = " + refresh_rate);
    console.log("render function = " + this.state.renderFunction);
    console.log("slider rate = " + slider_rate);
    this.timer = setInterval(() => {
      if (
        this.state.play == true &&
        this.state.slider_date + slider_rate < this.state.maxDateLength
      ) {
        console.log(this.state.slider_date + " , " + this.state.maxDateLength);
        this.setState({ slider_date: this.state.slider_date + slider_rate });
        this.loadDataByDate(this.state.index2date[this.state.slider_date]);
        if (this.state.renderFunction == 1) {
          console.log("calling feature to group");
          this.featureToGroupCollection();
        }
      } else {
        //console.log("breaking");
        return;
      }
    }, refresh_rate);
  }

  render() {
    const { pick } = this.state;
    return (
      <View style={styles.container}>
        <MapboxGL.MapView
          ref={(c) => (this._map = c)}
          onPress={this.onPress}
          style={{ flex: 1 }}
          styleURL={MapboxGL.StyleURL.Light}
        >
          <MapboxGL.Camera zoomLevel={1} centerCoordinate={[60, 40.723279]} />

          {this.renderMap()}
        </MapboxGL.MapView>
        <SlidingUpPanel
          draggableRange={{ top: 190, bottom: 20 }}
          showBackdrop={false}
          ref={(c) => (this._panel = c)}
        >
          <View
            style={{
              justifyContent: "center",
              backgroundColor: "#fff",
              alignItems: "center",
            }}
          >
            <View style={{ marginTop: 10, marginBottom: 10 }}>
              <View
                style={{
                  borderRadius: 2,
                  backgroundColor: "#90a4ae",
                  width: 100,
                  height: 3,
                }}
              ></View>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginLeft: 30,
                marginRight: 30,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <Slider
                  value={this.state.slider_date}
                  animationType="timing"
                  animateTransitions={true}
                  thumbStyle={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    borderColor: "#1e88e5",
                    borderWidth: 2,
                  }}
                  thumbTintColor="#fff"
                  trackStyle={{ height: 5, borderRadius: 3 }}
                  minimumValue={0}
                  maximumValue={this.state.maxDateLength}
                  minimumTrackTintColor="#42a5f5"
                  style={{ width: 200 }}
                  onValueChange={(value) => {
                    console.log("slider value changed");
                    console.log("Date = " + this.state.index2date[value]);
                    this.loadDataByDate(this.state.index2date[value]);
                    this.featureToGroupCollection();
                    this.setState({
                      slider_date: value,
                    });
                  }}
                  step={1}
                />
              </View>
              <TouchableOpacity
                onPress={this.playMapEvent}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#1e88e5",
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesome name="play" color="#fff" size={15} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.pauseMapEvent}
                style={{
                  width: 40,
                  height: 40,
                  marginLeft: 5,
                  backgroundColor: "#1e88e5",
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesome name="pause" color="#fff" size={15} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: "#1e88e5" }}>
              <FontAwesome name="calendar" size={15} />
              {this.state.index2date[this.state.slider_date]}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginLeft: 30,
                marginRight: 30,
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                }}
              >
                {this.getCheckBox("HEAT", this.state.heatmap_checked, 0, Heat)}
                {this.getCheckBox(
                  "REGIONAL",
                  this.state.regional_checked,
                  1,
                  Regional
                )}
              </View>
              <Picker
                placeholder="SELECT"
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({
                    pick: itemValue,
                  })
                }
                selectedValue={this.state.pick}
                style={{
                  height: 50,
                  width: 180,
                  color: "#1e88e5",
                }}
                itemStyle={{ color: "#1e88e5" }}
              >
                <Picker.Item label="confirmed" value="CONFIRMED" />
                <Picker.Item label="recovered" value="RECOVERED" />
                <Picker.Item label="deaths" value="DEATHS" />
              </Picker>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                width: 300,
              }}
            ></View>
          </View>
        </SlidingUpPanel>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  panel: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
  },
});
