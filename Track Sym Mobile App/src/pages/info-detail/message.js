import React from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import {
  TopNavigation,
  TopNavigationAction,
  Divider,
  Layout,
  Text,
  Icon,
  List,
} from "@ui-kitten/components";
import { ImageOverlay } from "./extra/image-overlay.component";
import { messageData as data } from "./extra/data";
import styles from "./extra/styles";
import { InfoCard } from "./extra/InfoCard";
import { strings } from "../../localization/localization";
import { LangContext } from "../../../assets/lang/language-context";

const BackIcon = (props) => <Icon name="arrow-ios-back-outline" {...props} />;

export default PrevDetailScreen = (props) => {
  const navigateBack = () => {
    props.navigation.goBack();
  };
  //setting up the language
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  strings.setLanguage(lang);

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        alignment="center"
        title={strings.MessageFromUs}
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
          <Divider />
          <View style={styles.authoringContainer}>
            <Text style={styles.dateLabel} appearance="hint" category="p2">
              {strings.MajorConcern}
            </Text>
          </View>
          <Divider />
          <Layout style={styles.contentContainer}>
            <Text>
              You should be careful not to get infected and stay safe. Even if
              you are not heavily sick, there is a big risk that you might pass
              it to your loved ones before the symptoms arise.
            </Text>
          </Layout>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};
