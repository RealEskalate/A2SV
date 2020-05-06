import React from "react";
import { SearchBar } from "react-native-elements";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import * as criterias from "./Criterias";

import SearchableDropdown from "react-native-searchable-dropdown";
export default class DataAnalytics extends React.Component {
  state = {
    selected_filter: criterias.recoveries, // sets the current filtering parameter on the graph
    graph_label: [""],
    data_set: [0],
    daily_newCases_label: [""],
    daily_newCases_data_set: [0],
    searchedCountry: "World",
    TotalStatisticsData: [],
    StatisticsData: {},
    search: "World",
    Months: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    countries: [],
    totalLoading: true,
  };

  componentDidMount = async () => {
    await this.getTotalData()
      .then(async () => {
        await this.fetchStatistics();
        this.fetchDailyNewsCases();
      })
      .then(this.getCountryList())
      .catch((error) => {
        Alert.alert("Concurrency Issue");
      });
  };

  //Populates data in to our state
  populate = (objList) => {
    let dataSet_counter = 0;
    objList.map((data) => {
      this.state.data_set[dataSet_counter] =
        data.y / this.state.TotalStatisticsData[dataSet_counter].Confirmed;
      dataSet_counter += 1;
    });
    let graphLebel_counter = 0;
    objList.map((data) => {
      this.state.graph_label[graphLebel_counter] = this.dateConverter(
        data.t.split("T")[0]
      );
      graphLebel_counter += 1;
    });
  };
  //gets statistics data based on selected criteria and populate UI
  fetchStatistics = async () => {
    let newThis = this;
    await fetch(
      "https://sym-track.herokuapp.com/api/statistics?criteria=" +
        this.state.selected_filter +
        "&country=" +
        this.state.searchedCountry.toLowerCase(),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json !== undefined && json.length !== 0) {
          await newThis.populate(json);
          newThis.forceUpdate(); //refresh page
        } else {
          newThis.fetchStatistics();
        }
      })
      .catch((error) => {
        Alert.alert("Couldn't connect", "Error in connection..");
      });
    console.log(2);
  };
  //Converts date in to appropriate format
  dateConverter(date) {
    let dateList = date.split("-");
    let month = parseInt(dateList[1]);
    let monthInWord = this.state.Months[month - 1];
    return monthInWord + " " + dateList[2];
  }
  //get total numbers of the specified country and populate UI
  getTotalData = async () => {
    this.setState({
      totalLoading: true,
    });
    let newThis = this;
    await fetch(
      "https://sym-track.herokuapp.com/api/statistics?criteria=All&country=" +
        this.state.searchedCountry.toLowerCase(),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json !== undefined && json.length !== 0) {
          await newThis.setState({
            TotalStatisticsData: json,
            totalLoading: false,
          });
          newThis.forceUpdate(); //refresh page
        } else {
          newThis.getTotalData();
        }
      })
      .catch((error) => {
        Alert.alert("Couldn't connect - getTotalData", "Error in connection..");
      });
    console.log(1);
  };
  //fetch list of countries available
  getCountryList = async () => {
    let newThis = this;
    await fetch("https://sym-track.herokuapp.com/api/statistics/countries", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json !== undefined && json.length !== 0) {
          await newThis.setState({
            countries: json,
          });
        } else {
          newThis.getCountryList();
        }
      })
      .catch((error) => {
        Alert.alert("Couldn't connect", "Error in connection..");
      });
  };
  //fetch daily new cases reported
  fetchDailyNewsCases = async () => {
    console.log(3);
    for (
      let dataSet_counter = 1;
      dataSet_counter < this.state.TotalStatisticsData.length;
      dataSet_counter += 1
    ) {
      {
        this.state.daily_newCases_data_set[dataSet_counter - 1] =
          this.state.TotalStatisticsData[dataSet_counter].Confirmed -
          this.state.TotalStatisticsData[dataSet_counter - 1].Confirmed;
      }
    }

    for (
      let graphLebel_counter = 1;
      graphLebel_counter < this.state.graph_label.length;
      graphLebel_counter += 1
    ) {
      this.state.daily_newCases_label[
        graphLebel_counter - 1
      ] = this.state.graph_label[graphLebel_counter];
    }
    this.forceUpdate();
  };

  render() {
    const HIEGHT = Dimensions.get("window").height;
    return (
      <View>
        <SearchableDropdown
          onTextChange={(text) => {
            this.setState({ search: text });
          }}
          onItemSelect={async (item) => {
            await this.setState({
              searchedCountry: item.slug,
              search: item.name,
            });
            this.getTotalData();
            this.fetchStatistics();
          }}
          containerStyle={{ padding: 5 }}
          textInputStyle={{
            padding: 12,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
          }}
          itemStyle={{
            padding: 10,
            marginTop: 2,
            backgroundColor: "#fff",
            borderColor: "#bbb",
            borderWidth: 1,
          }}
          itemTextStyle={{ color: "#000" }}
          items={this.state.countries}
          defaultIndex={0}
          placeholder={this.state.search}
          resetValue={false}
          underlineColorAndroid="transparent"
        />

        <ScrollView>
          <View style={styles.container}>
            <View
              style={{
                alignContent: "flex-start",
                justifyContent: "flex-start",
                margin: 10,
                width: Dimensions.get("window").width - 20,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Case Update
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get("screen").width - 10,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginBottom: 20,
                backgroundColor: "white",
                borderRadius: 20,
                padding: 10,
              }}
            >
              <TouchableOpacity
                disabled={true}
                style={{ alignItems: "center" }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20 / 2,
                    margin: 5,
                    borderColor: "gray",
                    borderWidth: 3,
                  }}
                ></View>

                {this.state.totalLoading ? (
                  <ActivityIndicator size="small" color="gray" />
                ) : (
                  <Text style={{ fontSize: 24, color: "gray" }}>
                    {this.state.TotalStatisticsData[
                      this.state.TotalStatisticsData.length - 1
                    ].Confirmed -
                      this.state.TotalStatisticsData[
                        this.state.TotalStatisticsData.length - 2
                      ].Confirmed}
                  </Text>
                )}
                <Text>New Cofirmed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={true}
                style={{ alignItems: "center" }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20 / 2,
                    margin: 5,
                    borderColor: "green",
                    borderWidth: 3,
                  }}
                ></View>

                {this.state.totalLoading ? (
                  <ActivityIndicator size="small" color="green" />
                ) : (
                  <Text style={{ fontSize: 24, color: "green" }}>
                    {this.state.TotalStatisticsData[
                      this.state.TotalStatisticsData.length - 1
                    ].Recovered -
                      this.state.TotalStatisticsData[
                        this.state.TotalStatisticsData.length - 2
                      ].Recovered}
                  </Text>
                )}
                <Text>New Recovered</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={true}
                style={{ alignItems: "center" }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20 / 2,
                    margin: 5,
                    borderColor: "red",
                    borderWidth: 3,
                  }}
                ></View>

                {this.state.totalLoading ? (
                  <ActivityIndicator size="small" color="red" />
                ) : (
                  <Text style={{ fontSize: 24, color: "red" }}>
                    {this.state.TotalStatisticsData[
                      this.state.TotalStatisticsData.length - 1
                    ].Deaths -
                      this.state.TotalStatisticsData[
                        this.state.TotalStatisticsData.length - 2
                      ].Deaths}
                  </Text>
                )}
                <Text>New Death</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignContent: "flex-start",
                justifyContent: "flex-start",
                margin: 10,
                width: Dimensions.get("window").width - 20,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Total Data
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get("screen").width,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginBottom: 20,
                backgroundColor: "white",
                borderRadius: 20,
                padding: 10,
              }}
            >
              <TouchableOpacity
                disabled={true}
                style={{ alignItems: "center" }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20 / 2,
                    margin: 5,
                    borderColor: "gray",
                    borderWidth: 3,
                  }}
                ></View>

                {this.state.totalLoading ? (
                  <ActivityIndicator size="small" color="gray" />
                ) : (
                  <Text style={{ fontSize: 24, color: "gray" }}>
                    {
                      this.state.TotalStatisticsData[
                        this.state.TotalStatisticsData.length - 1
                      ].Confirmed
                    }
                  </Text>
                )}
                <Text>Total Cofirmed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={true}
                style={{ alignItems: "center" }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20 / 2,
                    margin: 5,
                    borderColor: "green",
                    borderWidth: 3,
                  }}
                ></View>

                {this.state.totalLoading ? (
                  <ActivityIndicator size="small" color="green" />
                ) : (
                  <Text style={{ fontSize: 24, color: "green" }}>
                    {
                      this.state.TotalStatisticsData[
                        this.state.TotalStatisticsData.length - 1
                      ].Recovered
                    }
                  </Text>
                )}
                <Text>Total Recovered</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={true}
                style={{ alignItems: "center" }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20 / 2,
                    margin: 5,
                    borderColor: "red",
                    borderWidth: 3,
                  }}
                ></View>

                {this.state.totalLoading ? (
                  <ActivityIndicator size="small" color="red" />
                ) : (
                  <Text style={{ fontSize: 24, color: "red" }}>
                    {
                      this.state.TotalStatisticsData[
                        this.state.TotalStatisticsData.length - 1
                      ].Deaths
                    }
                  </Text>
                )}
                <Text>Total Death</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.container_graph}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}
              >
                Daily New Cases
              </Text>
              <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                Country : {this.state.searchedCountry}
              </Text>

              <LineChart
                data={{
                  labels: this.state.daily_newCases_label,
                  datasets: [{ data: this.state.daily_newCases_data_set }],
                }}
                width={Dimensions.get("window").width} // from react-native
                height={HIEGHT / 2}
                chartConfig={{
                  backgroundColor: "#0080ff",
                  backgroundGradientFrom: "#0080ff",
                  backgroundGradientTo: "#0080ff",
                  scrollableDotFill: "#ffffff",

                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 0) => `rgba(255, 266, 255, ${opacity})`,
                  style: {
                    borderRadius: 10,
                  },
                }}
                bezier
                style={{
                  margin: 5,
                  borderRadius: 10,
                }}
              />
            </View>

            <View style={styles.container_graph}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}
              >
                Recovered Rate vs Death Rate
              </Text>
              <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                Country : {this.state.searchedCountry}
              </Text>
              <LineChart
                data={{
                  labels: this.state.graph_label,
                  datasets: [{ data: this.state.data_set }],
                }}
                width={Dimensions.get("window").width} // from react-native
                height={HIEGHT / 2}
                chartConfig={{
                  backgroundColor: "#0080ff",
                  backgroundGradientFrom: "#0080ff",
                  backgroundGradientTo: "#0080ff",
                  scrollableDotFill: "#ffffff",

                  decimalPlaces: 3, // optional, defaults to 2dp
                  color: (opacity = 0) => `rgba(255, 266, 255, ${opacity})`,
                  style: {
                    borderRadius: 10,
                  },
                }}
                bezier
                style={{
                  margin: 5,
                  borderRadius: 10,
                }}
              />
            </View>

            <View style={{ flexDirection: "row", marginBottom: 80 }}>
              <TouchableOpacity
                style={
                  this.state.selected_filter === criterias.recoveries
                    ? styles.touchable_buttons
                    : styles.touchable_buttons_pressed
                }
                onPress={async () => {
                  await this.setState({
                    selected_filter: criterias.recoveries,
                  });
                  this.fetchStatistics();
                }}
              >
                <Text
                  style={
                    this.state.selected_filter === criterias.recoveries
                      ? styles.text_style
                      : styles.text_style_pressed
                  }
                >
                  Recovered
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  this.state.selected_filter === criterias.deaths
                    ? styles.touchable_buttons
                    : styles.touchable_buttons_pressed
                }
                onPress={async () => {
                  await this.setState({
                    selected_filter: criterias.deaths,
                  });
                  this.fetchStatistics();
                }}
              >
                <Text
                  style={
                    this.state.selected_filter === criterias.deaths
                      ? styles.text_style
                      : styles.text_style_pressed
                  }
                >
                  Death
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    ); // end of return
  } // end of render function
} // end of class StaticsPage

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },
  cards_total: {
    backgroundColor: "#fc2314",
    borderRadius: 20,
    height: Dimensions.get("window").height / 10,
    width: Dimensions.get("window").width / 2 - 30,
    margin: 10,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cards_active: {
    backgroundColor: "#4da6ff",
    borderRadius: 20,
    height: Dimensions.get("window").height / 10,
    width: Dimensions.get("window").width / 2 - 30,
    margin: 10,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  cards_recovered: {
    backgroundColor: "#40cc2a",
    borderRadius: 20,
    marginTop: 15,
    height: Dimensions.get("window").height / 10,
    width: Dimensions.get("window").width / 2 - 30,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cards_death: {
    backgroundColor: "#514443",
    borderRadius: 20,
    height: Dimensions.get("window").height / 10,
    width: Dimensions.get("window").width / 2 - 30,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  container_graph: {
    marginTop: 10,
  },
  touchable_buttons: {
    backgroundColor: "#1976d2",
    padding: 5,
    marginRight: 5,
    marginBottom: 10,
    borderRadius: 10,
  },
  touchable_buttons_pressed: {
    backgroundColor: "#F5F6FA",
    padding: 5,
    marginRight: 5,
    marginBottom: 10,
    borderRadius: 10,
  },
  text_style: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  text_style_pressed: {
    color: "#1976d2",
    fontSize: 15,
    fontWeight: "bold",
  },
});
