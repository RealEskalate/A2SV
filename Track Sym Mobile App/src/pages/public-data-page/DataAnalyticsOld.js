import React from "react";
import { SearchBar } from "react-native-elements";
import {
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  View,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import * as criterias from "./Criterias";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DatePicker from "react-native-datepicker";
import {
  Card,
  Modal,
  Button,
  Text,
  Layout,
  Divider,
  Datepicker as KittenDatepicker,
  TabView,
  Tab,
  Icon,
  Autocomplete,
  AutocompleteItem,
  Spinner,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import SearchableDropdown from "react-native-searchable-dropdown";
import userIDStore from "../../data-management/user-id-data/userIDStore";
import { TextLoader } from "react-native-indicator";
import { strings } from "../../localization/localization";
import languageStore from "../../data-management/language_data/languageStore";
import { ThemeContext } from "../../../assets/themes/theme-context";
import AsyncStorage from "@react-native-community/async-storage";
const CalendarIcon = (props) => <Icon {...props} name="calendar" />;

class DataAnalyticsOld extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_filter: criterias.confirmed, // sets the current filtering parameter on the graph
      selected_filter_daily_status: criterias.confirmed,
      selected_filter_rate: criterias.recoveryRate,
      selected_filter_perMillion_status: criterias.confirmed,
      selected_daily_start_date: "",
      selected_daily_end_date: new Date().toISOString().split("T")[0],
      selected_total_start_date: "",
      selected_total_end_date: new Date().toISOString().split("T")[0],
      selected_rate_start_date: "",
      selected_rate_end_date: new Date().toISOString().split("T")[0],
      selected_perMillion_start_date: "",
      selected_perMillion_end_date: new Date().toISOString().split("T")[0],
      selectedIndex_daily: 0,
      selectedIndex_total: 0,
      selectedIndex_perMillion: 0,
      graph_label: [""],
      data_set: [0],
      daily_newCases_label: [""],
      daily_newCases_data_set: [0],
      rate_label: [""],
      rate_data_set: [0],
      percentage_label: [""],
      percentage_data_set: [0],
      searchedCountry: "World",
      TotalStatisticsData: [],
      StatisticsData: {},
      search: "World",
      currLanguage: "English",
      currLangCode: languageStore.getState(),
      popUpVisible: false,
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
      controlCountries: [],
      searching: false,
      totalGraphLoading: false,
      dailyGraphLoading: false,
      perMillionGraphLoading: false,
      totalLoading: true,
      testCountDataExist: false,
      discriptionVisiblity: false,
      staticsDescription: [],
      staticsDescriptionLoading: true,
      permillonStaticsDescription: [],
      permillonStaticsDescriptionLoading: true,
      discriptionTitle: "",
      description: "",
      kittenStartDate: new Date(),
    };
    languageStore.subscribe(() => {
      strings.setLanguage(languageStore.getState());
      this.setState({ currLangCode: languageStore.getState() });
      this.componentDidMount();
    });
  }
  static contextType = ThemeContext;

  filterCountryNames = async () => {
    this.setState({ searching: true });
    await this.getTotalData()
      .then(this.fetchTotalStats())
      .then(this.fetchDailyNewsCases())
      .then(this.getCountryList())
      .then(this.fetchPerMillionStats())
      .then(this.fetchLastSymptomUpdate())
      .then(this.checkIfDataExist(criterias.numberOfTests)) //check if number of test case data exist
      .then(this.getDescriptions())
      .then(this.getPermillionDescriptions())
      .catch((error) => {
        console.log("Concurrency Issue");
      });
  };

  componentDidMount = async () => {
    console.log(this.state.selected_daily_start_date);
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
        await this.setState({ currLanguage: "Turkish" });
        break;
    }
    await this.getTotalData()
      .then(this.fetchTotalStats())
      .then(this.fetchDailyNewsCases())
      .then(this.getCountryList())
      .then(this.fetchPerMillionStats())
      .then(this.fetchLastSymptomUpdate())
      .then(this.checkIfDataExist(criterias.numberOfTests)) //check if number of test case data exist
      .then(this.getDescriptions())
      .then(this.getPermillionDescriptions())
      .catch((error) => {
        console.log("Concurrency Issue");
      });
  };

  //gets statistics data based on selected criteria and populate UI
  fetchTotalStats = async () => {
    //console.log("Bearer " + userIDStore.getState().userToken);
    let newThis = this;
    this.setState({ totalGraphLoading: true });
    var query =
      this.state.selected_total_start_date.length > 1 &&
      this.state.selected_total_end_date.length > 1
        ? "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=" +
          this.state.selected_filter +
          "&country=" +
          this.state.searchedCountry +
          "&start_date=" +
          this.state.selected_total_start_date +
          "&end_date=" +
          this.state.selected_total_end_date
        : "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=" +
          this.state.selected_filter +
          "&country=" +
          this.state.searchedCountry;
    //console.log(query);
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
          newThis.setState({
            totalGraphLoading: false,
          });
        } else {
          newThis.fetchTotalStats();
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
        ? "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=" +
          this.state.selected_filter_daily_status +
          "&country=" +
          this.state.searchedCountry +
          "&start_date=" +
          this.state.selected_daily_start_date +
          "&end_date=" +
          this.state.selected_daily_end_date +
          "&daily=true"
        : "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=" +
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
          newThis.setState({
            dailyGraphLoading: false,
          });
        } else {
          newThis.fetchDailyNewsCases();
        }
      })
      .catch((error) => {
        Alert.alert(strings.ConnectionProblem, strings.CouldNotConnectToServer);
      });
  };

  //gets statistics data based on selected criteria and populate UI
  fetchPerMillionStats = async () => {
    //console.log("Bearer " + userIDStore.getState().userToken);
    let newThis = this;
    this.setState({ perMillionGraphLoading: true });
    var query =
      this.state.selected_perMillion_start_date.length > 1 &&
      this.state.selected_perMillion_end_date.length > 1
        ? "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=" +
          this.state.selected_filter_perMillion_status +
          "&country=" +
          this.state.searchedCountry +
          "&start_date=" +
          this.state.selected_perMillion_start_date +
          "&end_date=" +
          this.state.selected_perMillion_end_date +
          "&perMillion=true"
        : "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=" +
          this.state.selected_filter_perMillion_status +
          "&country=" +
          this.state.searchedCountry +
          "&perMillion=true";
    //console.log(query);
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
          await newThis.populatePercentageData(json);
          newThis.forceUpdate(); //refresh page
          newThis.setState({
            perMillionGraphLoading: false,
          });
        } else {
          newThis.fetchPerMillionStats();
        }
      })
      .catch((error) => {
        Alert.alert(strings.ConnectionProblem, strings.CouldNotConnectToServer);
      });
  };

  //check user last symptom update date
  fetchLastSymptomUpdate = async () => {
    console.log("Just got in");
    let userID = await AsyncStorage.getItem("userID");
    console.log(userID);
    let newThis = this;
    await fetch(
      "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/users/" + userID,
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
        console.log(json);
        if (json !== undefined && json.length !== 0) {
          let lastSymptomUpdateDate = new Date(
            json.last_symptom_update.split("T")[0]
          );
          let todayDate = new Date();
          let differenceInDays =
            (todayDate.getTime() - lastSymptomUpdateDate.getTime()) /
            (1000 * 3600 * 24);
          console.log(
            "Difference in days " +
              Number.parseInt(Math.floor(differenceInDays)).toString()
          );
          if (Number.parseInt(Math.floor(differenceInDays)) >= 7) {
            console.log("Check");
            newThis.setState({
              popUpVisible: true,
            });
          } else {
            newThis.setState({
              popUpVisible: false,
            });
          }
        } else {
          newThis.fetchLastSymptomUpdate();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //gets rate statistics data based on selected criteria and populate UI
  fetchRateStatistics = async () => {
    let newThis = this;
    this.setState({ rateGraphLoading: true });
    var query =
      this.state.selected_rate_start_date.length > 1 &&
      this.state.selected_rate_end_date.length > 1
        ? "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=" +
          this.state.selected_filter_rate +
          "&country=" +
          this.state.searchedCountry +
          "&start_date=" +
          this.state.selected_rate_start_date +
          "&end_date=" +
          this.state.selected_rate_end_date
        : "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=" +
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
      "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=All&country=" +
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
    await fetch(
      "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics/countries",
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
          newThis.setState({
            countries: json,
            controlCountries: json,
          });
        } else {
          newThis.getCountryList();
        }
      })
      .catch((error) => {
        Alert.alert(strings.ConnectionProblem, strings.CouldNotConnectToServer);
      });
  };

  //populate daily data
  populateDailyData = (objList) => {
    console.log("Data length " + objList.length);
    this.state.daily_newCases_label = [""]; //reseting all data point labels
    this.state.daily_newCases_data_set = [0]; //reseting all data point labels

    //generating interval
    let customLength = objList.length - 1;
    if (objList.length === 7) {
      var interval = 1;
    } else {
      var interval = Math.ceil(customLength / 5);
    }
    let dataSet_counter = 0;
    let indexCounterSet = 0;

    while (dataSet_counter < customLength) {
      this.state.daily_newCases_data_set[indexCounterSet] =
        objList[dataSet_counter].y;
      this.state.daily_newCases_label[indexCounterSet] = this.dateConverter(
        objList[dataSet_counter].t.split("T")[0]
      );
      indexCounterSet += 1;
      dataSet_counter += interval;
    }
    this.state.daily_newCases_data_set[indexCounterSet] =
      objList[customLength].y;
    this.state.daily_newCases_label[indexCounterSet] = this.dateConverter(
      objList[customLength].t.split("T")[0]
    );
  };

  //Populates statistics data in to our state
  populate = (objList) => {
    this.state.graph_label = [""]; //reseting data label
    this.state.data_set = [0]; // reseting data set

    //generating interval
    let customLength = objList.length - 1;
    if (objList.length === 7) {
      var interval = 1;
    } else {
      var interval = Math.ceil(customLength / 5);
    }
    let dataSet_counter = 0;
    let indexCounterSet = 0;

    while (dataSet_counter < customLength) {
      this.state.data_set[indexCounterSet] = objList[dataSet_counter].y;
      this.state.graph_label[indexCounterSet] = this.dateConverter(
        objList[dataSet_counter].t.split("T")[0]
      );
      indexCounterSet += 1;
      dataSet_counter += interval;
    }
    this.state.data_set[indexCounterSet] = objList[customLength].y;
    this.state.graph_label[indexCounterSet] = this.dateConverter(
      objList[customLength].t.split("T")[0]
    );
  };

  //populate daily data
  populateRateData = (objList) => {
    this.state.rate_label = [""]; //reseting all data point labels
    this.state.rate_data_set = [0]; //reseting all data point labels

    //generating interval
    var interval = Math.floor(objList.length / 6);
    var remainder = objList.length % 6;
    if (interval === 0) {
      interval = 1;
      remainder = 0;
    }
    let dataSet_counter = 0;
    let indexCounterSet = 0;
    while (dataSet_counter < objList.length) {
      this.state.rate_data_set[indexCounterSet] = objList[dataSet_counter].y;

      indexCounterSet += 1;
      if (remainder > 0 && dataSet_counter + remainder === objList.length - 1) {
        dataSet_counter += remainder;
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
        graphLebel_counter + remainder === objList.length - 1
      ) {
        graphLebel_counter += remainder;
        continue;
      }
      graphLebel_counter += interval;
    }
  };

  //populate daily data
  populatePercentageData = (objList) => {
    this.state.percentage_label = [""]; //reseting all data point labels
    this.state.percentage_data_set = [0]; //reseting all data point labels

    //generating interval
    let customLength = objList.length - 1;
    if (objList.length === 7) {
      var interval = 1;
    } else {
      var interval = Math.ceil(customLength / 5);
    }
    let dataSet_counter = 0;
    let indexCounterSet = 0;

    while (dataSet_counter < customLength) {
      this.state.percentage_data_set[indexCounterSet] =
        objList[dataSet_counter].y;
      this.state.percentage_label[indexCounterSet] = this.dateConverter(
        objList[dataSet_counter].t.split("T")[0]
      );
      indexCounterSet += 1;
      dataSet_counter += interval;
    }
    this.state.percentage_data_set[indexCounterSet] = objList[customLength].y;
    this.state.percentage_label[indexCounterSet] = this.dateConverter(
      objList[customLength].t.split("T")[0]
    );
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
        ? "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=" +
          filterCriteria +
          "&country=" +
          this.state.searchedCountry +
          "&start_date=" +
          this.state.selected_daily_start_date +
          "&end_date=" +
          this.state.selected_daily_end_date +
          "&daily=true"
        : "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=" +
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
      "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/resources/mobile/statistics?language=" +
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

  getPermillionDescriptions = async () => {
    let newThis = this;
    await fetch(
      "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/resources/statistics-description?title=per-million&language=" +
        this.state.currLanguage,
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
            permillonStaticsDescription: json,
            permillonStaticsDescriptionLoading: false,
            searching: false,
          });
        } else {
          newThis.getPermillionDescriptions();
        }
      })
      .catch((error) => {
        Alert.alert(strings.ConnectionProblem, strings.CouldNotConnectToServer);
        // newThis.setState({
        //   staticsDescriptionLoading: false,
        // });
      });
  };

  setDailyStatsSelection = async (index) => {
    var minDate = new Date();
    switch (index) {
      case 0:
        await minDate.setDate(minDate.getDate() - 9);
        await this.setState({
          selectedIndex_daily: index,
          dailyGraphLoading: true,
          selected_daily_start_date: minDate.toISOString().split("T")[0],
        });
        break;
      case 1:
        await minDate.setMonth(minDate.getMonth() - 1);
        await this.setState({
          selectedIndex_daily: index,
          dailyGraphLoading: true,
          selected_daily_start_date: minDate.toISOString().split("T")[0],
        });
        break;
      case 2:
        await minDate.setMonth(minDate.getMonth() - 3);
        await this.setState({
          selectedIndex_daily: index,
          dailyGraphLoading: true,
          selected_daily_start_date: minDate.toISOString().split("T")[0],
        });
        break;
    }

    this.fetchDailyNewsCases();
  };

  setTotalStatsSelection = async (index) => {
    console.log("Indexxxx " + index);
    var minDate = new Date();
    switch (index) {
      case 0:
        await minDate.setDate(minDate.getDate() - 9);
        await this.setState({
          selectedIndex_total: index,
          totalGraphLoading: true,
          selected_total_start_date: minDate.toISOString().split("T")[0],
        });
        break;
      case 1:
        await minDate.setMonth(minDate.getMonth() - 1);
        await this.setState({
          selectedIndex_total: index,
          totalGraphLoading: true,
          selected_total_start_date: minDate.toISOString().split("T")[0],
        });
        break;
      case 2:
        await minDate.setMonth(minDate.getMonth() - 3);
        await this.setState({
          selectedIndex_total: index,
          totalGraphLoading: true,
          selected_total_start_date: minDate.toISOString().split("T")[0],
        });
        break;
    }

    this.fetchTotalStats();
  };

  setPerMillionStatsSelection = async (index) => {
    console.log("Indexxxx " + index);
    var minDate = new Date();
    switch (index) {
      case 0:
        await minDate.setDate(minDate.getDate() - 9);
        await this.setState({
          selectedIndex_perMillion: index,
          perMillionGraphLoading: true,
          selected_perMillion_start_date: minDate.toISOString().split("T")[0],
        });
        break;
      case 1:
        await minDate.setMonth(minDate.getMonth() - 1);
        await this.setState({
          selectedIndex_perMillion: index,
          perMillionGraphLoading: true,
          selected_perMillion_start_date: minDate.toISOString().split("T")[0],
        });
        break;
      case 2:
        await minDate.setMonth(minDate.getMonth() - 3);
        await this.setState({
          selectedIndex_perMillion: index,
          perMillionGraphLoading: true,
          selected_perMillion_start_date: minDate.toISOString().split("T")[0],
        });
        break;
    }

    this.fetchPerMillionStats();
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
          newThis.setState({
            descriptionTitle: json[0].criteria[position].name,
            description: json[0].criteria[position].explanation,
            graphDescriptionLoading: false,
            searching: false,
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

  handleTextChange = (item, query) =>
    item.name.toLowerCase().includes(query.toLowerCase());

  render() {
    const HIEGHT = Dimensions.get("window").height;
    const customTheme = this.context;
    return (
      <Layout style={{ flex: 1 }}>
        {this.state.popUpVisible ? (
          <Modal
            visible={this.state.popUpVisible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => this.setState({ popUpVisible: false })}
          >
            <Card disabled={true} style={{ margin: 10 }}>
              <Text style={{ fontSize: 20, marginBottom: 10 }}>
                {strings.userReminderToCheck}
              </Text>
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  fontSize: 10,
                  height: 13,
                  backgroundColor: " #ffffff00",
                  color: "#4da6ff",
                  borderColor: " #ffffff00",
                }}
                onPress={() => this.setState({ popUpVisible: false })}
              >
                <Text
                  style={{ fontSize: 20, marginBottom: 10, color: "#4da6ff" }}
                >
                  {strings.Dismiss}
                </Text>
              </TouchableOpacity>
            </Card>
          </Modal>
        ) : null}
        {/* search area and referesh button */}
        <Layout style={{ flexDirection: "row", marginLeft: 10 }}>
          <Autocomplete
            style={{
              width: screenWidth - 20,
              paddingTop: 10,
            }}
            accessoryRight={() =>
              this.state.searching ? <Spinner {...this.props} /> : <></>
            }
            placeholder="Enter Country"
            value={this.state.search}
            onChangeText={(text) => {
              this.setState({ search: text });
              this.setState({
                countries: this.state.controlCountries.filter((item) =>
                  this.handleTextChange(item, text)
                ),
              });
            }}
            onSelect={(index) => {
              this.setState(
                {
                  searchedCountry: this.state.countries[index].slug,
                  search: this.state.countries[index].name,
                },
                () => {
                  this.filterCountryNames();
                }
              );
            }}
          >
            {this.state.countries.map((item, index) => (
              <AutocompleteItem key={index} title={item.name} />
            ))}
          </Autocomplete>

          {/* <SearchableDropdown
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
            containerStyle={{ padding: 5, flex: 6, color: '#fff' }}
            textInputProps={{
              placeholder: this.state.search,
              placeholderTextColor:
                customTheme.theme === 'light' ? 'black' : 'white',
              underlineColorAndroid: 'transparent',
              style: {
                padding: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                color: 'black',
              },
            }}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: '#fff',
              borderColor: '#bbb',
              borderWidth: 1,
            }}
            itemTextStyle={{ color: '#000' }}
            items={this.state.countries}
            defaultIndex={0}
            resetValue={false}
            underlineColorAndroid='transparent'
          /> */}
          {/* <TouchableOpacity
            style={{ margin: 10 }}
            onPress={() => this.componentDidMount()}>
            <MaterialCommunityIcons name='reload' color='#0080ff' size={30} />
            <Text style={{ fontSize: 12 }}>{strings.Refresh}</Text>
          </TouchableOpacity> */}
        </Layout>

        <ScrollView>
          <Layout style={styles.container}>
            <Layout
              style={{
                flex: 1,
                alignContent: "center",
                justifyContent: "center",
                margin: 10,
                // width: Dimensions.get('window').width - 20,
                // backgroundColor: '#ffffff00',
              }}
            >
              <Text category="h6" style={{ fontWeight: "bold" }}>
                {strings.DailyStats}
              </Text>
            </Layout>
            <Layout
              level="3"
              style={{
                flexDirection: "row",
                width: Dimensions.get("screen").width - 10,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginBottom: 10,
                borderRadius: 10,
                paddingVertical: 10,
              }}
            >
              <TouchableOpacity
                disabled={true}
                style={{ alignItems: "center" }}
              >
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
                flex: 1,
                alignContent: "center",
                justifyContent: "center",
                margin: 10,
                // width: Dimensions.get('window').width - 20,
                // backgroundColor: '#ffffff00',
              }}
            >
              <Text category="h6" style={{ fontWeight: "bold" }}>
                {strings.TotalStats}
              </Text>
            </Layout>

            <Layout
              level="3"
              style={{
                flexDirection: "row",
                width: Dimensions.get("screen").width - 10,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginBottom: 10,
                // backgroundColor: 'white',

                borderRadius: 10,
                paddingVertical: 10,
              }}
            >
              <View style={{ alignItems: "center", flexWrap: "wrap" }}>
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

                <Text style={{ maxWidth: 95, textAlign: "center" }}>
                  {strings.TotalConfirmed}
                </Text>
              </View>
              <View style={{ alignItems: "center", flexWrap: "wrap" }}>
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

                <Text
                  style={{
                    maxWidth: 95,
                    textAlign: "center",
                  }}
                >
                  {strings.TotalRecovered}
                </Text>
              </View>
              <View style={{ alignItems: "center", flexWrap: "wrap" }}>
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

                <Text style={{ maxWidth: 95, textAlign: "center" }}>
                  {strings.TotalDeath}
                </Text>
              </View>
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
              <Divider />
              <Layout
                level="2"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 5,
                }}
              >
                <Text category="h6" style={{ fontWeight: "bold" }}>
                  {strings.DailyStatsGraph}
                </Text>
              </Layout>
              <Divider />
              {this.state.staticsDescriptionLoading ? (
                <Layout
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 5,
                  }}
                >
                  <ActivityIndicator size="small" color="gray" />
                  <Text appearance="hint" style={{ fontSize: 16 }}>
                    {strings.LoadingGraphDescription}
                  </Text>
                </Layout>
              ) : (
                <>
                  <Text
                    appearance="hint"
                    style={{ fontSize: 16, margin: 5, padding: 5 }}
                  >
                    {
                      this.state.staticsDescription[1].descriptions[0]
                        .description
                    }
                  </Text>
                  <Divider />
                </>
              )}

              <TabView
                style={{ marginHorizontal: 10 }}
                selectedIndex={this.state.selectedIndex_daily}
                onSelect={(index) => this.setDailyStatsSelection(index)}
              >
                <Tab title={strings.LastWeek}></Tab>
                <Tab title={strings.LastMonth}></Tab>
                <Tab title={strings.LastThreeMonths}></Tab>
                {/* <Tab title="Last Week"></Tab>
                <Tab title="Last Month"></Tab>
                <Tab title="Last Three Month"></Tab> */}
              </TabView>

              {this.state.dailyGraphLoading ? (
                <Layout
                  style={{
                    width: Dimensions.get("window").width,
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <TextLoader
                    text="Loading graph..."
                    textStyle={{ color: "#4da6ff" }}
                  />
                </Layout>
              ) : (
                <></>
              )}

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

              <Layout
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginBottom: 10,
                }}
              >
                <Button
                  size="tiny"
                  appearance={
                    this.state.selected_filter_daily_status ===
                    criterias.confirmed
                      ? "filled"
                      : "outline"
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter_daily_status: criterias.confirmed,
                    });
                    this.fetchDailyNewsCases();
                  }}
                >
                  {strings.Confirmed}
                </Button>
                <Button
                  size="tiny"
                  appearance={
                    this.state.selected_filter_daily_status ===
                    criterias.recoveries
                      ? "filled"
                      : "outline"
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter_daily_status: criterias.recoveries,
                    });
                    this.fetchDailyNewsCases();
                  }}
                >
                  {strings.Recovered}
                </Button>
                <Button
                  size="tiny"
                  appearance={
                    this.state.selected_filter_daily_status === criterias.deaths
                      ? "filled"
                      : "outline"
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter_daily_status: criterias.deaths,
                    });
                    this.fetchDailyNewsCases();
                  }}
                >
                  {strings.Death}
                </Button>

                {this.state.testCountDataExist ? (
                  <Button
                    size="tiny"
                    appearance={
                      this.state.selected_filter === criterias.numberOfTests
                        ? "filled"
                        : "outline"
                    }
                    onPress={async () => {
                      await this.setState({
                        selected_filter_daily_status: criterias.numberOfTests,
                      });
                      this.fetchDailyNewsCases();
                    }}
                  >
                    {strings.TestCounts}
                  </Button>
                ) : (
                  <></>
                )}
              </Layout>
              {/* <Divider /> */}
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
              <Divider />
              <Layout
                level="2"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 5,
                }}
              >
                <Text
                  category="h6"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {strings.TotalStatsGraph}
                </Text>
              </Layout>
              <Divider />

              {this.state.staticsDescriptionLoading ? (
                <Layout
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 5,
                  }}
                >
                  <ActivityIndicator
                    size="small"
                    color="gray"
                    style={{ marginHorizontal: 10 }}
                  />
                  <Text appearance="hint" style={{ fontSize: 16 }}>
                    {strings.LoadingGraphDescription}
                  </Text>
                </Layout>
              ) : (
                <>
                  <Text
                    appearance="hint"
                    style={{ fontSize: 16, margin: 5, padding: 5 }}
                  >
                    {
                      this.state.staticsDescription[0].descriptions[0]
                        .description
                    }
                  </Text>
                  <Divider />
                </>
              )}

              <TabView
                style={{ marginHorizontal: 10 }}
                selectedIndex={this.state.selectedIndex_total}
                onSelect={(index) => this.setTotalStatsSelection(index)}
              >
                <Tab title={strings.LastWeek}></Tab>
                <Tab title={strings.LastMonth}></Tab>
                <Tab title={strings.LastThreeMonths}></Tab>
                {/* <Tab title="Last Week"></Tab>
                <Tab title="Last Month"></Tab>
                <Tab title="Last Three Month"></Tab> */}
              </TabView>

              {this.state.totalGraphLoading ? (
                <Layout
                  style={{
                    width: Dimensions.get("window").width,
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <TextLoader
                    text="Loading graph..."
                    textStyle={{ color: "#4da6ff" }}
                  />
                </Layout>
              ) : (
                <></>
              )}

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

              <Layout
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  size="tiny"
                  appearance={
                    this.state.selected_filter === criterias.confirmed
                      ? "filled"
                      : "outline"
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter: criterias.confirmed,
                    });

                    this.fetchTotalStats();
                  }}
                >
                  {strings.Confirmed}
                </Button>
                <Button
                  size="tiny"
                  appearance={
                    this.state.selected_filter === criterias.recoveries
                      ? "filled"
                      : "outline"
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter: criterias.recoveries,
                    });

                    this.fetchTotalStats();
                  }}
                >
                  {strings.Recovered}
                </Button>
                <Button
                  size="tiny"
                  appearance={
                    this.state.selected_filter === criterias.deaths
                      ? "filled"
                      : "outline"
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter: criterias.deaths,
                    });
                    this.fetchTotalStats();
                  }}
                >
                  {strings.Deaths}
                </Button>
                {this.state.testCountDataExist ? (
                  <Button
                    size="tiny"
                    appearance={
                      this.state.selected_filter === criterias.numberOfTests
                        ? "filled"
                        : "outline"
                    }
                    onPress={async () => {
                      await this.setState({
                        selected_filter: criterias.numberOfTests,
                      });
                      this.fetchTotalStats();
                    }}
                  >
                    {strings.TestCounts}
                  </Button>
                ) : null}
              </Layout>
              <Layout padding={10} style={{ marginBottom: 20 }}>
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

            <Layout style={styles.container_graph}>
              <Divider />
              <Layout
                level="2"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 5,
                }}
              >
                <Text
                  category="h6"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {strings.PercentagePerMillion}
                </Text>
              </Layout>
              <Divider />

              {this.state.permillonStaticsDescriptionLoading ? (
                <Layout
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 5,
                  }}
                >
                  <ActivityIndicator
                    size="small"
                    color="gray"
                    style={{ marginHorizontal: 10 }}
                  />
                  <Text appearance="hint" style={{ fontSize: 16 }}>
                    {strings.LoadingGraphDescription}
                  </Text>
                </Layout>
              ) : (
                <>
                  <Text
                    appearance="hint"
                    style={{ fontSize: 16, margin: 5, padding: 5 }}
                  >
                    {this.state.permillonStaticsDescription[0].description}
                  </Text>
                  <Divider />
                </>
              )}
              <TabView
                style={{ marginHorizontal: 10 }}
                selectedIndex={this.state.selectedIndex_perMillion}
                onSelect={(index) => this.setPerMillionStatsSelection(index)}
              >
                <Tab title={strings.LastWeek}></Tab>
                <Tab title={strings.LastMonth}></Tab>
                <Tab title={strings.LastThreeMonths}></Tab>
                {/* <Tab title="Last Week"></Tab>
                <Tab title="Last Month"></Tab>
                <Tab title="Last Three Month"></Tab> */}
              </TabView>

              {this.state.perMillionGraphLoading ? (
                <Layout
                  style={{
                    width: Dimensions.get("window").width,
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <TextLoader
                    text="Loading graph..."
                    textStyle={{ color: "#4da6ff" }}
                  />
                </Layout>
              ) : (
                <></>
              )}

              <LineChart
                data={{
                  labels: this.state.percentage_label,
                  datasets: [{ data: this.state.percentage_data_set }],
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

              <Layout
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  marginBottom: 20,
                }}
              >
                <Button
                  size="tiny"
                  appearance={
                    this.state.selected_filter_perMillion_status ===
                    criterias.confirmed
                      ? "filled"
                      : "outline"
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter_perMillion_status: criterias.confirmed,
                    });

                    this.fetchPerMillionStats();
                  }}
                >
                  {strings.Confirmed}
                </Button>
                <Button
                  size="tiny"
                  appearance={
                    this.state.selected_filter_perMillion_status ===
                    criterias.recoveries
                      ? "filled"
                      : "outline"
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter_perMillion_status: criterias.recoveries,
                    });

                    this.fetchPerMillionStats();
                  }}
                >
                  {strings.Recovered}
                </Button>
                <Button
                  size="tiny"
                  appearance={
                    this.state.selected_filter_perMillion_status ===
                    criterias.deaths
                      ? "filled"
                      : "outline"
                  }
                  onPress={async () => {
                    await this.setState({
                      selected_filter_perMillion_status: criterias.deaths,
                    });
                    this.fetchPerMillionStats();
                  }}
                >
                  {strings.Deaths}
                </Button>
                {this.state.testCountDataExist ? (
                  <Button
                    size="tiny"
                    appearance={
                      this.state.selected_filter_perMillion_status ===
                      criterias.numberOfTests
                        ? "filled"
                        : "outline"
                    }
                    onPress={async () => {
                      await this.setState({
                        selected_filter_perMillion_status:
                          criterias.numberOfTests,
                      });
                      this.fetchPerMillionStats();
                    }}
                  >
                    {strings.TestCounts}
                  </Button>
                ) : null}
              </Layout>
              {/* <Layout padding={10} style={{ marginBottom: 20 }}>
                {this.state.permillonStaticsDescriptionLoading ? (
                  <Layout flexDirection="row" alignSelf="center">
                    <ActivityIndicator size="small" color="gray" />
                    <Text style={{ fontSize: 16, color: "gray" }}>
                      {strings.LoadingCriteriaDescription}
                    </Text>
                  </Layout>
                ) : this.state.permillonStaticsDescription[0].criteria.length!==0 ?
                (this.state.selected_filter === criterias.confirmed ? (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.permillonStaticsDescription[0]
                      .criteria[1].name +
                      ": " +
                      this.state.permillonStaticsDescription[0]
                        .criteria[1].explanation}
                  </Text>
                ) : this.state.selected_filter === criterias.recoveries ? (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.permillonStaticsDescription[0]
                      .criteria[3].name +
                      ": " +
                      this.state.permillonStaticsDescription[0]
                        .criteria[3].explanation}
                  </Text>
                ) : this.state.selected_filter === criterias.deaths ? (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.permillonStaticsDescription[0]
                      .criteria[2].name +
                      ": " +
                      this.state.permillonStaticsDescription[0]
                        .criteria[2].explanation}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 16, color: "gray", marginLeft: 10 }}>
                    {this.state.permillonStaticsDescription[0]
                      .criteria[0].name +
                      ": " +
                      this.state.permillonStaticsDescription[0]
                        .criteria[0].explanation}
                  </Text>
                )):null}
              </Layout> */}
            </Layout>
          </Layout>
        </ScrollView>
      </Layout>
    ); // end of return
  } // end of render function
} // end of class StaticsPage

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#eee",
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
    height: screenHeight / 10,
    width: screenWidth / 2 - 30,
    margin: 10,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cards_active: {
    backgroundColor: "#4da6ff",
    borderRadius: 20,
    height: screenHeight / 10,
    width: screenWidth / 2 - 30,
    margin: 10,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  cards_recovered: {
    backgroundColor: "#30cc2a",
    borderRadius: 20,
    marginTop: 15,
    height: screenHeight / 10,
    width: screenWidth / 2 - 30,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cards_death: {
    backgroundColor: "#514443",
    borderRadius: 20,
    height: screenHeight / 10,
    width: screenWidth / 2 - 30,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  container_graph: {
    marginTop: 5,
    flex: 1,
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
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  avatar: {
    marginHorizontal: 4,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  tabContainer: {
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DataAnalyticsOld;
