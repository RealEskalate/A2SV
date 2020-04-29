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
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import * as criterias from "./Criterias.js";

export default class StaticsPage extends React.Component {
  state = {
    selected_filter: criterias.confirmed, // sets the current filtering parameter on the graph
    graph_label: [""],
    data_set: [0],
    searchedCountry: "Ethiopia",
    TotalStatisticsData: [],
    StatisticsData: {},
    Confirmed: 0,
    Death: 0,
    Recovered: 0,
    Total: 0,
  };

  componentDidMount() {
    let interval = setInterval(() => {
      this.populateData();
    }, 1000);
    let interval2 = setInterval(() => {
      this.GetTotalData();
    }, 30000);
  }

  populate(objList) {
    let dataSet_counter = 0;
    objList.map((data) => {
      this.state.data_set[dataSet_counter] = data.y;
      dataSet_counter += 1;
    });
    let graphLebel_counter = 0;
    objList.map((data) => {
      this.state.graph_label[graphLebel_counter] = data.t;
      graphLebel_counter += 1;
    });
  }

  fetchNumberOfDeath() {
    fetch("https://sym-track.herokuapp.com/api/statistics", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: this.state.searchedCountry,
        criteria: criterias.deaths,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        this.populate(json);
        this.forceUpdate();
      })
      .catch((error) => {
        alert("Couldn't connect", "Error in connection..");
      });
  }

  fetchNumberOfRecovered() {
    fetch("https://sym-track.herokuapp.com/api/statistics", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: this.state.searchedCountry,
        criteria: criterias.recoveries,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        this.populate(json);
        this.forceUpdate();
      })
      .catch((error) => {
        alert("Couldn't connect", "Error in connection..");
      });
  }

  fetchNumberOfConfirmed() {
    fetch("https://sym-track.herokuapp.com/api/statistics", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: this.state.searchedCountry,
        criteria: criterias.confirmed,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        this.populate(json);
        this.forceUpdate();
      })
      .catch((error) => {
        alert("Couldn't connect", "Error in connection..");
      });
  }

  fetchNumberOfTests() {
    fetch("https://sym-track.herokuapp.com/api/statistics", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: this.state.searchedCountry,
        criteria: criterias.numberOfTests,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        this.populate(json);
        this.forceUpdate();
      })
      .catch((error) => {
        alert("Couldn't connect", "Error in connection..");
      });
  }

  fetchNumberOfDeathRate() {
    fetch("https://sym-track.herokuapp.com/api/statistics", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: this.state.searchedCountry,
        criteria: criterias.deathRate,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        this.populate(json);
        this.forceUpdate();
      })
      .catch((error) => {
        alert("Couldn't connect", "Error in connection..");
      });
  }

  fetchNumberOfConfirmedRate() {
    fetch("https://sym-track.herokuapp.com/api/statistics", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: this.state.searchedCountry,
        criteria: criterias.confirmedRate,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        this.populate(json);
        this.forceUpdate();
      })
      .catch((error) => {
        alert("Couldn't connect", "Error in connection..");
      });
  }

  fetchNumberOfRecoveredRate() {
    fetch("https://sym-track.herokuapp.com/api/statistics", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: this.state.searchedCountry,
        criteria: criterias.recoveryRate,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        this.populate(json);
        this.forceUpdate();
      })
      .catch((error) => {
        alert("Couldn't connect", "Error in connection..");
      });
  }

  populateData() {
    switch (this.state.selected_filter) {
      case criterias.confirmed:
        this.fetchNumberOfConfirmed();
        break;
      case criterias.deaths:
        this.fetchNumberOfDeath();
        break;
      case criterias.recoveries:
        this.fetchNumberOfRecovered();
        break;
      case criterias.numberOfTests:
        this.fetchNumberOfTests();
        break;
    }
  }

  GetTotalData = async () => {
    await fetch("https://sym-track.herokuapp.com/api/diseases", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          TotalStatisticsData: json,
        });
        this.forceUpdate();
      })
      .catch((error) => {
        alert("Couldn't connect", "Error in connection..");
      });

    //filter out data
    this.state.StatisticsData = this.state.TotalStatisticsData.find(
      (obj) => obj.title == "COVID-19"
    );
  };

  dataset() {
    return [
      Math.random() * 10,
      Math.random() * 10,
      Math.random() * 10,
      Math.random() * 10,
      Math.random() * 10,
    ];
  }

  label() {
    return ["mar 8", "mar 15", "mar 20", "apr 1", "apr 10", "apr 15", "apr 27"];
  }

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
                  World's Statistics
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity style={styles.cards_total} disabled={true}>
                    <Text style={styles.cards_header}>Total</Text>
                    <Text style={styles.cards_content}>
                      {this.state.StatisticsData.confirmed}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cards_active} disabled={true}>
                    <Text style={styles.cards_header}>Recovered</Text>
                    <Text style={styles.cards_content}>
                      {this.state.StatisticsData.recovered}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity style={styles.cards_death} disabled={true}>
                    <Text style={styles.cards_header}>Death</Text>
                    <Text style={styles.cards_content}>
                      {this.state.StatisticsData.deaths}
                    </Text>
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
                  this.state.selected_filter === criterias.confirmed
                    ? styles.touchable_buttons
                    : styles.touchable_buttons_pressed
                }
                onPress={() => {
                  this.setState({
                    selected_filter: criterias.confirmed,
                  });
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
                onPress={() => {
                  this.setState({
                    selected_filter: criterias.recoveries,
                  });
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
                onPress={() => {
                  this.setState({
                    selected_filter: criterias.deaths,
                  });
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
              </TouchableOpacity>
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
