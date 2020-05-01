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

export default class StaticsPage extends React.Component {
  state = {
    selected_filter: criterias.confirmedRate, // sets the current filtering parameter on the graph
    graph_label: [""],
    data_set: [0],
    searchedCountry: "Ethiopia",
    TotalStatisticsData: [],
    StatisticsData: {},
    Confirmed: 0,
    Death: 0,
    Recovered: 0,
    Total: 0,
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
    totalLoading: true,
  };

  componentDidMount() {
    this.GetTotalData();
    let interval = setInterval(() => {
      this.fetchStatistics();
    }, 1000);
    let interval2 = setInterval(() => {
      this.GetTotalData();
    }, 1000);
  }
  componentWillMount() {
    this.state.totalLoading = true;
  }

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

  fetchStatistics() {
    fetch(
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
        this.populate(json);

        this.forceUpdate();
      })
      .catch((error) => {
        alert("Couldn't connect", "Error in connection..");
      });
  }

  dateConverter(date) {
    let dateList = date.split("-");
    let month = parseInt(dateList[1]);
    let monthInWord = this.state.Months[month - 1];
    return monthInWord + " " + dateList[2];
  }

  GetTotalData = async () => {
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
          console.log(this.state.TotalStatisticsData);
        }
      })
      .catch((error) => {
        alert("Couldn't connect", "Error in connection..");
      });
  };

  render() {
    const HIEGHT = Dimensions.get("window").height;
    return (
      <ScrollView>
        <SafeAreaView>
          <View style={styles.container}>
            <View>
              <SearchBar
                round
                searchIcon={{ size: 24 }}
                onChangeText={(searchedCountry) =>
                  this.setState({ searchedCountry })
                }
                placeholder="Type country name"
                value={this.state.searchedCountry}
                inputContainerStyle={{
                  borderRadius: 20,
                  margin: -2,
                  width: Dimensions.get("window").width - 40,
                }}
                containerStyle={{
                  borderRadius: 15,
                  margin: -2,
                }}
                inputStyle={{
                  color: "white",
                }}
              />
              <View>
                <Text
                  style={{
                    fontSize: 25,
                    margin: 10,
                  }}
                >
                  {this.state.searchedCountry}'s Statistics
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity style={styles.cards_total} disabled={true}>
                    <Text style={styles.cards_header}>Total</Text>
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

                  <TouchableOpacity style={styles.cards_active} disabled={true}>
                    <Text style={styles.cards_header}>Recovered</Text>
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
                  <TouchableOpacity style={styles.cards_death} disabled={true}>
                    <Text style={styles.cards_header}>Death</Text>
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
                  margin: 10,
                }}
              >
                {this.state.searchedCountry}'s Statistics
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

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={
                  this.state.selected_filter === criterias.confirmedRate
                    ? styles.touchable_buttons
                    : styles.touchable_buttons_pressed
                }
                onPress={() => {
                  this.setState({
                    selected_filter: criterias.confirmedRate,
                  });
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
                onPress={() => {
                  this.setState({
                    selected_filter: criterias.recoveryRate,
                  });
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
                onPress={() => {
                  this.setState({
                    selected_filter: criterias.deathRate,
                  });
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
              {/* 
              <TouchableOpacity
                style={
                  this.state.selected_filter === criterias.numberOfTests
                    ? styles.touchable_buttons
                    : styles.touchable_buttons_pressed
                }
                onPress={() => {
                  this.setState({
                    selected_filter: criterias.numberOfTests,
                  });
                }}
              >
                <Text
                  style={
                    this.state.selected_filter === criterias.numberOfTests
                      ? styles.text_style
                      : styles.text_style_pressed
                  }
                >
                  Testes performed
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    ); // end of return
  } // end of render function
} // end of class StaticsPage

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  cards_total: {
    backgroundColor: "#54E8FF",
    borderRadius: 20,
    height: Dimensions.get("window").height / 10,
    width: Dimensions.get("window").width / 2 - 30,
    margin: 10,
    marginTop: 30,
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
    backgroundColor: "#00a1b0",
    borderRadius: 20,
    height: Dimensions.get("window").height / 10,
    width: Dimensions.get("window").width / 2 - 30,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cards_death: {
    backgroundColor: "#bf00b0",
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
    alignItems: "center",
    justifyContent: "center",
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
