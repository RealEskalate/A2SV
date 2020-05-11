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
import { LineChart, BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import * as criterias from "./Criterias";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DatePicker from "react-native-datepicker";
import { ApplicationProvider, Datepicker, Layout } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import SearchableDropdown from "react-native-searchable-dropdown";
import userIDStore from "../data-management/user-id-data/userIDStore";

class DataAnalytics extends React.Component {
  state = {
    selected_filter: criterias.confirmed, // sets the current filtering parameter on the graph
    selected_filter_daily_status: criterias.confirmed,
    selected_filter_rate: criterias.recoveryRate,
    selected_daily_start_date: "",
    selected_daily_end_date: "",
    selected_total_start_date: "",
    selected_total_end_date: "",
    selected_rate_start_date: "",
    selected_rate_end_date: "",
    graph_label: [""],
    data_set: [0],
    daily_newCases_label: [""],
    daily_newCases_data_set: [0],
    rate_label: [""],
    rate_data_set: [0],
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
    testCountDataExist: false,
  };

  componentDidMount = async () => {
    await this.getTotalData()
      .then(this.fetchStatistics())
      .then(this.fetchDailyNewsCases())
      .then(this.fetchRateStatistics())
      .then(this.getCountryList())
      .then(this.checkIfDataExist(criterias.numberOfTests)) //check if number of test case data exist
      .catch((error) => {
        Alert.alert("Concurrency Issue");
      });
  };

  //gets statistics data based on selected criteria and populate UI
  fetchStatistics = async () => {
    let newThis = this;
    var query =
      this.state.selected_total_start_date.length > 1 &&
      this.state.selected_total_end_date.length > 1
        ? "https://sym-track.herokuapp.com/api/statistics?criteria=" +
          this.state.selected_filter +
          "&country=" +
          this.state.searchedCountry +
          "&start_date=" +
          this.state.selected_total_start_date +
          "&end_date=" +
          this.state.selected_total_end_date
        : "https://sym-track.herokuapp.com/api/statistics?criteria=" +
          this.state.selected_filter +
          "&country=" +
          this.state.searchedCountry;
    await fetch(query, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
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
        Alert.alert("Connection problem", "Couldn't connect to server");
      });
  };
  //gets rate statistics data based on selected criteria and populate UI
  fetchRateStatistics = async () => {
    let newThis = this;
    var query =
      this.state.selected_rate_start_date.length > 1 &&
      this.state.selected_rate_end_date.length > 1
        ? "https://sym-track.herokuapp.com/api/statistics?criteria=" +
          this.state.selected_filter_rate +
          "&country=" +
          this.state.searchedCountry +
          "&start_date=" +
          this.state.selected_rate_start_date +
          "&end_date=" +
          this.state.selected_rate_end_date
        : "https://sym-track.herokuapp.com/api/statistics?criteria=" +
          this.state.selected_filter_rate +
          "&country=" +
          this.state.searchedCountry;
    await fetch(query, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json !== undefined && json.length !== 0) {
          await newThis.populateRateData(json);
          newThis.forceUpdate(); //refresh page
        } else {
          newThis.fetchRateStatistics();
        }
      })
      .catch((error) => {
        Alert.alert("Connection problem", "Couldn't connect to server");
      });
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
        this.state.searchedCountry,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + userIDStore.getState().userToken,
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
        Alert.alert("Connection Problem", "Couldn't connect to server");
      });
  };
  //fetch list of countries available
  getCountryList = async () => {
    let newThis = this;
    await fetch("https://sym-track.herokuapp.com/api/statistics/countries", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
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
        Alert.alert("Connection problem", "Couldn't connect to server");
      });
  };
  //fetch daily new cases reported
  fetchDailyNewsCases = async () => {
    let newThis = this;
    var query =
      this.state.selected_daily_start_date.length > 1 &&
      this.state.selected_daily_end_date.length > 1
        ? "https://sym-track.herokuapp.com/api/statistics?criteria=" +
          this.state.selected_filter_daily_status +
          "&country=" +
          this.state.searchedCountry +
          "&start_date=" +
          this.state.selected_daily_start_date +
          "&end_date=" +
          this.state.selected_daily_end_date +
          "&daily=true"
        : "https://sym-track.herokuapp.com/api/statistics?criteria=" +
          this.state.selected_filter_daily_status +
          "&country=" +
          this.state.searchedCountry +
          "&daily=true";
    await fetch(query, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json !== undefined && json.length !== 0) {
          await newThis.populateDailyData(json);
          newThis.forceUpdate(); //refresh page
        } else {
          newThis.fetchDailyNewsCases();
        }
      })
      .catch((error) => {
        Alert.alert("Connection problem", "Couldn't connect to server");
      });
  };
  //populate daily data
  populateDailyData = (objList) => {
    this.state.daily_newCases_label = [""]; //reseting all data point labels
    this.state.daily_newCases_data_set = [0]; //reseting all data point labels

    let dataSet_counter = 0;

    objList.map((data) => {
      this.state.daily_newCases_data_set[dataSet_counter] = data.y;
      dataSet_counter += 1;
    });
    //generating interval
    let graphLebel_counter = 0;
    var interval = Math.floor(objList.length / 5);
    var remainder = objList.length % 5;
    if (interval === 0) {
      interval = 1;
      remainder = 0;
    }
    while (graphLebel_counter < objList.length) {
      this.state.daily_newCases_label[graphLebel_counter] = this.dateConverter(
        objList[graphLebel_counter].t.split("T")[0]
      );
      if (
        remainder > 0 &&
        graphLebel_counter + remainder - 1 === objList.length
      ) {
        graphLebel_counter += remainder - 1;
        continue;
      }
      graphLebel_counter += interval;
    }
  };
  //Populates statistics data in to our state
  populate = (objList) => {
    this.state.graph_label = [""]; //reseting data label
    this.state.data_set = [0]; // reseting data set

    let dataSet_counter = 0;
    objList.map((data) => {
      this.state.data_set[dataSet_counter] = data.y;
      dataSet_counter += 1;
    });

    //generating interval
    let graphLebel_counter = 1;
    let indexCounter = 0;
    var interval = Math.floor(objList.length / 5);
    var remainder = objList.length % 5;
    if (interval === 0) {
      interval = 1;
      remainder = 0;
    }
    while (graphLebel_counter < objList.length) {
      this.state.graph_label[indexCounter] = this.dateConverter(
        objList[graphLebel_counter].t.split("T")[0]
      );
      indexCounter += 1;
      if (
        remainder > 0 &&
        graphLebel_counter + remainder - 1 === objList.length
      ) {
        graphLebel_counter += remainder - 1;
        continue;
      }
      graphLebel_counter += interval;
    }
  };
  //populate daily data
  populateRateData = (objList) => {
    this.state.rate_label = [""]; //reseting all data point labels
    this.state.rate_data_set = [0]; //reseting all data point labels

    let dataSet_counter = 0;
    let previousStat = 0;
    let indexCounterDataSet = 0;
    objList.map((data) => {
      this.state.rate_data_set[dataSet_counter] = data.y;
      dataSet_counter += 1;
    });

    let graphLebel_counter = 0;

    //generating interval
    var interval = Math.floor(objList.length / 5);
    var remainder = objList.length % 5;
    if (interval === 0) {
      interval = 1;
      remainder = 0;
    }
    while (graphLebel_counter < objList.length) {
      this.state.rate_label[graphLebel_counter] = this.dateConverter(
        objList[graphLebel_counter].t.split("T")[0]
      );
      if (
        remainder > 0 &&
        graphLebel_counter + remainder - 1 === objList.length
      ) {
        graphLebel_counter += remainder - 1;
        continue;
      }
      graphLebel_counter += interval;
    }
  };
  //Reformat number
  reformatNumber(nStr) {
    var x = nStr.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  }
  //Reformat numbers with large number suffix
  intToString(value) {
    let newValue = value;
    const suffixes = ["", "K", "M", "B", "T"];
    let suffixNum = 0;
    while (newValue >= 1000) {
      newValue /= 1000;
      suffixNum++;
    }

    newValue = newValue.toPrecision(3);

    newValue += suffixes[suffixNum];
    return newValue;
  }
  //Check if test count data is available
  checkIfDataExist(filterCriteria) {
    let newThis = this;
    newThis.setState({
      testCountDataExist: false,
    });
    var query =
      this.state.selected_daily_start_date.length > 1 &&
      this.state.selected_daily_end_date.length > 1
        ? "https://sym-track.herokuapp.com/api/statistics?criteria=" +
          filterCriteria +
          "&country=" +
          this.state.searchedCountry +
          "&start_date=" +
          this.state.selected_daily_start_date +
          "&end_date=" +
          this.state.selected_daily_end_date +
          "&daily=true"
        : "https://sym-track.herokuapp.com/api/statistics?criteria=" +
          filterCriteria +
          "&country=" +
          this.state.searchedCountry +
          "&daily=true";
    fetch(query, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json.length);
        if (json.length > 0) {
          newThis.setState({
            testCountDataExist: true,
          });
        }
        newThis.forceUpdate(); //refresh page
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const HIEGHT = Dimensions.get("window").height;
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <SearchableDropdown
            onTextChange={(text) => {
              this.setState({ search: text });
            }}
            onItemSelect={async (item) => {
              await this.setState({
                searchedCountry: item.slug,
                search: item.name,
              });
              this.componentDidMount();
            }}
            containerStyle={{ padding: 5, flex: 6 }}
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
          <TouchableOpacity
            style={{ margin: 10, flex: 1 }}
            onPress={() => this.componentDidMount()}
          >
            <MaterialCommunityIcons name="reload" color="#0080ff" size={30} />
            <Text>Refresh</Text>
          </TouchableOpacity>
        </View>

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
                    {this.reformatNumber(
                      String(
                        this.state.TotalStatisticsData[
                          this.state.TotalStatisticsData.length - 1
                        ].Confirmed -
                          this.state.TotalStatisticsData[
                            this.state.TotalStatisticsData.length - 2
                          ].Confirmed
                      )
                    )}
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
                    {this.reformatNumber(
                      String(
                        this.state.TotalStatisticsData[
                          this.state.TotalStatisticsData.length - 1
                        ].Recovered -
                          this.state.TotalStatisticsData[
                            this.state.TotalStatisticsData.length - 2
                          ].Recovered
                      )
                    )}
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
                    {this.reformatNumber(
                      String(
                        this.state.TotalStatisticsData[
                          this.state.TotalStatisticsData.length - 1
                        ].Deaths -
                          this.state.TotalStatisticsData[
                            this.state.TotalStatisticsData.length - 2
                          ].Deaths
                      )
                    )}
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
                    {this.reformatNumber(
                      String(
                        this.state.TotalStatisticsData[
                          this.state.TotalStatisticsData.length - 1
                        ].Confirmed
                      )
                    )}
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
                    {this.reformatNumber(
                      String(
                        this.state.TotalStatisticsData[
                          this.state.TotalStatisticsData.length - 1
                        ].Recovered
                      )
                    )}
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
                    {this.reformatNumber(
                      String(
                        this.state.TotalStatisticsData[
                          this.state.TotalStatisticsData.length - 1
                        ].Deaths
                      )
                    )}
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
                Country : {this.state.search}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 10,
                  marginTop: 5,
                  alignSelf: "center",
                }}
              >
                <View style={{ flexDirection: "row", marginRight: 20 }}>
                  <DatePicker
                    date={this.state.selected_daily_start_date}
                    mode="date" //The enum of date, datetime and
                    placeholder="Select start date"
                    format="YYYY-MM-DD"
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                        borderRadius: 20,
                        height: 30,
                      },
                    }}
                    onDateChange={(date) => {
                      this.setState({ selected_daily_start_date: date });
                    }}
                  />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <DatePicker
                    date={this.state.selected_daily_end_date}
                    mode="date" //The enum of date, datetime and time
                    placeholder="Select end date"
                    format="YYYY-MM-DD"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                        borderRadius: 20,
                        height: 30,
                      },
                    }}
                    onDateChange={async (date) => {
                      await this.setState({ selected_daily_end_date: date });
                      this.fetchDailyNewsCases();
                    }}
                  />
                </View>
              </View>

              <BarChart
                data={{
                  labels: this.state.daily_newCases_label,
                  datasets: [
                    {
                      data: this.state.daily_newCases_data_set,
                    },
                  ],
                }}
                verticalLabelRotation={30}
                width={Dimensions.get("window").width} // from react-nativ
                height={HIEGHT / 2}
                formatYLabel={(Y) => this.intToString(Number(Y))}
                fromZero={true}
                chartConfig={{
                  backgroundColor: "#0080ff",
                  backgroundGradientFrom: "#0080ff",
                  backgroundGradientTo: "#0080ff",
                  scrollableDotFill: "#ffffff",
                  decimalPlaces: 0,
                  barPercentage: 0.1,
                  fillShadowGradient: "#ffffff",
                  fillShadowGradientOpacity: 0.4,
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

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={
                  this.state.selected_filter_daily_status ===
                  criterias.confirmed
                    ? styles.touchable_buttons
                    : styles.touchable_buttons_pressed
                }
                onPress={async () => {
                  await this.setState({
                    selected_filter_daily_status: criterias.confirmed,
                  });
                  this.fetchDailyNewsCases();
                }}
              >
                <Text
                  style={
                    this.state.selected_filter_daily_status ===
                    criterias.confirmed
                      ? styles.text_style
                      : styles.text_style_pressed
                  }
                >
                  Confirmed
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  this.state.selected_filter_daily_status ===
                  criterias.recoveries
                    ? styles.touchable_buttons
                    : styles.touchable_buttons_pressed
                }
                onPress={async () => {
                  await this.setState({
                    selected_filter_daily_status: criterias.recoveries,
                  });
                  this.fetchDailyNewsCases();
                }}
              >
                <Text
                  style={
                    this.state.selected_filter_daily_status ===
                    criterias.recoveries
                      ? styles.text_style
                      : styles.text_style_pressed
                  }
                >
                  Recovered
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  this.state.selected_filter_daily_status === criterias.deaths
                    ? styles.touchable_buttons
                    : styles.touchable_buttons_pressed
                }
                onPress={async () => {
                  await this.setState({
                    selected_filter_daily_status: criterias.deaths,
                  });
                  this.fetchDailyNewsCases();
                }}
              >
                <Text
                  style={
                    this.state.selected_filter_daily_status === criterias.deaths
                      ? styles.text_style
                      : styles.text_style_pressed
                  }
                >
                  Death
                </Text>
              </TouchableOpacity>

              {this.state.testCountDataExist ? (
                <TouchableOpacity
                  style={
                    this.state.selected_filter_daily_status ===
                    criterias.numberOfTests
                      ? styles.touchable_buttons
                      : styles.touchable_buttons_pressed
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter_daily_status: criterias.numberOfTests,
                    });
                    this.fetchDailyNewsCases();
                  }}
                >
                  <Text
                    style={
                      this.state.selected_filter_daily_status ===
                      criterias.numberOfTests
                        ? styles.text_style
                        : styles.text_style_pressed
                    }
                  >
                    Test Counts
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.container_graph}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}
              >
                Total Cases
              </Text>
              <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                Country : {this.state.search}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 10,
                  marginTop: 5,
                  alignSelf: "center",
                }}
              >
                <View style={{ flexDirection: "row", marginRight: 20 }}>
                  <DatePicker
                    date={this.state.selected_total_start_date}
                    mode="date" //The enum of date, datetime and
                    placeholder="Select start date"
                    format="YYYY-MM-DD"
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                        borderRadius: 20,
                        height: 30,
                      },
                    }}
                    onDateChange={(date) => {
                      this.setState({ selected_total_start_date: date });
                    }}
                  />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <DatePicker
                    date={this.state.selected_total_end_date}
                    mode="date" //The enum of date, datetime and time
                    placeholder="Select end date"
                    format="YYYY-MM-DD"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                        borderRadius: 20,
                        height: 30,
                      },
                    }}
                    onDateChange={async (date) => {
                      await this.setState({ selected_total_end_date: date });
                      this.fetchStatistics();
                    }}
                  />
                </View>
              </View>

              <LineChart
                data={{
                  labels: this.state.graph_label,
                  datasets: [{ data: this.state.data_set }],
                }}
                verticalLabelRotation={30}
                width={Dimensions.get("window").width} // from react-native
                height={HIEGHT / 2}
                fromZero={true}
                formatYLabel={(Y) => this.intToString(Number(Y))}
                chartConfig={{
                  backgroundColor: "#0080ff",
                  backgroundGradientFrom: "#0080ff",
                  backgroundGradientTo: "#0080ff",
                  scrollableDotFill: "#ffffff",
                  barPercentage: 0.1,
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

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={
                  this.state.selected_filter === criterias.confirmed
                    ? styles.touchable_buttons
                    : styles.touchable_buttons_pressed
                }
                onPress={async () => {
                  await this.setState({
                    selected_filter: criterias.confirmed,
                  });
                  this.fetchDailyNewsCases();
                }}
              >
                <Text
                  style={
                    this.state.selected_filter === criterias.confirmed
                      ? styles.text_style
                      : styles.text_style_pressed
                  }
                >
                  Confirmed
                </Text>
              </TouchableOpacity>
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
              {this.state.testCountDataExist ? (
                <TouchableOpacity
                  style={
                    this.state.selected_filter === criterias.numberOfTests
                      ? styles.touchable_buttons
                      : styles.touchable_buttons_pressed
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter: criterias.numberOfTests,
                    });
                    this.fetchDailyNewsCases();
                  }}
                >
                  <Text
                    style={
                      this.state.selected_filter === criterias.numberOfTests
                        ? styles.text_style
                        : styles.text_style_pressed
                    }
                  >
                    Test Counts
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.container_graph}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}
              >
                Rate of Cases
              </Text>
              <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                Country : {this.state.search}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 10,
                  marginTop: 5,
                  alignSelf: "center",
                }}
              >
                <View style={{ flexDirection: "row", marginRight: 20 }}>
                  <DatePicker
                    date={this.state.selected_rate_start_date}
                    mode="date" //The enum of date, datetime and
                    placeholder="Select start date"
                    format="YYYY-MM-DD"
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                        borderRadius: 20,
                        height: 30,
                      },
                    }}
                    onDateChange={(date) => {
                      this.setState({ selected_rate_start_date: date });
                    }}
                  />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <DatePicker
                    date={this.state.selected_rate_end_date}
                    mode="date" //The enum of date, datetime and time
                    placeholder="Select end date"
                    format="YYYY-MM-DD"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                        borderRadius: 20,
                        height: 30,
                      },
                    }}
                    onDateChange={async (date) => {
                      await this.setState({ selected_rate_end_date: date });
                      this.fetchRateStatistics();
                    }}
                  />
                </View>
              </View>

              <LineChart
                data={{
                  labels: this.state.rate_label,
                  datasets: [{ data: this.state.rate_data_set }],
                }}
                verticalLabelRotation={30}
                width={Dimensions.get("window").width} // from react-native
                height={HIEGHT / 2}
                fromZero={true}
                chartConfig={{
                  backgroundColor: "#0080ff",
                  backgroundGradientFrom: "#0080ff",
                  backgroundGradientTo: "#0080ff",
                  scrollableDotFill: "#ffffff",
                  barPercentage: 0.1,
                  decimalPlaces: 1, // optional, defaults to 2dp
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
              {this.state.testCountDataExist ? (
                <TouchableOpacity
                  style={
                    this.state.selected_filter_rate === criterias.confirmedRate
                      ? styles.touchable_buttons
                      : styles.touchable_buttons_pressed
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter_rate: criterias.confirmedRate,
                    });
                    this.fetchRateStatistics();
                  }}
                >
                  <Text
                    style={
                      this.state.selected_filter_rate ===
                      criterias.confirmedRate
                        ? styles.text_style
                        : styles.text_style_pressed
                    }
                  >
                    Confirmed Rate
                  </Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={
                  this.state.selected_filter_rate === criterias.recoveryRate
                    ? styles.touchable_buttons
                    : styles.touchable_buttons_pressed
                }
                onPress={async () => {
                  await this.setState({
                    selected_filter_rate: criterias.recoveryRate,
                  });
                  this.fetchRateStatistics();
                }}
              >
                <Text
                  style={
                    this.state.selected_filter_rate === criterias.recoveryRate
                      ? styles.text_style
                      : styles.text_style_pressed
                  }
                >
                  Recovered Rate
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  this.state.selected_filter_rate === criterias.deathRate
                    ? styles.touchable_buttons
                    : styles.touchable_buttons_pressed
                }
                onPress={async () => {
                  await this.setState({
                    selected_filter_rate: criterias.deathRate,
                  });
                  this.fetchRateStatistics();
                }}
              >
                <Text
                  style={
                    this.state.selected_filter_rate === criterias.deathRate
                      ? styles.text_style
                      : styles.text_style_pressed
                  }
                >
                  Death Rate
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

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <DataAnalytics />
  </ApplicationProvider>
);
