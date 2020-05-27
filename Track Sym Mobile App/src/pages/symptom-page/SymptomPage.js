import React, { Component } from "react";
import { ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import {
  Layout,
  ListItem,
  Toggle,
  Divider,
  List,
  Text,
  Spinner,
} from "@ui-kitten/components";
import symptomStore from "../../data-management/user-symptom-data/symptomStore";
import userIDStore from "../../data-management/user-id-data/userIDStore";
import * as symptomActions from "../../data-management/user-symptom-data/symptomActions";
import localSymptomStore from "../../data-management/local_symptom_data/localSymptomStore";
import * as localSymptomActions from "../../data-management/local_symptom_data/localSymptomActions";
import { CheckBox, Icon } from "react-native-elements";

export default class SymptomPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symptomId: "",
      symptoms: [],
      userSymptoms: [],
      localUserSymptoms: [],
      loading: true,
      registerLoading: false,
      registerStatusText: "Loading",
      testCheck: false,
    };
    localSymptomStore.subscribe(() => {
      this.fetchData();
    });
  }

  componentDidMount() {
    this.fetchSymptoms();
    this.fetchUserSymptoms(userIDStore.getState().userId);
    this.sync();
    this.fetchData();
  }

  //fetches symptoms that user has already registere
  fetchData() {
    this.setState({
      localUserSymptoms: localSymptomStore.getState(),
    });
  }

  //Sync with the remote
  sync() {
    // console.log(2);
    for (var index = 0; index < symptomStore.getState().length; index++) {
      localSymptomStore.dispatch(
        localSymptomActions.addSymptom(
          symptomStore.getState()[index].Symptom.name
        )
      );
    }
    // console.log(2);
  }

  //registers symptom on database and also stores in local data store
  handleSymptomAction = (userId, symptomId, user_symptom) => {
    let listSymptoms = symptomStore.getState();
    let symptom = listSymptoms.find((obj) => obj.symptom_id == symptomId);
    if (localSymptomStore.getState().includes(user_symptom)) {
      localSymptomStore.dispatch(
        localSymptomActions.removeSymptom(user_symptom)
      );

      this.removeSymptom(userId, symptom._id, symptomId);
    } else {
      localSymptomStore.dispatch(localSymptomActions.addSymptom(user_symptom));

      this.registerSymptom(userId, symptomId);
    }
  };

  //gets the list of symptoms from database

  fetchSymptoms = async () => {
    this.setState({
      loading: true,
    });
    console.log("Bearer " + userIDStore.getState().userToken);
    let newThis = this; // create variable for referencing 'this'
    await fetch("https://sym-track.herokuapp.com/api/symptoms", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // fetching symptoms from the database is successful and storing in to our state
        newThis.setState(() => ({
          symptoms: json,
          loading: false,
        }));
        //console.log(json);
      })
      .catch((error) => {
        // console.log(error);
      });
    // console.log(0);
  };
  //gets the list of symptoms from database

  fetchUserSymptoms = async (userId) => {
    this.setState({
      registerLoading: true,
    });
    let newThis = this; // create variable for referencing 'this'
    await fetch(
      "https://sym-track.herokuapp.com/api/symptomuser/user/" + userId,
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
      .then((json) => {
        // fetching user symptoms from the database is successful and updating local state using redux
        symptomStore.dispatch(symptomActions.updateSymptomList(json));
        this.setState({
          registerLoading: false,
        });
        //this.sync();
        this.forceUpdate();
      })
      .catch((error) => {
        console.log(error);
        this.fetchUserSymptoms();
      });
    console.log(1);
  };
  //Registers symptom with the user id
  registerSymptom(userId, symptomId) {
    this.setState({
      registerLoading: true,
      registerStatusText: "Registering",
    });
    fetch("https://sym-track.herokuapp.com/api/symptomuser", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symptom_id: symptomId,
        user_id: userId,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        // symptom registeration is successful
        this.fetchUserSymptoms(userIDStore.getState().userId); // get the update from database and update local state
        this.setState({
          registerLoading: false,
        });
        //console.log(symptomStore.getState());
      })

      .catch((error) => {
        this.registerSymptom(userId, symptomId);
      });
  }

  //removes symptom with the user id
  removeSymptom(userId, randomId, symptomId) {
    this.setState({
      registerLoading: true,
      registerStatusText: "Unregistering",
    });
    fetch("https://sym-track.herokuapp.com/api/symptomuser", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: randomId,
        symptom_id: symptomId,
        user_id: userId,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        // symptom removal is successful
        this.fetchUserSymptoms(userIDStore.getState().userId); // get the update from database and update local state

        this.setState({
          registerLoading: false,
        });
        //console.log(json);
      })
      .catch((error) => {
        console.log(error);
        this.removeSymptom(userId, randomId, symptomId);
      });
  }

  //check if a symptom has already been registered by user
  doesSymptomAlreadyRegistered(symptomId) {
    let symptom = this.state.userSymptoms.find(
      (obj) => obj.symptom_id == symptomId
    );

    if (symptom != null) {
      return true;
    }
    return false;
  }

  renderItem = ({ item, index }) => (
    <ListItem
      title={item.name}
      description={item.description}
      accessoryLeft={() => (
        <CheckBox
          key={item._id}
          checked={this.state.localUserSymptoms.includes(item.name)}
        />
      )}
      onPress={() => {
        if (!this.state.registerLoading) {
          this.handleSymptomAction(
            userIDStore.getState().userId,
            item._id,
            item.name
          );
        }
      }}
    />
  );

  contents = () =>
    this.state.symptoms.map((item) => {
      //return the corresponding mapping for each item in corresponding UI componenets.
      return (
        item &&
        item._id &&
        item.name && (
          <ListItem
            title={item.name}
            description={item.description}
            accessoryLeft={() => (
              <CheckBox
                key={item._id}
                checked={this.state.localUserSymptoms.includes(item.name)}
              />
            )}
            onPress={() => {
              if (!this.state.registerLoading) {
                this.handleSymptomAction(
                  userIDStore.getState().userId,
                  item._id,
                  item.name
                );
              }
            }}
          />
        )
      );
    });

  onCheckedChange = (isChecked) => {
    setChecked(isChecked);
  };

  render() {
    return (
      <ScrollView style={{ backgroundColor: "#eee" }}>
        <Layout>
          {this.state.registerLoading ? (
            <Layout
              style={{
                flex: 1,
                margin: 5,
                alignSelf: "center",
                flexDirection: "row",
              }}
            >
              <Text style={{ marginRight: 10 }}>
                {this.state.registerStatusText} your symptom
              </Text>
              <Spinner size="small" />
            </Layout>
          ) : null}
          <Layout style={{ flex: 1 }}>
            <List
              data={this.state.symptoms}
              ItemSeparatorComponent={Divider}
              renderItem={this.renderItem}
            />
          </Layout>
        </Layout>
      </ScrollView>
    );
  }
}
