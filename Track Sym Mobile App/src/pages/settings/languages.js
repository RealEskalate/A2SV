import React, { useEffect } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {
  Layout,
  Toggle,
  TopNavigationAction,
  TopNavigation,
  Divider,
  Icon,
  List,
  ListItem,
  Modal,
  Spinner,
  CheckBox,
  Card,
  Radio,
} from "@ui-kitten/components";
import { LangContext } from "../../../assets/lang/language-context";
import * as actions from "../../data-management/user-id-data/userIDActions";
import userIDStore from "../../data-management/user-id-data/userIDStore";
import { strings } from "../../localization/localization";
import languageStore from "../../data-management/language_data/languageStore";
import * as languageActions from "../../data-management/language_data/languageActions";

const ArrowIosBackIcon = (style) => <Icon {...style} name="arrow-ios-back" />;
const EditProfile = (style) => <Icon {...style} name="edit-2-outline" />;
const ChangePasswordIcon = (style) => <Icon {...style} name="unlock-outline" />;
const TermsIcon = (style) => <Icon {...style} name="book-open-outline" />;
const DarkModeIcon = (style) => <Icon {...style} name="moon-outline" />;
const LanguagesIcon = (style) => <Icon {...style} name="globe-outline" />;
const Checked = (style) => <Icon {...style} name="checkmark-circle-outline" />;

export default LanguagesScreen = (props) => {
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  const [visible, setVisible] = React.useState(false);
  const [currLanguage, setCurrLanguage] = React.useState("");
  strings.setLanguage(lang);

  useEffect(() => {
    setCurrLanguage(lang);
  }, []);

  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  const languageAction = (index) => {
    setCurrLanguage(languages[index]);
    saveLanguages(languages[index]);
    langContext.changeLang(languages[index]);
    //props.navigation.navigate("index");
  };

  const saveLanguages = async (languageCode) => {
    await AsyncStorage.setItem("lang", languageCode);
    languageStore.dispatch(languageActions.changeLanguage(languageCode));
  };

  const data = [
    strings.Amharic,
    strings.English,
    strings.Oromiffa,
    strings.Turkish,
  ];
  const languages = ["am", "en", "orm", "tr"];

  const icons = [LanguagesIcon, LanguagesIcon, LanguagesIcon, LanguagesIcon];

  // const settingActions = [
  //   amharicAction,
  //   englishAction,
  //   oromiffaAction,
  //   turkishAction,
  // ];

  const ListSimpleUsageShowcase = () => {
    return (
      <List
        style={styles.container}
        data={data}
        renderItem={({ item, index }) => (
          <Layout>
            <ListItem
              style={styles.setting}
              onPress={() => languageAction(index)}
              accessoryRight={() =>
                currLanguage == languages[index] ? (
                  <Radio checked={langContext.lang == languages[index]} />
                ) : (
                  <></>
                )
              }
              title={`${item}`}
            ></ListItem>
            <Divider />
          </Layout>
        )}
      />
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true}>
          <Spinner {...props} size="large" />
        </Card>
      </Modal>
      <SafeAreaView style={styles.container}>
        <TopNavigation
          alignment="center"
          title={strings.Settings}
          accessoryLeft={renderBackAction}
        />
        <Divider />
        <Layout style={styles.container}>{ListSimpleUsageShowcase()}</Layout>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  setting: {
    padding: 16,
  },
  section: {
    paddingTop: 32,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  icon: {
    width: 32,
    height: 32,
  },
});
