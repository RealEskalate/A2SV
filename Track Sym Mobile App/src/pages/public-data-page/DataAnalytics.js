import React from 'react';
import { SearchBar } from 'react-native-elements';
import {
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  View,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as criterias from './Criterias';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-datepicker';
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
  IndexPath,
  Select,
  SelectGroup,
  SelectItem,
} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import SearchableDropdown from 'react-native-searchable-dropdown';
import userIDStore from '../../data-management/user-id-data/userIDStore';
import { TextLoader } from 'react-native-indicator';
import { strings } from '../../localization/localization';
import languageStore from '../../data-management/language_data/languageStore';
import { ThemeContext } from '../../../assets/themes/theme-context';
import AsyncStorage from '@react-native-community/async-storage';
const CalendarIcon = (props) => <Icon {...props} name='calendar' />;

class DataAnalytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchedCountry: 'World',
      search: 'World',
      currLanguage: 'English',
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
      kittenStartDate: new Date(),
      selected_graph_type: '',
      selected_graph_filter: criterias.confirmed,
      selected_graph_start_date: '',
      selected_graph_end_date: new Date().toISOString().split('T')[0],
      graphTypes: [
        strings.DailyStatsGraph,
        strings.TotalStatsGraph,
        strings.PercentagePerMillion,
      ],
      dateRanges: [
        strings.LastWeek,
        strings.LastMonth,
        strings.LastThreeMonths,
      ],
      filterParameters: [strings.Confirmed, strings.Recovered, strings.Death],
      selected_graph_type_index: new IndexPath(0),
      selected_date_range_index: new IndexPath(0),
      selected_filter_parameters: new IndexPath(0),
      selected_graph_data_set: [0],
      selected_graph_labels: [''],
      main_graph_loading: false,
      descriptionVisiblity: false,
      graph_descriptions: [
        strings.LoadingGraphDescription,
        strings.LoadingGraphDescription,
        strings.LoadingGraphDescription,
      ],
    };
    languageStore.subscribe(() => {
      strings.setLanguage(languageStore.getState());
      this.setState({ currLangCode: languageStore.getState() });
      this.setState({
        graphTypes: [
          strings.DailyStatsGraph,
          strings.TotalStatsGraph,
          strings.PercentagePerMillion,
        ],
        dateRanges: [
          strings.LastWeek,
          strings.LastMonth,
          strings.LastThreeMonths,
        ],
        graph_descriptions: [
          strings.LoadingGraphDescription,
          strings.LoadingGraphDescription,
          strings.LoadingGraphDescription,
        ],
        filterParameters: [strings.Confirmed, strings.Recovered, strings.Death],
      });
      this.componentDidMount();
    });
  }

  static contextType = ThemeContext;

  filterCountryNames = async () => {
    await this.getTotalData()
      .then(this.fetchTotalStats())
      .then(this.fetchDailyNewsCases())
      .then(this.getCountryList())
      .then(this.fetchPerMillionStats())
      // .then(this.fetchLastSymptomUpdate())
      .then(this.checkIfDataExist(criterias.numberOfTests)) //check if number of test case data exist
      .catch(() => {
        console.log('Concurrency Issue');
      });
  };

  componentDidMount = async () => {
    console.log(this.state.selected_daily_start_date);
    await this.setState({ currLangCode: languageStore.getState() });
    switch (this.state.currLangCode) {
      case 'am':
        await this.setState({ currLanguage: 'Amharic' });
        break;
      case 'en':
        await this.setState({ currLanguage: 'English' });
        break;
      case 'orm':
        await this.setState({ currLanguage: 'Oromo' });
        break;
      case 'tr':
        await this.setState({ currLanguage: 'Turkish' });
        break;
    }
    await this.getTotalData()
      .then(this.fetchDailyNewsCases())
      // .then(this.fetchDailyNewsCases())
      .then(this.getCountryList())
      // .then(this.fetchPerMillionStats())
      // // .then(this.fetchLastSymptomUpdate())
      // .then(this.checkIfDataExist(criterias.numberOfTests)) //check if number of test case data exist
      .then(this.getDescriptions())
      .then(this.getPermillionDescriptions())
      .catch((error) => {
        console.log('Concurrency Issue');
      });
  };

  //gets statistics data based on selected criteria and populate UI
  fetchTotalStats = async () => {
    //console.log("Bearer " + userIDStore.getState().userToken);
    let newThis = this;
    this.setState({ main_graph_loading: true });
    var query =
      this.state.selected_graph_start_date.length > 1 &&
      this.state.selected_graph_end_date.length > 1
        ? 'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=' +
          this.state.selected_graph_filter +
          '&country=' +
          this.state.searchedCountry +
          '&start_date=' +
          this.state.selected_graph_start_date +
          '&end_date=' +
          this.state.selected_graph_end_date
        : 'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=' +
          this.state.selected_graph_filter +
          '&country=' +
          this.state.searchedCountry;
    //console.log(query);
    await fetch(query, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + userIDStore.getState().userToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json !== undefined && json.length !== 0) {
          await newThis.populateDataPoints(json);
          newThis.forceUpdate(); //refresh page
          newThis.setState({
            main_graph_loading: false,
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
    this.setState({ main_graph_loading: true });
    var query =
      this.state.selected_graph_start_date.length > 1 &&
      this.state.selected_graph_end_date.length > 1
        ? 'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=' +
          this.state.selected_graph_filter +
          '&country=' +
          this.state.searchedCountry +
          '&start_date=' +
          this.state.selected_graph_start_date +
          '&end_date=' +
          this.state.selected_graph_end_date +
          '&daily=true'
        : 'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=' +
          this.state.selected_graph_filter +
          '&country=' +
          this.state.searchedCountry +
          '&daily=true';
    await fetch(query, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + userIDStore.getState().userToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json !== undefined && json.length !== 0) {
          await newThis.populateDataPoints(json);
          newThis.forceUpdate(); //refresh page
          newThis.setState({
            main_graph_loading: false,
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
    this.setState({ main_graph_loading: true });
    var query =
      this.state.selected_graph_start_date.length > 1 &&
      this.state.selected_graph_end_date.length > 1
        ? 'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=' +
          this.state.selected_graph_filter +
          '&country=' +
          this.state.searchedCountry +
          '&start_date=' +
          this.state.selected_graph_start_date +
          '&end_date=' +
          this.state.selected_graph_end_date +
          '&perMillion=true'
        : 'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=' +
          this.state.selected_graph_filter +
          '&country=' +
          this.state.searchedCountry +
          '&perMillion=true';
    //console.log(query);
    await fetch(query, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + userIDStore.getState().userToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json !== undefined && json.length !== 0) {
          await newThis.populateDataPoints(json);
          newThis.forceUpdate(); //refresh page
          newThis.setState({
            main_graph_loading: false,
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
    console.log('Just got in');
    let userID = await AsyncStorage.getItem('userID');
    console.log(userID);
    let newThis = this;
    await fetch(
      'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/users/' + userID,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userIDStore.getState().userToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then(async (json) => {
        console.log(json);
        if (json !== undefined && json.length !== 0) {
          let lastSymptomUpdateDate = new Date(
            json.last_symptom_update.split('T')[0]
          );
          let todayDate = new Date();
          let differenceInDays =
            (todayDate.getTime() - lastSymptomUpdateDate.getTime()) /
            (1000 * 3600 * 24);
          console.log(
            'Difference in days ' +
              Number.parseInt(Math.floor(differenceInDays)).toString()
          );
          if (Number.parseInt(Math.floor(differenceInDays)) >= 7) {
            console.log('Check');
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
        ? 'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=' +
          this.state.selected_filter_rate +
          '&country=' +
          this.state.searchedCountry +
          '&start_date=' +
          this.state.selected_rate_start_date +
          '&end_date=' +
          this.state.selected_rate_end_date
        : 'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=' +
          this.state.selected_filter_rate +
          '&country=' +
          this.state.searchedCountry;
    await fetch(query, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + userIDStore.getState().userToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
    let dateList = date.split('-');
    let month = parseInt(dateList[1]);
    let monthInWord = this.state.Months[month - 1];
    return monthInWord + ' ' + dateList[2];
  }

  //get total numbers of the specified country and populate UI
  getTotalData = async () => {
    this.setState({
      totalLoading: true,
    });
    let newThis = this;
    await fetch(
      'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=All&country=' +
        this.state.searchedCountry,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userIDStore.getState().userToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
      'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics/countries',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userIDStore.getState().userToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
  populateDataPoints = (objList) => {
    console.log('Data length ' + objList.length);
    this.state.selected_graph_labels = ['']; //reseting all data point labels
    this.state.selected_graph_data_set = [0]; //reseting all data point labels

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
      this.state.selected_graph_data_set[indexCounterSet] =
        objList[dataSet_counter].y;
      this.state.selected_graph_labels[indexCounterSet] = this.dateConverter(
        objList[dataSet_counter].t.split('T')[0]
      );
      indexCounterSet += 1;
      dataSet_counter += interval;
    }
    this.state.selected_graph_data_set[indexCounterSet] =
      objList[customLength].y;
    this.state.selected_graph_labels[indexCounterSet] = this.dateConverter(
      objList[customLength].t.split('T')[0]
    );
  };

  //Populates statistics data in to our state
  populate = (objList) => {
    this.state.graph_label = ['']; //reseting data label
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
        objList[dataSet_counter].t.split('T')[0]
      );
      indexCounterSet += 1;
      dataSet_counter += interval;
    }
    this.state.data_set[indexCounterSet] = objList[customLength].y;
    this.state.graph_label[indexCounterSet] = this.dateConverter(
      objList[customLength].t.split('T')[0]
    );
  };

  //populate daily data
  populateRateData = (objList) => {
    this.state.rate_label = ['']; //reseting all data point labels
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
        objList[graphLebel_counter].t.split('T')[0]
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
    this.state.percentage_label = ['']; //reseting all data point labels
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
        objList[dataSet_counter].t.split('T')[0]
      );
      indexCounterSet += 1;
      dataSet_counter += interval;
    }
    this.state.percentage_data_set[indexCounterSet] = objList[customLength].y;
    this.state.percentage_label[indexCounterSet] = this.dateConverter(
      objList[customLength].t.split('T')[0]
    );
  };

  //Reformat number
  reformatNumber(nStr) {
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  //Reformat numbers with large number suffix
  intToString(value) {
    let newValue = value;
    const suffixes = ['', 'K', 'M', 'B', 'T'];
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
        ? 'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=' +
          filterCriteria +
          '&country=' +
          this.state.searchedCountry +
          '&start_date=' +
          this.state.selected_daily_start_date +
          '&end_date=' +
          this.state.selected_daily_end_date +
          '&daily=true'
        : 'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics?criteria=' +
          filterCriteria +
          '&country=' +
          this.state.searchedCountry +
          '&daily=true';
    fetch(query, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + userIDStore.getState().userToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
    return year + '-' + month + '-' + day;
  }

  //get minimum date for selection
  getMinimumDate() {
    return '2019-12-31';
  }

  displayInfoIcon = (styles) => (
    <Icon
      {...styles}
      name={
        this.state.descriptionVisiblity
          ? 'question-mark-circle'
          : 'question-mark-circle-outline'
      }
      onPress={() =>
        this.setState({
          descriptionVisiblity: !this.state.descriptionVisiblity,
        })
      }
    />
  );
  //fetches description for different age group
  getDescriptions = async () => {
    let newThis = this;
    await fetch(
      'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/resources/mobile/statistics?language=' +
        this.state.currLanguage +
        '&filter=adults',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userIDStore.getState().userToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json !== undefined && json.length !== 0) {
          await newThis.setState({
            graph_descriptions: [
              json[1].descriptions[0].description,
              json[0].descriptions[0].description,
              newThis.state.graph_descriptions[2],
            ],
          });

          console.log(this.state.staticsDescription);
        } else {
          newThis.getDescriptions();
        }
      })
      .catch((error) => {
        Alert.alert(strings.ConnectionProblem, strings.CouldNotConnectToServer);
        // newThis.setState({
        //   graph_descriptions:[strings.UnableLoadingGraphDescription,strings.UnableLoadingGraphDescription,newThis.state.graph_descriptions[2]]
        // });
      });
  };

  getPermillionDescriptions = async () => {
    let newThis = this;
    await fetch(
      'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/resources/statistics-description?title=per-million&language=' +
        this.state.currLanguage,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userIDStore.getState().userToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json !== undefined && json.length !== 0) {
          await newThis.setState({
            graph_descriptions: [
              newThis.state.graph_descriptions[0],
              newThis.state.graph_descriptions[1],
              json[0].description,
            ],
          });
        } else {
          newThis.getPermillionDescriptions();
        }
      })
      .catch((error) => {
        Alert.alert(strings.ConnectionProblem, strings.CouldNotConnectToServer);
        // newThis.setState({
        //   graph_descriptions:[newThis.state.graph_descriptions[0],newThis.state.graph_descriptions[1],strings.UnableLoadingGraphDescription]
        //   });
      });
  };

  setGraphTypesData = async (index) => {
    console.log(index.row);
    switch (index.row) {
      case 0:
        console.log('Daily graph type');
        await this.setState({
          selected_graph_type_index: index,
          main_graph_loading: true,
        });
        this.fetchDailyNewsCases();
        break;
      case 1:
        await this.setState({
          selected_graph_type_index: index,
          main_graph_loading: true,
        });
        this.fetchTotalStats();
        break;

      case 2:
        await this.setState({
          selected_graph_type_index: index,
          main_graph_loading: true,
        });
        this.fetchPerMillionStats();
        break;
    }
  };

  setGraphDateRange = async (index) => {
    var minDate = new Date();
    switch (index.row) {
      case 0:
        await minDate.setDate(minDate.getDate() - 9);
        await this.setState({
          selected_date_range_index: index,
          main_graph_loading: true,
          selected_graph_start_date: minDate.toISOString().split('T')[0],
        });
        break;
      case 1:
        await minDate.setMonth(minDate.getMonth() - 1);
        await this.setState({
          selected_date_range_index: index,
          main_graph_loading: true,
          selected_graph_start_date: minDate.toISOString().split('T')[0],
        });
        break;

      case 2:
        await minDate.setMonth(minDate.getMonth() - 3);
        await this.setState({
          selected_date_range_index: index,
          main_graph_loading: true,
          selected_graph_start_date: minDate.toISOString().split('T')[0],
        });
        break;
    }
    switch (this.state.selected_graph_type_index.row) {
      case 0:
        this.fetchDailyNewsCases();
        break;
      case 1:
        this.fetchTotalStats();
        break;
      case 2:
        this.fetchPerMillionStats();
        break;
    }
  };

  setGraphFilterType = async (index) => {
    switch (index.row) {
      case 0:
        await this.setState({
          selected_filter_parameters: index,
          main_graph_loading: true,
          selected_graph_filter: criterias.confirmed,
        });
        break;
      case 1:
        await this.setState({
          selected_filter_parameters: index,
          main_graph_loading: true,
          selected_graph_filter: criterias.recoveries,
        });
        break;

      case 2:
        await this.setState({
          selected_filter_parameters: index,
          main_graph_loading: true,
          selected_graph_filter: criterias.deaths,
        });
        break;
    }
    switch (this.state.selected_graph_type_index.row) {
      case 0:
        this.fetchDailyNewsCases();
        break;
      case 1:
        this.fetchTotalStats();
        break;
      case 2:
        this.fetchPerMillionStats();
        break;
    }
  };

  handleTextChange = (item, query) =>
    item.name.toLowerCase().includes(query.toLowerCase());
  renderOption = (title) => <SelectItem title={title} />;

  render() {
    const HIEGHT = Dimensions.get('window').height;
    const customTheme = this.context;
    return (
      <Layout style={{ flex: 1 }}>
        {this.state.popUpVisible ? (
          <Modal
            visible={this.state.popUpVisible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => this.setState({ popUpVisible: false })}>
            <Card disabled={true} style={{ margin: 10 }}>
              <Text style={{ fontSize: 20, marginBottom: 10 }}>
                {strings.userReminderToCheck}
              </Text>
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  fontSize: 10,
                  height: 13,
                  backgroundColor: ' #ffffff00',
                  color: '#4da6ff',
                  borderColor: ' #ffffff00',
                }}
                onPress={() => this.setState({ popUpVisible: false })}>
                <Text
                  style={{ fontSize: 20, marginBottom: 10, color: '#4da6ff' }}>
                  {strings.Dismiss}
                </Text>
              </TouchableOpacity>
            </Card>
          </Modal>
        ) : null}
        {/* search area and referesh button */}
        <Layout style={{ flexDirection: 'row', marginLeft: 10 }}>
          <Autocomplete
            style={{
              width: screenWidth - 20,
              paddingTop: 10,
            }}
            accessoryRight={() =>
              this.state.searching ? <Spinner {...this.props} /> : <></>
            }
            placeholder={strings.EnterCountry}
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
            }}>
            {this.state.countries.map((item, index) => (
              <AutocompleteItem key={index} title={item.name} />
            ))}
          </Autocomplete>
        </Layout>

        <ScrollView>
          <Layout style={styles.container}>
            <Layout
              style={{
                flex: 1,
                alignContent: 'center',
                justifyContent: 'center',
                margin: 10,
                // width: Dimensions.get('window').width - 20,
                // backgroundColor: '#ffffff00',
              }}>
              <Text category='h6' style={{ fontWeight: 'bold' }}>
                {strings.DailyStats}
              </Text>
            </Layout>
            <Layout
              level='3'
              style={{
                flexDirection: 'row',
                width: Dimensions.get('screen').width - 10,
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                marginBottom: 10,
                borderRadius: 10,
                paddingVertical: 10,
              }}>
              <TouchableOpacity
                disabled={true}
                style={{ alignItems: 'center' }}>
                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size='small'
                    color='#ffa500'
                    style={{ margin: 5 }}
                  />
                ) : (
                  <Text style={{ fontSize: 24, color: '#ffa500' }}>
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
                style={{ alignItems: 'center' }}>
                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size='small'
                    color='#039be5'
                    style={{ margin: 5 }}
                  />
                ) : (
                  <Text style={{ fontSize: 24, color: '#039be5' }}>
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
                style={{ alignItems: 'center' }}>
                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size='small'
                    color='red'
                    style={{ margin: 5 }}
                  />
                ) : (
                  <Text style={{ fontSize: 24, color: 'red' }}>
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
                alignContent: 'center',
                justifyContent: 'center',
                margin: 10,
                // width: Dimensions.get('window').width - 20,
                // backgroundColor: '#ffffff00',
              }}>
              <Text category='h6' style={{ fontWeight: 'bold' }}>
                {strings.TotalStats}
              </Text>
            </Layout>

            <Layout
              level='3'
              style={{
                flexDirection: 'row',
                width: Dimensions.get('screen').width - 10,
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                marginBottom: 10,
                // backgroundColor: 'white',

                borderRadius: 10,
                paddingVertical: 10,
              }}>
              <View style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size='small'
                    color='#ffa500'
                    style={{ margin: 5 }}
                  />
                ) : (
                  <Text style={{ fontSize: 24, color: '#ffa500' }}>
                    {this.reformatNumber(
                      String(
                        this.state.TotalStatisticsData[
                          this.state.TotalStatisticsData.length - 1
                        ].Confirmed
                      )
                    )}
                  </Text>
                )}

                <Text style={{ maxWidth: 95, textAlign: 'center' }}>
                  {strings.TotalConfirmed}
                </Text>
              </View>
              <View style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size='small'
                    color='#039be5'
                    style={{ margin: 5 }}
                  />
                ) : (
                  <Text style={{ fontSize: 24, color: '#039be5' }}>
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
                    textAlign: 'center',
                  }}>
                  {strings.TotalRecovered}
                </Text>
              </View>
              <View style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                {this.state.totalLoading ? (
                  <ActivityIndicator
                    size='small'
                    color='red'
                    style={{ margin: 5 }}
                  />
                ) : (
                  <Text style={{ fontSize: 24, color: 'red' }}>
                    {this.reformatNumber(
                      String(
                        this.state.TotalStatisticsData[
                          this.state.TotalStatisticsData.length - 1
                        ].Deaths
                      )
                    )}
                  </Text>
                )}

                <Text style={{ maxWidth: 95, textAlign: 'center' }}>
                  {strings.TotalDeath}
                </Text>
              </View>
            </Layout>

            <Layout
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,

                // backgroundColor: "#eee",
              }}>
              <Layout
                style={{
                  flex: 1,
                  alignContent: 'center',
                  justifyContent: 'center',
                  margin: 10,
                  // width: Dimensions.get('window').width - 20,
                  // backgroundColor: '#ffffff00',
                }}>
                <Text category='h6' style={{ fontWeight: 'bold' }}>
                  {strings.GraphicalAnalysis}
                </Text>
              </Layout>

              <Layout
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  // marginBottom: 10,
                  marginHorizontal: 10,
                  marginVertical: 5,
                }}>
                <Select
                  accessoryLeft={this.displayInfoIcon}
                  style={{
                    flex: 1,
                    margin: 2,
                  }}
                  size='medium'
                  placeholder={
                    this.state.graphTypes[
                      this.state.selected_graph_type_index.row
                    ]
                  }
                  value={
                    this.state.graphTypes[
                      this.state.selected_graph_type_index.row
                    ]
                  }
                  selectedIndex={this.state.selected_graph_type_index}
                  onSelect={(index) => this.setGraphTypesData(index)}>
                  {this.state.graphTypes.map(this.renderOption)}
                </Select>
              </Layout>
              {this.state.descriptionVisiblity ? (
                <Text
                  appearance='hint'
                  style={{ fontSize: 16, margin: 10, padding: 5 }}>
                  {
                    this.state.graph_descriptions[
                      this.state.selected_graph_type_index - 1
                    ]
                  }
                </Text>
              ) : (
                <></>
              )}
              <Layout
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginBottom: 10,
                  marginTop: 10,
                }}>
                <Select
                  style={{
                    flex: 0.8,
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}
                  size='small'
                  placeholder={
                    this.state.dateRanges[
                      this.state.selected_date_range_index.row
                    ]
                  }
                  value={
                    this.state.dateRanges[
                      this.state.selected_date_range_index.row
                    ]
                  }
                  selectedIndex={this.state.selected_date_range_index}
                  onSelect={(index) => this.setGraphDateRange(index)}>
                  {this.state.dateRanges.map(this.renderOption)}
                </Select>
                <Select
                  style={{
                    flex: 1,
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}
                  size='small'
                  placeholder={
                    this.state.filterParameters[
                      this.state.selected_filter_parameters.row
                    ]
                  }
                  value={
                    this.state.filterParameters[
                      this.state.selected_filter_parameters.row
                    ]
                  }
                  selectedIndex={this.state.selected_filter_parameters}
                  onSelect={(index) => this.setGraphFilterType(index)}>
                  {this.state.filterParameters.map(this.renderOption)}
                </Select>

                {/* {this.state.testCountDataExist ? (
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
                )} */}
              </Layout>

              {this.state.main_graph_loading ? (
                <Layout
                  style={{
                    width: Dimensions.get('window').width,
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                  <TextLoader
                    text='Loading graph...'
                    textStyle={{ color: '#4da6ff' }}
                  />
                </Layout>
              ) : (
                <></>
              )}

              <LineChart
                data={{
                  labels: this.state.selected_graph_labels,
                  datasets: [
                    {
                      data: this.state.selected_graph_data_set,
                    },
                  ],
                }}
                verticalLabelRotation={60}
                width={Dimensions.get('window').width} // from react-nativ
                height={HIEGHT / 2}
                formatYLabel={(Y) => this.intToString(Number(Y))}
                fromZero={true}
                chartConfig={{
                  backgroundColor: '#0080ff',
                  backgroundGradientFrom: '#0080ff',
                  backgroundGradientTo: '#0080ff',
                  scrollableDotFill: '#ffffff',
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
          </Layout>
        </ScrollView>
      </Layout>
    ); // end of return
  } // end of render function
} // end of class StaticsPage

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  select: {
    flex: 1,
    margin: 2,
    fontSize: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    // backgroundColor: "#eee",
  },
  backdrop_container: {
    minHeight: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cards_total: {
    backgroundColor: '#fc2314',
    borderRadius: 20,
    height: screenHeight / 10,
    width: screenWidth / 2 - 30,
    margin: 10,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cards_active: {
    backgroundColor: '#4da6ff',
    borderRadius: 20,
    height: screenHeight / 10,
    width: screenWidth / 2 - 30,
    margin: 10,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cards_recovered: {
    backgroundColor: '#30cc2a',
    borderRadius: 20,
    marginTop: 15,
    height: screenHeight / 10,
    width: screenWidth / 2 - 30,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cards_death: {
    backgroundColor: '#514443',
    borderRadius: 20,
    height: screenHeight / 10,
    width: screenWidth / 2 - 30,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container_graph: {
    marginTop: 5,
    flex: 1,
  },
  touchable_buttons: {
    backgroundColor: '#1976d2',
    padding: 5,
    marginRight: 5,
    borderRadius: 10,
  },
  touchable_buttons_pressed: {
    backgroundColor: '#F5F6FA',
    padding: 5,
    marginRight: 5,
    borderRadius: 10,
  },
  text_style: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  text_style_pressed: {
    color: '#1976d2',
    fontSize: 15,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  avatar: {
    marginHorizontal: 4,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tabContainer: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DataAnalytics;
