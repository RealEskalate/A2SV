import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import {
  Layout,
  Spinner,
  Icon,
  List,
  ListItem,
  Divider,
  Button,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import userIDStore from "../../data-management/user-id-data/userIDStore";
import { strings } from "../../localization/localization";
import { LangContext } from "../../../assets/lang/language-context";

const SearchIcon = (props) => <Icon {...props} name="search-outline" />;

const NotificationScreen = (props) => {
  const [state, setState] = React.useState({
    data: [
      {
        _id: 1,
        name: "Covid test result",
        description: "View your test result",
        reference_link: {
          result: {
            _id: "34567887654",
            title: "Test Result",
            name: "Emily Clark",
            test_date: "10/10/2020",
            test_result: "Positive",
            message: strings.PreventionsShortDescription,
          },
          methods: [
            {
              _id: 1,
              name: strings.HandWashing,
              inside:
                strings.PreventionDetailInfoDescriptionMethodOneInsideContentOne,
            },
            {
              _id: 2,
              name: strings.SocialDistancing,
              inside:
                strings.PreventionDetailInfoDescriptionMethodOneInsideContetnTwo,
            },
            {
              _id: 3,
              name: strings.RespiratoryHygiene,
              inside:
                strings.PreventionDetailInfoDescriptionMethodTwoInsideContentOne,
            },
            {
              _id: 4,
              name: strings.StayInformed,
              inside:
                strings.PreventionDetailInfoDescriptionMethodTwoInsideContetnTwo,
            },
          ],
        },
      },
    ],
    isLoading: false,
  });
  //setting up the language
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  strings.setLanguage(lang);

  const getDetailInfo = (reference_link) => {
    props.navigation.navigate("NotificationView", { data: reference_link });
  };

  const ArrowIosBackIcon = (style) => <Icon {...style} name="arrow-ios-back" />;

  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );
  const renderItemAccessory = (link) => (
    <Button size="tiny" onPress={() => getDetailInfo(link)}>
      {strings.VIEW}
    </Button>
  );
  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        alignment="center"
        title={strings.Notification}
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
          <List
            data={state.data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <>
                <ListItem
                  title={item.name}
                  accessoryRight={() =>
                    renderItemAccessory(item.reference_link)
                  }
                />
              </>
            )}
          />
        </Layout>
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

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
