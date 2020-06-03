import React from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  Layout,
  Input,
  Spinner,
  Icon,
  List,
  Text,
  Divider,
  TopNavigation,
  TopNavigationAction,
  Button,
} from "@ui-kitten/components";
import userIDStore from "../../data-management/user-id-data/userIDStore";
import { strings } from "../../localization/localization";
import { LangContext } from "../../../assets/lang/language-context";

const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

const NewsScreen = (props) => {
  const [state, setState] = React.useState({
    data: [],
    isLoading: true,
    searchTag: "",
    searching: false,
    refreshing: false,
  });
  //setting up the language
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  strings.setLanguage(lang);

  React.useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    if (state.searchTag === "") {
      fetch("https://sym-track.herokuapp.com/api/news/", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + userIDStore.getState().userToken,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setState({
            ...state,
            data: json.data,
            isLoading: false,
            refreshing: false,
          });
        })
        .catch((error) => {
          // alert('Wrong');
        });
    } else {
      fetch(
        "https://sym-track.herokuapp.com/api/news?country=" + state.searchTag,
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
          setState({
            ...state,
            data: json.data,
            isLoading: false,
            refreshing: false,
            searching: false,
          });
        })
        .catch((error) => {
          alert(
            "Couldn't connect",
            "Unable to connect to server, please try again!"
          );
        });
    }
  };

  const getMyTitle = (title) => {
    var array = title.split("-");
    var _title = "";

    for (let index = 0; index < array.length - 1; index++) {
      _title += array[index];
      if (index != array.length - 2) {
        _title += "-";
      }
    }

    return _title;
  };

  const getNewsDate = (date) => {
    var today = new Date();
    var newsDate = new Date(date);
    var diffMs = today - newsDate; // milliseconds between now & the news date
    var days = Math.floor(diffMs / 86400000); // days
    var hrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var mins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    if (days > 0) {
      return days + " days ago";
    }
    if (hrs == 0) {
      return mins + " min ago";
    }

    return hrs + " hr : " + mins + " min ago";
  };

  const onSearchChange = (searchTag) => {
    setState({
      ...state,
      searchTag: searchTag,
    });
  };

  const searchNews = () => {
    setState({
      ...state,
      searching: state.searchTag !== "",
    });
    fetchNews();
  };

  const onRefreshNews = () => {
    setState({ ...state, refreshing: true });
    fetchNews();
  };

  const goToNews = (reference_link) => {
    if (Platform.Version > 22) {
      props.navigation.navigate("NewsView", { uri: reference_link });
    } else {
      Linking.openURL(reference_link);
    }
  };

  const ArrowIosBackIcon = (style) => <Icon {...style} name="arrow-ios-back" />;

  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        alignment="center"
        title={strings.News}
        accessoryLeft={renderBackAction}
      />
      <Divider />
      {state.isLoading ? (
        <Layout
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Spinner {...props} size="large" />
        </Layout>
      ) : (
        <Layout style={{ flex: 1, flexDirection: "column" }}>
          <Input
            placeholder={strings.Search}
            value={state.searchTag}
            accessoryLeft={SearchIcon}
            size="large"
            onSubmitEditing={() => searchNews()}
            returnKeyType="done"
            accessoryRight={() =>
              state.searching ? <Spinner {...props} /> : <></>
            }
            onChangeText={(nextValue) => onSearchChange(nextValue)}
          />
          <List
            refreshing={state.refreshing}
            onRefresh={() => onRefreshNews()}
            data={state.data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <>
                <Layout style={styles.newsRow}>
                  <Image
                    source={{ uri: item.logo }}
                    resizeMethod="auto"
                    style={{
                      width: 50,
                      height: 50,
                      marginRight: 10,
                      borderRadius: 25,
                      backgroundColor: "#eee",
                    }}
                  />
                  <Layout style={{ flex: 1 }}>
                    <Layout
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text appearance="hint" category="s2">
                        {item.source}
                      </Text>
                      <Text appearance="hint" category="s2">
                        {getNewsDate(item.date)}
                      </Text>
                    </Layout>
                    <Layout>
                      <Text>{getMyTitle(item.title)}</Text>
                    </Layout>
                    <Layout
                      style={{
                        flexDirection: "row",
                        flex: 1,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        size="tiny"
                        onPress={() => goToNews(item.reference_link)}
                      >
                        {strings.GoToNews}
                      </Button>
                    </Layout>
                  </Layout>
                </Layout>
                <Divider />
              </>
            )}
          />
        </Layout>
      )}
    </SafeAreaView>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch",
    // marginBottom: 10,
  },
  newsRow: {
    flex: 1,
    padding: 5,
    marginHorizontal: 5,
    flexDirection: "row",
  },
});
