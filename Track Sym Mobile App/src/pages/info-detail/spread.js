import React from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import {
  TopNavigation,
  TopNavigationAction,
  Layout,
  Text,
  Icon,
} from "@ui-kitten/components";
import { ImageOverlay } from "./extra/image-overlay.component";
// import { spreadData as data } from "./extra/data";
import styles from "./extra/styles";
import { strings } from "../../localization/localization";
import { LangContext } from "../../../assets/lang/language-context";

const BackIcon = (props) => <Icon name="arrow-ios-back-outline" {...props} />;

export default PrevDetailScreen = (props) => {
  //setting up the language
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  strings.setLanguage(lang);

  const data = {
    title: strings.HowItSpreadsDetailInfoTitle,
    description: strings.HowDoesCoronavirusBecomeContagious,
    content: strings.HowItSpreadsDetailInfoDescriptionContentOne,
    content_two: strings.HowItSpreadsDetailInfoDescriptionContentTwo,
    image: require("./assets/spread.jpg"),
    date: "19 Sep, 2018",
    author: {
      fullName: strings.DetailInfoAuthorFullName,
    },
  };

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        alignment="center"
        title={strings.Spread}
        accessoryLeft={renderBackAction}
      />
      <Layout style={styles.container} level="2">
        <ScrollView>
          <ImageOverlay style={styles.headerContainer} source={data.image}>
            <Text style={styles.headerTitle} category="h1" status="control">
              {data.title}
            </Text>
            <Text
              style={styles.headerDescription}
              category="s1"
              status="control"
            >
              {data.description}
            </Text>
          </ImageOverlay>
          <Layout style={styles.contentContainer} level="1">
            <Text>{data.content + "\n"}</Text>
            <Text>{data.content_two}</Text>
          </Layout>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};
