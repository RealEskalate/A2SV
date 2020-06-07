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
  Image,
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
  Text,
  Layout,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import SearchableDropdown from "react-native-searchable-dropdown";
import userIDStore from "../../data-management/user-id-data/userIDStore";
import { DotsLoader } from "react-native-indicator";
import { strings } from "../../localization/localization";
import languageStore from "../../data-management/language_data/languageStore";
import { ThemeContext } from "../../../assets/themes/theme-context";

class Ethiopia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      searchedCountry: "ETH",
      TotalStatisticsData: [],
      StatisticsData: {},
      search: "Ethiopia",
      currLanguage: "English",
      currLangCode: languageStore.getState(),
      Months: [
        strings.Jan,
        strings.Feb,
        strings.Mar,
        strings.Apr,
        strings.May,
        strings.Jun,
        strings.Jul,
        strings.Aug,
        strings.Sep,
        strings.Oct,
        strings.Nov,
        strings.Dec,
      ],
      countries: [],
      totalGraphLoading: false,
      dailyGraphLoading: false,
      rateGraphLoading: false,
      totalLoading: true,
      testCountDataExist: false,
      discriptionVisiblity: false,
      staticsDescription: [],
      staticsDescriptionLoading: true,
      discriptionTitle: "",
      description: "",
    };
    languageStore.subscribe(() => {
      strings.setLanguage(languageStore.getState());
      this.setState({ currLangCode: languageStore.getState() });
      this.componentDidMount();
    });
  }
  static contextType = ThemeContext;
  componentDidMount = async () => {
    await this.setState({ currLangCode: languageStore.getState() });
    switch (this.state.currLangCode) {
      case "am":
        await this.setState({ currLanguage: "Amharic" });
        break;
      case "en":
        await this.setState({ currLanguage: "English" });
        break;
      case "orm":
        await this.setState({ currLanguage: "Oromo" });
        break;
      case "tr":
        await this.setState({ currLanguage: "English" });
        break;
    }
    await this.getTotalData()
      .then(this.fetchTotalStats())
      .then(this.fetchDailyNewsCases())
      .then(this.fetchRateStatistics())
      .then(this.getCountryList())
      .then(this.checkIfDataExist(criterias.numberOfTests)) //check if number of test case data exist
      .then(this.getDescriptions)
      .catch((error) => {
        console.log("Concurrency Issue");
      });
  };

  //gets statistics data based on selected criteria and populate UI
  fetchTotalStats = async () => {
    let newThis = this;
    this.setState({ totalGraphLoading: true });
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
          newThis.setState({ totalGraphLoading: false });
        } else {
          newThis.fetchTotalStats();
        }
      })
      .catch((error) => {
        Alert.alert(strings.ConnectionProblem, strings.CouldNotConnectToServer);
      });
  };
  //gets rate statistics data based on selected criteria and populate UI
  fetchRateStatistics = async () => {
    let newThis = this;
    this.setState({ rateGraphLoading: true });
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
          newThis.setState({ rateGraphLoading: false });
        } else {
          newThis.fetchRateStatistics();
        }
      })
      .catch((error) => {
        Alert.alert(strings.ConnectionProblem, strings.CouldNotConnectToServer);
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
        Alert.alert(strings.ConnectionProblem, strings.CouldNotConnectToServer);
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
        Alert.alert(strings.ConnectionProblem, strings.CouldNotConnectToServer);
      });
  };
  //fetch daily new cases reported
  fetchDailyNewsCases = async () => {
    let newThis = this;
    this.setState({ dailyGraphLoading: true });
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
          newThis.setState({ dailyGraphLoading: false });
        } else {
          newThis.fetchDailyNewsCases();
        }
      })
      .catch((error) => {
        Alert.alert(strings.ConnectionProblem, strings.CouldNotConnectToServer);
      });
  };
  //populate daily data
  populateDailyData = (objList) => {
    this.state.daily_newCases_label = [""]; //reseting all data point labels
    this.state.daily_newCases_data_set = [0]; //reseting all data point labels

    //generating interval
    var interval = Math.floor(objList.length / 6);
    var setRemainder = objList.length % 6;
    if (interval === 0) {
      interval = 1;
      remainder = 0;
    }
    let dataSet_counter = 0;
    let indexCounterSet = 0;
    while (dataSet_counter < objList.length) {
      this.state.daily_newCases_data_set[indexCounterSet] =
        objList[dataSet_counter].y;

      indexCounterSet += 1;
      if (
        setRemainder > 0 &&
        dataSet_counter + setRemainder - 1 === objList.length
      ) {
        dataSet_counter += setRemainder - 1;
        continue;
      }
      dataSet_counter += interval;
    }

    var remainder = objList.length % 5;
    let graphLebel_counter = 0;
    let indexCounter = 0;
    while (graphLebel_counter < objList.length) {
      this.state.daily_newCases_label[indexCounter] = this.dateConverter(
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
  //Populates statistics data in to our state
  populate = (objList) => {
    this.state.graph_label = [""]; //reseting data label
    this.state.data_set = [0]; // reseting data set

    //generating interval
    var interval = Math.floor(objList.length / 6);
    var setRemainder = objList.length % 6;
    if (interval === 0) {
      interval = 1;
      remainder = 0;
    }
    let dataSet_counter = 0;
    let indexCounterSet = 0;
    while (dataSet_counter < objList.length) {
      this.state.data_set[indexCounterSet] = objList[dataSet_counter].y;

      indexCounterSet += 1;
      if (
        setRemainder > 0 &&
        dataSet_counter + setRemainder - 1 === objList.length
      ) {
        dataSet_counter += setRemainder - 1;
        continue;
      }
      dataSet_counter += interval;
    }

    var remainder = objList.length % 5;
    let graphLebel_counter = 0;
    let indexCounter = 0;
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

    //generating interval
    var interval = Math.floor(objList.length / 6);
    var setRemainder = objList.length % 6;
    if (interval === 0) {
      interval = 1;
      remainder = 0;
    }
    let dataSet_counter = 0;
    let indexCounterSet = 0;
    while (dataSet_counter < objList.length) {
      this.state.rate_data_set[indexCounterSet] = objList[dataSet_counter].y;

      indexCounterSet += 1;
      if (
        setRemainder > 0 &&
        dataSet_counter + setRemainder - 1 === objList.length
      ) {
        dataSet_counter += setRemainder - 1;
        continue;
      }
      dataSet_counter += interval;
    }

    var remainder = objList.length % 5;
    let graphLebel_counter = 0;
    let indexCounter = 0;
    while (graphLebel_counter < objList.length) {
      this.state.rate_label[indexCounter] = this.dateConverter(
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
  //fetches description for different age group
  getDescriptions = async () => {
    let newThis = this;
    await fetch(
      "https://sym-track.herokuapp.com/api/resources/mobile/statistics?language=" +
        this.state.currLanguage +
        "&filter=adults",
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
            staticsDescription: json,
            staticsDescriptionLoading: false,
          });

          console.log(this.state.staticsDescription);
        } else {
          newThis.getDescriptions();
        }
      })
      .catch((error) => {
        Alert.alert(strings.ConnectionProblem, strings.CouldNotConnectToServer);
        // newThis.setState({
        //   staticsDescriptionLoading: false,
        // });
      });
  };
  //fetch description of graphs
  getCriteriaDescriptions = async (title, position) => {
    let newThis = this;
    var query =
      "http://sym-track.herokuapp.com/api/resources/mobile/statistics?language=" +
      this.state.currLanguage +
      "&filter=adults&title=" +
      title;
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
          await newThis.setState({
            descriptionTitle: json[0].criteria[position].name,
            description: json[0].criteria[position].explanation,
            graphDescriptionLoading: false,
          });
          newThis.forceUpdate();
        } else {
          newThis.getCriteriaDescriptions();
        }
      })
      .catch((error) => {
        newThis.setState({
          descriptionTitle: strings.ConnectionProblem,
          description: "Unable to connect",
        });
        // Alert.alert(strings.ConnectionProblem, strings.CouldNotConnectToServer);
      });
  };

  render() {
    const HIEGHT = Dimensions.get("window").height;
    return (
      <Layout>
        {/* <Layout style={{ flexDirection: "row" }}>
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
            <Text style={{ fontSize: 12 }}>{strings.Refresh}</Text>
          </TouchableOpacity>
        </Layout> */}

        <ScrollView>
          <Layout style={styles.container}>
            <Layout
              style={{
                flexDirection: "row",
                flex: 1,
                paddingHorizontal: 10,
                width: Dimensions.get("window").width,
                backgroundColor: "#ffffff00",
              }}
            >
              <Layout
                style={{
                  alignContent: "flex-start",
                  width: Dimensions.get("window").width - 60,
                  backgroundColor: "#ffffff00",
                  marginTop: 15,
                }}
              >
                <Text
                  category="h6"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {strings.DailyStats}
                </Text>
              </Layout>
              <Layout
                style={{
                  marginBottom: 5,
                  backgroundColor: "#ffffff00",
                }}
              >
                <TouchableOpacity onPress={() => this.componentDidMount()}>
                  <MaterialCommunityIcons
                    name="reload"
                    color="#0080ff"
                    size={30}
                  />
                  <Text style={{ fontSize: 12 }}>{strings.Refresh}</Text>
                </TouchableOpacity>
              </Layout>
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
                <Image
                  source={require("../../../assets/images/sick.png")}
                  style={{ height: 30, width: 30 }}
                />

                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#ffa500"
                    style={{ margin: 5 }}
                  />
                ) : (
                  <Text style={{ fontSize: 24, color: "#ffa500" }}>
                    {this.reformatNumber(
                      String(
                        Math.abs(
                          this.state.TotalStatisticsData[
                            this.state.TotalStatisticsData.length - 1
                          ].Confirmed -
                            this.state.TotalStatisticsData[
                              this.state.TotalStatisticsData.length - 2
                            ].Confirmed
                        )
                      )
                    )}
                  </Text>
                )}
                <Text>{strings.NewConfirmed}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={true}
                style={{ alignItems: "center" }}
              >
                <Image
                  source={require("../../../assets/images/recovered.png")}
                  style={{ height: 30, width: 30 }}
                />

                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#039be5"
                    style={{ margin: 5 }}
                  />
                ) : (
                  <Text style={{ fontSize: 24, color: "#039be5" }}>
                    {this.reformatNumber(
                      String(
                        Math.abs(
                          this.state.TotalStatisticsData[
                            this.state.TotalStatisticsData.length - 1
                          ].Recovered -
                            this.state.TotalStatisticsData[
                              this.state.TotalStatisticsData.length - 2
                            ].Recovered
                        )
                      )
                    )}
                  </Text>
                )}
                <Text>{strings.NewRecovered}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={true}
                style={{ alignItems: "center" }}
              >
                <Image
                  source={require("../../../assets/images/angel.jpg")}
                  style={{ height: 30, width: 30 }}
                />

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
                        Math.abs(
                          this.state.TotalStatisticsData[
                            this.state.TotalStatisticsData.length - 1
                          ].Deaths -
                            this.state.TotalStatisticsData[
                              this.state.TotalStatisticsData.length - 2
                            ].Deaths
                        )
                      )
                    )}
                  </Text>
                )}
                <Text>{strings.NewDeath}</Text>
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
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {strings.TotalStats}
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
                <Image
                  source={require("../../../assets/images/sick.png")}
                  style={{ height: 30, width: 30 }}
                />

                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#ffa500"
                    style={{ margin: 5 }}
                  />
                ) : (
                  <Text style={{ fontSize: 24, color: "#ffa500" }}>
                    {this.reformatNumber(
                      String(
                        this.state.TotalStatisticsData[
                          this.state.TotalStatisticsData.length - 1
                        ].Confirmed
                      )
                    )}
                  </Text>
                )}
                <Text>{strings.TotalConfirmed}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={true}
                style={{ alignItems: "center" }}
              >
                <Image
                  source={require("../../../assets/images/recovered.png")}
                  style={{ height: 30, width: 30 }}
                />

                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#039be5"
                    style={{ margin: 5 }}
                  />
                ) : (
                  <Text style={{ fontSize: 24, color: "#039be5" }}>
                    {this.reformatNumber(
                      String(
                        this.state.TotalStatisticsData[
                          this.state.TotalStatisticsData.length - 1
                        ].Recovered
                      )
                    )}
                  </Text>
                )}
                <Text>{strings.TotalRecovered}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={true}
                style={{ alignItems: "center" }}
              >
                <Image
                  source={require("../../../assets/images/angel.jpg")}
                  style={{ height: 30, width: 30 }}
                />

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
                <Text>{strings.TotalDeath}</Text>
              </TouchableOpacity>
            </Layout>

            <Layout style={styles.backdrop_container}>
              <Modal
                visible={this.state.descriptionVisiblity}
                backdropStyle={styles.backdrop}
                onBackdropPress={() => {
                  this.setState({ descriptionVisiblity: false });
                  this.setState({ descriptionTitle: "" });
                  this.setState({ description: "" });
                }}
              >
                <Card
                  disabled={true}
                  header={
                    // style={{padding:10}}

                    this.state.descriptionTitle != ""
                      ? () => (
                          <Text
                            style={{
                              minHeight: 0,
                              fontSize: 20,
                              fontFamily: "Roboto-Black",
                              margin: 10,
                            }}
                          >
                            {this.state.descriptionTitle}
                          </Text>
                        )
                      : null
                  }
                  footer={
                    this.state.description != ""
                      ? () => (
                          <Button
                            style={styles.footerControl}
                            appearance="ghost"
                            onPress={() => {
                              this.setState({ descriptionVisiblity: false });
                              this.setState({ descriptionTitle: "" });
                              this.setState({ description: "" });
                              this.setState({ graphDescriptionLoading: true });
                            }}
                          >
                            {strings.Dismiss}
                          </Button>
                        )
                      : null
                  }
                >
                  {this.state.description == "" ? (
                    <ActivityIndicator
                      size="large"
                      color="#F57B35"
                      style={{ margin: 5 }}
                    />
                  ) : (
                    <Text>{this.state.description}</Text>
                  )}
                </Card>
              </Modal>
            </Layout>

            <Layout style={styles.container_graph}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 10,
                }}
              >
                {strings.DailyStatsGraph}
              </Text>
              {this.state.staticsDescriptionLoading ? (
                <Layout flexDirection="row">
                  <ActivityIndicator
                    size="small"
                    color="gray"
                    marginLeft={10}
                  />
                  <Text style={{ fontSize: 16, color: "gray" }}>
                    {strings.LoadingGraphDescription}
                  </Text>
                </Layout>
              ) : (
                <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                  {this.state.staticsDescription[1].descriptions[0].description}
                </Text>
              )}

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
                    placeholder={strings.StartDate}
                    maxDate={
                      this.state.selected_daily_end_date === ""
                        ? this.getCurrentDate()
                        : this.state.selected_daily_end_date
                    }
                    format="YYYY-MM-DD"
                    style={{ color: "#000000" }}
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
                        borderColor: "#000000",
                      },
                    }}
                    onDateChange={async (date) => {
                      await this.setState({ selected_daily_start_date: date });
                      this.fetchDailyNewsCases();
                    }}
                  />
                </Layout>
                <Layout style={{ flexDirection: "row" }}>
                  <DatePicker
                    date={this.state.selected_daily_end_date}
                    mode="date" //The enum of date, datetime and time
                    placeholder={strings.EndDate}
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
                        borderColor: "#000000",
                      },
                    }}
                    onDateChange={async (date) => {
                      await this.setState({ selected_daily_end_date: date });
                      this.fetchDailyNewsCases();
                    }}
                  />
                </Layout>
              </Layout>

              <LineChart
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
              {this.state.dailyGraphLoading ? (
                <Layout
                  style={{
                    width: Dimensions.get("window").width,
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <DotsLoader size={15} />
                </Layout>
              ) : null}

              <Layout
                style={{
                  flexDirection: "row",
                  backgroundColor: "#ffffff00",
                  justifyContent: "space-evenly",
                }}
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
                    {strings.Confirmed}
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
                    {strings.Recovered}
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
                      this.state.selected_filter_daily_status ===
                      criterias.deaths
                        ? styles.text_style
                        : styles.text_style_pressed
                    }
                  >
                    {strings.Death}
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
                      {strings.TestCounts}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </Layout>
              <Layout padding={10}>
                {this.state.staticsDescriptionLoading ? (
                  <Layout flexDirection="row" alignSelf="center">
                    <ActivityIndicator size="small" color="gray" />
                    <Text style={{ fontSize: 16, color: "gray" }}>
                      {strings.LoadingCriteriaDescription}
                    </Text>
                  </Layout>
                ) : this.state.selected_filter_daily_status ===
                  criterias.confirmed ? (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.staticsDescription[1].descriptions[0]
                      .criteria[1].name +
                      ": " +
                      this.state.staticsDescription[1].descriptions[0]
                        .criteria[1].explanation}
                  </Text>
                ) : this.state.selected_filter_daily_status ===
                  criterias.recoveries ? (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.staticsDescription[1].descriptions[0]
                      .criteria[3].name +
                      ": " +
                      this.state.staticsDescription[1].descriptions[0]
                        .criteria[3].explanation}
                  </Text>
                ) : this.state.selected_filter_daily_status ===
                  criterias.deaths ? (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.staticsDescription[1].descriptions[0]
                      .criteria[2].name +
                      ": " +
                      this.state.staticsDescription[1].descriptions[0]
                        .criteria[2].explanation}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.staticsDescription[1].descriptions[0]
                      .criteria[0].name +
                      ": " +
                      this.state.staticsDescription[1].descriptions[0]
                        .criteria[0].explanation}
                  </Text>
                )}
              </Layout>
            </Layout>
            <Layout style={styles.container_graph}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 10,
                }}
              >
                {strings.TotalStatsGraph}
              </Text>
              {this.state.staticsDescriptionLoading ? (
                <Layout flexDirection="row">
                  <ActivityIndicator
                    size="small"
                    color="gray"
                    marginLeft={10}
                  />
                  <Text style={{ fontSize: 16, color: "gray" }}>
                    {strings.LoadingGraphDescription}
                  </Text>
                </Layout>
              ) : (
                <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                  {this.state.staticsDescription[0].descriptions[0].description}
                </Text>
              )}

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
                    placeholder={strings.StartDate}
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
                        borderColor: "#000000",
                      },
                    }}
                    onDateChange={async (date) => {
                      await this.setState({ selected_total_start_date: date });
                      this.fetchTotalStats();
                    }}
                  />
                </Layout>
                <Layout style={{ flexDirection: "row" }}>
                  <DatePicker
                    date={this.state.selected_total_end_date}
                    mode="date" //The enum of date, datetime and time
                    placeholder={strings.EndDate}
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
                        borderColor: "#000000",
                      },
                    }}
                    onDateChange={async (date) => {
                      await this.setState({ selected_total_end_date: date });
                      this.fetchTotalStats();
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
              {this.state.totalGraphLoading ? (
                <Layout
                  style={{
                    width: Dimensions.get("window").width,
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <DotsLoader size={15} />
                </Layout>
              ) : null}

              <Layout
                style={{
                  flexDirection: "row",
                  backgroundColor: "#ffffff00",
                  justifyContent: "space-evenly",
                }}
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
                    this.fetchTotalStats();
                  }}
                >
                  <Text
                    style={
                      this.state.selected_filter === criterias.confirmed
                        ? styles.text_style
                        : styles.text_style_pressed
                    }
                  >
                    {strings.Confirmed}
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
                    this.fetchTotalStats();
                  }}
                >
                  <Text
                    style={
                      this.state.selected_filter === criterias.recoveries
                        ? styles.text_style
                        : styles.text_style_pressed
                    }
                  >
                    {strings.Recovered}
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
                    this.fetchTotalStats();
                  }}
                >
                  <Text
                    style={
                      this.state.selected_filter === criterias.deaths
                        ? styles.text_style
                        : styles.text_style_pressed
                    }
                  >
                    {strings.Death}
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
                      this.fetchTotalStats();
                    }}
                  >
                    <Text
                      style={
                        this.state.selected_filter === criterias.numberOfTests
                          ? styles.text_style
                          : styles.text_style_pressed
                      }
                    >
                      {strings.TestCounts}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </Layout>
              <Layout padding={10} style={{ marginBottom: 40 }}>
                {this.state.staticsDescriptionLoading ? (
                  <Layout flexDirection="row" alignSelf="center">
                    <ActivityIndicator size="small" color="gray" />
                    <Text style={{ fontSize: 16, color: "gray" }}>
                      {strings.LoadingCriteriaDescription}
                    </Text>
                  </Layout>
                ) : this.state.selected_filter === criterias.confirmed ? (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.staticsDescription[0].descriptions[0]
                      .criteria[1].name +
                      ": " +
                      this.state.staticsDescription[0].descriptions[0]
                        .criteria[1].explanation}
                  </Text>
                ) : this.state.selected_filter === criterias.recoveries ? (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.staticsDescription[0].descriptions[0]
                      .criteria[3].name +
                      ": " +
                      this.state.staticsDescription[0].descriptions[0]
                        .criteria[3].explanation}
                  </Text>
                ) : this.state.selected_filter === criterias.deaths ? (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.staticsDescription[0].descriptions[0]
                      .criteria[2].name +
                      ": " +
                      this.state.staticsDescription[0].descriptions[0]
                        .criteria[2].explanation}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.staticsDescription[0].descriptions[0]
                      .criteria[0].name +
                      ": " +
                      this.state.staticsDescription[0].descriptions[0]
                        .criteria[0].explanation}
                  </Text>
                )}
              </Layout>
            </Layout>

            {/* <Layout style={styles.container_graph}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 10,
                }}
              >
                {strings.DailyRatesGraph}
              </Text>
              {this.state.staticsDescriptionLoading ? (
                <Layout flexDirection="row">
                  <ActivityIndicator
                    size="small"
                    color="gray"
                    marginLeft={10}
                  />
                  <Text style={{ fontSize: 16, color: "gray" }}>
                    {strings.LoadingGraphDescription}
                  </Text>
                </Layout>
              ) : (
                <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                  {this.state.staticsDescription[2].descriptions[0].description}
                </Text>
              )}

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
                    placeholder={strings.StartDate}
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
                        borderColor: "#000000",
                      },
                    }}
                    onDateChange={async (date) => {
                      await this.setState({ selected_rate_start_date: date });
                      this.fetchRateStatistics();
                    }}
                  />
                </Layout>
                <Layout style={{ flexDirection: "row" }}>
                  <DatePicker
                    date={this.state.selected_rate_end_date}
                    mode="date" //The enum of date, datetime and time
                    placeholder={strings.EndDate}
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
                        borderColor: "#000000",
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
              {this.state.rateGraphLoading ? (
                <Layout
                  style={{
                    width: Dimensions.get("window").width,
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <DotsLoader size={15} />
                </Layout>
              ) : null}

              <Layout
                style={{
                  flexDirection: "row",
                  backgroundColor: "#ffffff00",
                  justifyContent: "space-evenly",
                }}
              >
                {this.state.testCountDataExist ? (
                  <TouchableOpacity
                    style={
                      this.state.selected_filter_rate ===
                      criterias.confirmedRate
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
                      {strings.ConfirmedRate}
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
                    {strings.RecoveryRate}
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
                    {strings.DeathRate}
                  </Text>
                </TouchableOpacity>
              </Layout>
              <Layout style={{ padding: 10, marginBottom: 80 }}>
                {this.state.staticsDescriptionLoading ? (
                  <Layout flexDirection="row" alignSelf="center">
                    <ActivityIndicator
                      size="small"
                      color="gray"
                      marginLeft={10}
                    />
                    <Text style={{ fontSize: 16, color: "gray" }}>
                      {strings.LoadingCriteriaDescription}
                    </Text>
                  </Layout>
                ) : this.state.selected_filter_rate ===
                  criterias.confirmedRate ? (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.staticsDescription[2].descriptions[0]
                      .criteria[0].name +
                      ": " +
                      this.state.staticsDescription[2].descriptions[0]
                        .criteria[0].explanation}
                  </Text>
                ) : this.state.selected_filter_rate ===
                  criterias.recoveryRate ? (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.staticsDescription[2].descriptions[0]
                      .criteria[1].name +
                      ": " +
                      this.state.staticsDescription[2].descriptions[0]
                        .criteria[1].explanation}
                  </Text>
                ) : this.state.selected_filter_rate === criterias.deathRate ? (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.staticsDescription[2].descriptions[0]
                      .criteria[3].name +
                      ": " +
                      this.state.staticsDescription[2].descriptions[0]
                        .criteria[3].explanation}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.staticsDescription[2].descriptions[0]
                      .criteria[0].name +
                      ": " +
                      this.state.staticsDescription[2].descriptions[0]
                        .criteria[0].explanation}
                  </Text>
                )}
              </Layout>
            </Layout> */}
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
    backgroundColor: "#30cc2a",
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
    borderRadius: 10,
  },
  touchable_buttons_pressed: {
    backgroundColor: "#F5F6FA",
    padding: 5,
    marginRight: 5,
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
    <Ethiopia />
  </ApplicationProvider>
);
