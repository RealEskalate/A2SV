import React, { Component } from "react";
import {
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  View,
} from "react-native";
import {
  Layout,
  ListItem,
  Toggle,
  Divider,
  List,
  Text,
  Spinner,
  Modal,
  StyleService,
  Card,
  Button,
} from "@ui-kitten/components";
import symptomStore from "../../data-management/user-symptom-data/symptomStore";
import userIDStore from "../../data-management/user-id-data/userIDStore";
import * as symptomActions from "../../data-management/user-symptom-data/symptomActions";
import localSymptomStore from "../../data-management/local_symptom_data/localSymptomStore";
import * as localSymptomActions from "../../data-management/local_symptom_data/localSymptomActions";
import { strings } from "../../localization/localization";
import { CheckBox, Icon } from "react-native-elements";
import { LangContext } from "../../../assets/lang/language-context";
import languageStore from "../../data-management/language_data/languageStore";

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
      loadingStatusText: "Loading",
      testCheck: false,
      modalMessage: "",
      modalState: false,
      modalStatus: "",
      changesMade: false,
      numberOfChanges: 0,
      currLanguage: "English",
      currLangCode: languageStore.getState(),
    };

    localSymptomStore.subscribe(() => {
      this.fetchData();
    });
    languageStore.subscribe(() => {
      strings.setLanguage(languageStore.getState());
      this.setState({ currLangCode: languageStore.getState() });
      this.componentDidMount();
    });
  }
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
    await this.fetchSymptoms();
    await this.fetchUserSymptoms(userIDStore.getState().userId);
    await this.sync();
    await this.fetchData();
  };

  //fetches symptoms that user has already registere
  fetchData() {
    this.setState({
      localUserSymptoms: localSymptomStore.getState(),
    });
    //Checking if there are any changes made
    if (
      symptomStore.getState().length !== localSymptomStore.getState().length
    ) {
      this.setState({ changesMade: true });
    } else if (
      symptomStore.getState().length === localSymptomStore.getState().length
    ) {
      if (localSymptomStore.getState().length === 0) {
        this.setState({ changesMade: false }); //if they are equal but empty
      }
      for (var index = 0; index < symptomStore.getState().length; index++) {
        if (
          !localSymptomStore
            .getState()
            .includes(symptomStore.getState()[index].Symptom._id)
        ) {
          this.setState({ changesMade: true });
          return;
        }
        this.setState({ changesMade: false });
      }
    } else {
      this.setState({ changesMade: false });
    }
  }

  //Sync with the remote
  sync() {
    // console.log(2);
    for (var index = 0; index < symptomStore.getState().length; index++) {
      if (
        !localSymptomStore
          .getState()
          .includes(symptomStore.getState()[index].Symptom._id)
      ) {
        localSymptomStore.dispatch(
          localSymptomActions.addSymptom(
            symptomStore.getState()[index].Symptom._id
          )
        );
      }
    }
    // console.log(2);
  }

  //registers symptom on database and also stores in local data store
  handleSymptomAction = (symptomId) => {
    if (localSymptomStore.getState().includes(symptomId)) {
      localSymptomStore.dispatch(localSymptomActions.removeSymptom(symptomId));
      //check if new change has been made

      //this.removeSymptom(userIdStore.getState().userId, symptom._id, symptomId);
    } else {
      localSymptomStore.dispatch(localSymptomActions.addSymptom(symptomId));
      //check if new change has been made

      //this.registerSymptom(userIdStore.getState().userId, symptomId);
    }
  };

  //gets the list of symptoms from database

  fetchSymptoms = async () => {
    this.setState({
      loading: true,
    });

    let newThis = this; // create variable for referencing 'this'
    await fetch(
      "https://sym-track.herokuapp.com/api/symptoms?language=" +
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
    let newThis = this; // create variable for referencing 'this'
    await fetch(
      "https://sym-track.herokuapp.com/api/symptomuser/user/" +
        userId +
        "?language=" +
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
      .then((json) => {
        // fetching user symptoms from the database is successful and updating local state using redux
        symptomStore.dispatch(symptomActions.updateSymptomList(json));
        this.setState({
          loading: false,
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
      loadingStatusText: "Registering",
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
  //Registers collection of symptoms at once
  registerCollectionSymptom = async () => {
    console.log(this.state.localUserSymptoms);
    this.setState({
      registerLoading: true,
    });
    const response = await fetch(
      "https://sym-track.herokuapp.com/api/symptomuser/multiple",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + userIDStore.getState().userToken,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: this.state.localUserSymptoms,
        }),
      }
    );
    console.log("response " + response.status);
    if (response.status === 404) {
      this.registerCollectionSymptom(symptoms);
    }
    // symptom registeration is successful
    if (response.status === 201) {
      this.fetchUserSymptoms(userIDStore.getState().userId); // get the update from database and update local state
      this.setState({
        modalMessage: strings.SuccessfullySave,
        modalState: true,
        registerLoading: false,
        modalStatus: "success",
        changesMade: false,
      });
    }
    //console.log(symptomStore.getState());
  };

  //removes symptom with the user id
  removeSymptom(userId, randomId, symptomId) {
    this.setState({
      registerLoading: true,
      loadingStatusText: "Unregistering",
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
          checked={this.state.localUserSymptoms.includes(item._id)}
          onPress={() => {
            this.handleSymptomAction(item._id);
          }}
        />
      )}
      onPress={() => {
        this.handleSymptomAction(item._id);
      }}
    />
  );

  render() {
    return (
      <Layout style={{ flex: 1, flexDirection: "column" }}>
        <Modal
          visible={this.state.modalState}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => this.setState({ modalState: false })}
        >
          <Card disabled={true} style={{ marginLeft: 10, marginRight: 10 }}>
            <Text
              status={this.state.modalStatus}
              category="h6"
              style={{ marginBottom: 10 }}
            >
              {this.state.modalMessage}
            </Text>
            <Text
              style={{ alignSelf: "flex-end", color: "#0080ff" }}
              onPress={() => {
                this.setState({ modalState: false });
              }}
            >
              {strings.Dismiss}
            </Text>
          </Card>
        </Modal>

        {this.state.loading ? (
          <Layout
            style={{
              margin: 5,
              alignSelf: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ marginRight: 10 }}>
              {this.state.loadingStatusText} your symptom
            </Text>
            <Spinner size="small" />
          </Layout>
        ) : null}

        {this.state.changesMade ? (
          <Layout
            style={{
              margin: 5,
              alignSelf: "center",
              flexDirection: "row",
            }}
          >
            <Button
              style={styles.button}
              appearance="outline"
              disabled={this.state.registerLoading}
              accessoryLeft={() =>
                this.state.registerLoading ? <Spinner /> : <></>
              }
              onPress={() => this.registerCollectionSymptom()}
            >
              {strings.SaveChanges}
            </Button>
          </Layout>
        ) : null}
        <List
          data={this.state.symptoms}
          ItemSeparatorComponent={Divider}
          renderItem={this.renderItem}
        />
      </Layout>
    );
  }
}
const styles = StyleService.create({
  formContainer: {
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  doneButton: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  divider: {
    flex: 1,
  },
  formInput: {
    marginTop: 16,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flex: 1,
  },
});
