import React from "react";
import { SearchBar } from "react-native-elements";
import {
  StyleSheet,
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
import {
  ApplicationProvider,
  Card,
  Modal,
  Button,
  Datepicker,
  Layout,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import SearchableDropdown from "react-native-searchable-dropdown";
import userIDStore from "../../data-management/user-id-data/userIDStore";
import Text from "./CustomText.js";
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
    new_case_description_visiblity: false,
    total_case_description_visiblity: false,
    rate_description_visibility: false,
    new_case_description: [
      `This graph represents the number of daily deaths, the number of currently active cases, the number of tests done, the number of daily deaths encountered, the number of recovered patients to the latest pandemic, COVID-19.`,
    ],
    total_case_description: `This graph represents the total number of positive cases, the total number of active cases, the total number of tests done, the number of total deaths encountered, the number of recovered patients to the latest pandemic, COVID-19.`,
    rate_description: `This graph represents the rate of positive cases, rate of recovered patients, rate of active(currently infected) patients and rate of deaths encountered from the total conducted tests everyday to the latest pandemic, COVID-19.`,
  };

  componentDidMount = async () => {
    await this.getTotalData()
      .then(this.fetchStatistics())
      .then(this.fetchDailyNewsCases())
      .then(this.fetchRateStatistics())
      .then(this.getCountryList())
      .then(this.checkIfDataExist(criterias.numberOfTests)) //check if number of test case data exist
      .catch((error) => {
        console.log("Concurrency Issue");
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
  //gets the current date and return in yyyy-mm-dd format
  getCurrentDate() {
    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    return year + "-" + month + "-" + day;
  }
  //get minimum date for selection
  getMinimumDate() {
    return "2019-12-31";
  }

  render() {
    const HIEGHT = Dimensions.get("window").height;
    return (
      <Layout>
        <Layout style={{ flexDirection: "row" }}>
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
            <Text style={{ fontSize: 12 }}>Refresh</Text>
          </TouchableOpacity>
        </Layout>

        <ScrollView>
          <Layout style={styles.container}>
            <Layout
              style={{
                alignContent: "flex-start",
                justifyContent: "flex-start",
                margin: 10,
                width: Dimensions.get("window").width - 20,
                backgroundColor: "#ffffff00",
              }}
            >
              <Text style={{ fontSize: 20, fontFamily: "Roboto-Black" }}>
                Case Update
              </Text>
            </Layout>
            <Layout
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
                <Layout
                  style={{ backgroundColor: "#F6CA81", borderRadius: 20 }}
                >
                  <Layout
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20 / 2,
                      margin: 5,
                      borderColor: "#F57B35",
                      borderWidth: 3,
                    }}
                  ></Layout>
                </Layout>

                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#F57B35"
                    style={{ margin: 5 }}
                  />
                ) : (
                  <Text style={{ fontSize: 24, color: "#F57B35" }}>
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
                <Layout
                  style={{ backgroundColor: "#ABF788", borderRadius: 20 }}
                >
                  <Layout
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20 / 2,
                      margin: 5,
                      borderColor: "green",
                      borderWidth: 3,
                    }}
                  ></Layout>
                </Layout>

                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="green"
                    style={{ margin: 5 }}
                  />
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
                <Layout
                  style={{ backgroundColor: "#F9A993", borderRadius: 20 }}
                >
                  <Layout
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20 / 2,
                      margin: 5,
                      borderColor: "red",
                      borderWidth: 3,
                    }}
                  ></Layout>
                </Layout>

                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="red"
                    style={{ margin: 5 }}
                  />
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
            </Layout>

            <Layout
              style={{
                alignContent: "flex-start",
                justifyContent: "flex-start",
                margin: 10,
                width: Dimensions.get("window").width - 20,
                backgroundColor: "#ffffff00",
              }}
            >
              <Text style={{ fontSize: 20, fontFamily: "Roboto-Black" }}>
                Total Data
              </Text>
            </Layout>

            <Layout
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
                <Layout
                  style={{ backgroundColor: "#F6CA81", borderRadius: 20 }}
                >
                  <Layout
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20 / 2,
                      margin: 5,
                      borderColor: "#F57B35",
                      borderWidth: 3,
                    }}
                  ></Layout>
                </Layout>

                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#F57B35"
                    style={{ margin: 5 }}
                  />
                ) : (
                  <Text style={{ fontSize: 24, color: "#F57B35" }}>
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
                <Layout
                  style={{ backgroundColor: "#ABF788", borderRadius: 20 }}
                >
                  <Layout
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20 / 2,
                      margin: 5,
                      borderColor: "green",
                      borderWidth: 3,
                    }}
                  ></Layout>
                </Layout>

                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="green"
                    style={{ margin: 5 }}
                  />
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
                <Layout
                  style={{ backgroundColor: "#F9A993", borderRadius: 20 }}
                >
                  <Layout
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20 / 2,
                      margin: 5,
                      borderColor: "red",
                      borderWidth: 3,
                    }}
                  ></Layout>
                </Layout>

                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="red"
                    style={{ margin: 5 }}
                  />
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
            </Layout>
            <Layout style={styles.backdrop_container}>
              <Modal
                visible={this.state.new_case_description_visiblity}
                backdropStyle={styles.backdrop}
                onBackdropPress={() =>
                  this.setState({ new_case_description_visiblity: false })
                }
              >
                <Card disabled={true}>
                  <Text>
                    {this.state.selected_filter_daily_status ===
                    criterias.confirmed
                      ? this.state.new_case_description[0]
                      : this.state.selected_filter_daily_status ===
                        criterias.recoveries
                      ? this.state.new_case_description[1]
                      : this.state.new_case_description[2]}
                  </Text>
                  <Button
                    appearance="ghost"
                    onPress={() =>
                      this.setState({ new_case_description_visiblity: false })
                    }
                  >
                    Dismiss
                  </Button>
                </Card>
              </Modal>
              <Modal
                visible={this.state.total_case_description_visiblity}
                backdropStyle={styles.backdrop}
                onBackdropPress={() =>
                  this.setState({ total_case_description_visiblity: false })
                }
              >
                <Card disabled={true}>
                  <Text>{this.state.total_case_description}</Text>
                  <Button
                    appearance="ghost"
                    onPress={() =>
                      this.setState({ total_case_description_visiblity: false })
                    }
                  >
                    Dismiss
                  </Button>
                </Card>
              </Modal>
              <Modal
                visible={this.state.rate_description_visibility}
                backdropStyle={styles.backdrop}
                onBackdropPress={() =>
                  this.setState({ rate_description_visibility: false })
                }
              >
                <Card disabled={true}>
                  <Text>{this.state.rate_description}</Text>
                  <Button
                    appearance="ghost"
                    onPress={() =>
                      this.setState({ rate_description_visibility: false })
                    }
                  >
                    Dismiss
                  </Button>
                </Card>
              </Modal>
            </Layout>

            <Layout style={styles.container_graph}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Roboto-Black",
                  marginLeft: 10,
                }}
              >
                Daily New Cases
              </Text>
              <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                Country : {this.state.search}
              </Text>

              <Layout
                style={{
                  flexDirection: "row",
                  marginLeft: 10,
                  marginTop: 5,
                  alignSelf: "center",
                }}
              >
                <Layout style={{ flexDirection: "row", marginRight: 20 }}>
                  <DatePicker
                    date={this.state.selected_daily_start_date}
                    mode="date" //The enum of date, datetime and
                    placeholder="Select start date"
                    maxDate={
                      this.state.selected_daily_end_date === ""
                        ? this.getCurrentDate()
                        : this.state.selected_daily_end_date
                    }
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
                </Layout>
                <Layout style={{ flexDirection: "row" }}>
                  <DatePicker
                    date={this.state.selected_daily_end_date}
                    mode="date" //The enum of date, datetime and time
                    placeholder="Select end date"
                    format="YYYY-MM-DD"
                    confirmBtnText="Confirm"
                    minDate={
                      this.state.selected_daily_start_date === ""
                        ? this.getMinimumDate
                        : this.state.selected_daily_start_date
                    }
                    maxDate={this.getCurrentDate()}
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
                </Layout>
              </Layout>

              <BarChart
                data={{
                  labels: this.state.daily_newCases_label,
                  datasets: [
                    {
                      data: this.state.daily_newCases_data_set,
                    },
                  ],
                }}
                verticalLabelRotation={60}
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
            </Layout>

            <Layout
              style={{ flexDirection: "row", backgroundColor: "#ffffff00" }}
            >
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
              <TouchableOpacity
                style={styles.touchable_buttons_pressed}
                onPress={() => {
                  this.setState({ new_case_description_visiblity: true });
                }}
              >
                <Text style={styles.text_style_pressed}>Description</Text>
              </TouchableOpacity>
            </Layout>

            <Layout style={styles.container_graph}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Roboto-Black",
                  marginLeft: 10,
                }}
              >
                Total Cases
              </Text>
              <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                Country : {this.state.search}
              </Text>

              <Layout
                style={{
                  flexDirection: "row",
                  marginLeft: 10,
                  marginTop: 5,
                  alignSelf: "center",
                }}
              >
                <Layout style={{ flexDirection: "row", marginRight: 20 }}>
                  <DatePicker
                    date={this.state.selected_total_start_date}
                    mode="date" //The enum of date, datetime and
                    placeholder="Select start date"
                    maxDate={
                      this.state.selected_total_end_date === ""
                        ? this.getCurrentDate()
                        : this.state.selected_total_end_date
                    }
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
                </Layout>
                <Layout style={{ flexDirection: "row" }}>
                  <DatePicker
                    date={this.state.selected_total_end_date}
                    mode="date" //The enum of date, datetime and time
                    placeholder="Select end date"
                    format="YYYY-MM-DD"
                    minDate={
                      this.state.selected_total_start_date === ""
                        ? this.getMinimumDate()
                        : this.state.selected_total_start_date
                    }
                    maxDate={this.getCurrentDate()}
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
                </Layout>
              </Layout>

              <LineChart
                data={{
                  labels: this.state.graph_label,
                  datasets: [{ data: this.state.data_set }],
                }}
                verticalLabelRotation={60}
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
            </Layout>

            <Layout
              style={{ flexDirection: "row", backgroundColor: "#ffffff00" }}
            >
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
              <TouchableOpacity
                style={styles.touchable_buttons_pressed}
                onPress={() => {
                  this.setState({ total_case_description_visiblity: true });
                }}
              >
                <Text style={styles.text_style_pressed}>Description</Text>
              </TouchableOpacity>
            </Layout>

            <Layout style={styles.container_graph}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Roboto-Black",
                  marginLeft: 10,
                }}
              >
                Rate of Cases
              </Text>
              <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                Country : {this.state.search}
              </Text>

              <Layout
                style={{
                  flexDirection: "row",
                  marginLeft: 10,
                  marginTop: 5,
                  alignSelf: "center",
                }}
              >
                <Layout style={{ flexDirection: "row", marginRight: 20 }}>
                  <DatePicker
                    date={this.state.selected_rate_start_date}
                    mode="date" //The enum of date, datetime and
                    placeholder="Select start date"
                    format="YYYY-MM-DD"
                    maxDate={
                      this.state.selected_rate_end_date === ""
                        ? this.getCurrentDate()
                        : this.state.selected_rate_end_date
                    }
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
                </Layout>
                <Layout style={{ flexDirection: "row" }}>
                  <DatePicker
                    date={this.state.selected_rate_end_date}
                    mode="date" //The enum of date, datetime and time
                    placeholder="Select end date"
                    minDate={
                      this.state.selected_rate_start_date === ""
                        ? this.getMinimumDate()
                        : this.state.selected_rate_start_date
                    }
                    maxDate={this.getCurrentDate()}
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
                </Layout>
              </Layout>

              <LineChart
                data={{
                  labels: this.state.rate_label,
                  datasets: [{ data: this.state.rate_data_set }],
                }}
                verticalLabelRotation={60}
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
            </Layout>

            <Layout
              style={{
                flexDirection: "row",
                marginBottom: 80,
                backgroundColor: "#ffffff00",
              }}
            >
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
              <TouchableOpacity
                style={styles.touchable_buttons_pressed}
                onPress={() => {
                  this.setState({ rate_description_visibility: true });
                }}
              >
                <Text style={styles.text_style_pressed}>Description</Text>
              </TouchableOpacity>
            </Layout>
          </Layout>
        </ScrollView>
      </Layout>
    ); // end of return
  } // end of render function
} // end of class StaticsPage

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },
  backdrop_container: {
    minHeight: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
