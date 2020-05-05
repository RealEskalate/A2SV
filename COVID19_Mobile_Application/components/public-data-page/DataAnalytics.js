import React from "react";
import { SearchBar } from "react-native-elements";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import * as criterias from "./Criterias.js";

import SearchableDropdown from "react-native-searchable-dropdown";
export default class StaticsPage extends React.Component {
  state = {
    selected_filter: criterias.confirmedRate, // sets the current filtering parameter on the graph
    graph_label: [""],
    data_set: [0],
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

  componentDidMount() {
    this.GetTotalData();
    this.fetchStatistics();
    this.getCountryList();
  }
  //Populates data in to our state
  populate(objList) {
    let dataSet_counter = 0;
    objList.map((data) => {
      this.state.data_set[dataSet_counter] = data.y;
      dataSet_counter += 1;
    });
    let graphLebel_counter = 0;
    objList.map((data) => {
      this.state.graph_label[graphLebel_counter] = this.dateConverter(
        data.t.split("T")[0]
      );
      graphLebel_counter += 1;
    });
  }

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
      .then((json) => {
        if (json !== undefined && json.length !== 0) {
          this.populate(json);

          this.forceUpdate();
        } else {
          console.log("Statistics " + json);
          newThis.fetchStatistics();
        }
      })
      .catch((error) => {
        alert("Couldn't connect", "Error in connection..");
      });
  };
  //Converts data in to appropriate format
  dateConverter(date) {
    let dateList = date.split("-");
    let month = parseInt(dateList[1]);
    let monthInWord = this.state.Months[month - 1];
    return monthInWord + " " + dateList[2];
  }
  //get total numbers of the specified country
  GetTotalData = async () => {
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
      .then((json) => {
        if (json !== undefined && json.length !== 0) {
          this.setState({
            TotalStatisticsData: json,
            totalLoading: false,
          });
        } else {
          console.log("Total data" + json);
          newThis.GetTotalData();
        }
      })
      .catch((error) => {
        alert("Couldn't connect", "Error in connection..");
      });
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
      .then((json) => {
        if (json !== undefined && json.length !== 0) {
          this.setState({
            countries: json,
          });
        } else {
          console.log("Total data" + json);
          newThis.getCountryList();
        }
      })
      .catch((error) => {
        alert("Couldn't connect", "Error in connection..");
      });
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
            this.GetTotalData();
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
          <SafeAreaView>
            <View style={styles.container}>
              <View>
                <View>
                  <Text
                    style={{
                      fontSize: 25,
                      textAlign: "center",
                    }}
                  >
                    Total Statistics
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={styles.cards_total}
                      disabled={true}
                    >
                      <Text style={styles.cards_header}>New Cofirmed</Text>
                      {this.state.totalLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.cards_content}>
                          {this.state.TotalStatisticsData[
                            this.state.TotalStatisticsData.length - 1
                          ].Confirmed -
                            this.state.TotalStatisticsData[
                              this.state.TotalStatisticsData.length - 2
                            ].Confirmed}
                        </Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cards_total}
                      disabled={true}
                    >
                      <Text style={styles.cards_header}>Total Cofirmed</Text>
                      {this.state.totalLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.cards_content}>
                          {
                            this.state.TotalStatisticsData[
                              this.state.TotalStatisticsData.length - 1
                            ].Confirmed
                          }
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={styles.cards_recovered}
                      disabled={true}
                    >
                      <Text style={styles.cards_header}>New Recovered</Text>
                      {this.state.totalLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.cards_content}>
                          {this.state.TotalStatisticsData[
                            this.state.TotalStatisticsData.length - 1
                          ].Recovered -
                            this.state.TotalStatisticsData[
                              this.state.TotalStatisticsData.length - 2
                            ].Recovered}
                        </Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cards_recovered}
                      disabled={true}
                    >
                      <Text style={styles.cards_header}>Total Recovered</Text>
                      {this.state.totalLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.cards_content}>
                          {
                            this.state.TotalStatisticsData[
                              this.state.TotalStatisticsData.length - 1
                            ].Recovered
                          }
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={styles.cards_death}
                      disabled={true}
                    >
                      <Text style={styles.cards_header}>New Death</Text>
                      {this.state.totalLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.cards_content}>
                          {this.state.TotalStatisticsData[
                            this.state.TotalStatisticsData.length - 1
                          ].Deaths -
                            this.state.TotalStatisticsData[
                              this.state.TotalStatisticsData.length - 2
                            ].Deaths}
                        </Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cards_death}
                      disabled={true}
                    >
                      <Text style={styles.cards_header}>Total Death</Text>
                      {this.state.totalLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.cards_content}>
                          {
                            this.state.TotalStatisticsData[
                              this.state.TotalStatisticsData.length - 1
                            ].Deaths
                          }
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.container_graph}>
                <Text
                  style={{
                    fontSize: 25,
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  Statistics Rate
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
                    decimalPlaces: 1, // optional, defaults to 2dp
                    color: (opacity = 0) => `rgba(255, 266, 255, ${opacity})`,
                    style: {
                      borderRadius: 0,
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 0,
                  }}
                />
              </View>

              <View style={{ flexDirection: "row", marginBottom: 80 }}>
                <TouchableOpacity
                  style={
                    this.state.selected_filter === criterias.confirmedRate
                      ? styles.touchable_buttons
                      : styles.touchable_buttons_pressed
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter: criterias.confirmedRate,
                    });
                    this.fetchStatistics();
                  }}
                >
                  <Text
                    style={
                      this.state.selected_filter === criterias.confirmedRate
                        ? styles.text_style
                        : styles.text_style_pressed
                    }
                  >
                    Confirmed
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    this.state.selected_filter === criterias.recoveryRate
                      ? styles.touchable_buttons
                      : styles.touchable_buttons_pressed
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter: criterias.recoveryRate,
                    });
                    this.fetchStatistics();
                  }}
                >
                  <Text
                    style={
                      this.state.selected_filter === criterias.recoveryRate
                        ? styles.text_style
                        : styles.text_style_pressed
                    }
                  >
                    Recovered
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    this.state.selected_filter === criterias.deathRate
                      ? styles.touchable_buttons
                      : styles.touchable_buttons_pressed
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter: criterias.deathRate,
                    });
                    this.fetchStatistics();
                  }}
                >
                  <Text
                    style={
                      this.state.selected_filter === criterias.deathRate
                        ? styles.text_style
                        : styles.text_style_pressed
                    }
                  >
                    Death
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    ); // end of return
  } // end of render function
} // end of class StaticsPage

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
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
  cards_header: {
    fontSize: 20,

    color: "white",
  },
  cards_content: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  container_graph: {
    marginTop: 10,
  },
  touchable_buttons: {
    backgroundColor: "#0080ff",
    padding: 5,
    marginRight: 5,
    marginBottom: 10,
    borderRadius: 10,
    padding: 5,
  },
  touchable_buttons_pressed: {
    backgroundColor: "#F5F6FA",
    padding: 5,
    marginRight: 5,
  },
  text_style: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  text_style_pressed: {
    color: "#0080ff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
