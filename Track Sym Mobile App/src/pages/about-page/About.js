import React from "react";
import { Image, Dimensions, Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Layout,
  Text,
  StyleService,
  useStyleSheet,
  Button,
  Icon,
} from "@ui-kitten/components";
import { Divider } from "react-native-paper";
import { strings } from "../../localization/localization";
import { LangContext } from "../../../assets/lang/language-context";

const About = (props) => {
  //setting up the language
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  strings.setLanguage(lang);

  const styles = useStyleSheet(themedStyle);
  const infiniteAnimationIconRef = React.useRef();

  React.useEffect(() => {
    infiniteAnimationIconRef.current.startAnimation();
  }, []);

  const renderInfiniteAnimationIcon = (props) => (
    <Icon
      {...props}
      ref={infiniteAnimationIconRef}
      animationConfig={{ cycles: Infinity }}
      animation="pulse"
      name="globe-outline"
    />
  );

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <Layout level="2" style={{ height: 220 }}>
        <Image
          source={require("../../../assets/images/track.png")}
          style={{ height: 220, width: Dimensions.get("screen").width }}
          resizeMode="cover"
        />
      </Layout>
      <Layout>
        <Layout style={styles.title_container}>
          <Text category="h5">{strings.TrackSYM}</Text>
        </Layout>
        <Divider />
        <Text style={styles.text}>
        {strings.AboutParag1}{"\n"}
        </Text>
      </Layout>
      <Layout level="2" style={{ height: 230 }}>
        <Image
          source={require("../../../assets/images/team.png")}
          style={{ height: 230, width: Dimensions.get("screen").width }}
          resizeMode="cover"
        />
      </Layout>
      <Layout>
        <Layout style={styles.title_container}>
          <Text category="h5">{strings.WhoWeAre}</Text>
        </Layout>
        <Divider />
        <Text style={styles.text}>
          <Text style={{ fontWeight: "bold" }}>A2SV </Text>{strings.AboutParag2}
          {"\n\n"}
          {strings.AboutParag3}{" "}
          <Text style={{ fontWeight: "bold" }}>
          {strings.AboutParag4}{"\n"}
          </Text>
        </Text>
      </Layout>
      <Layout level="2" style={{ height: 220 }}>
        <Image
          source={require("../../../assets/images/file.png")}
          style={{ height: 230, width: Dimensions.get("screen").width }}
          resizeMode="cover"
        />
      </Layout>
      <Layout>
        <Layout style={styles.title_container}>
          <Text category="h5">{strings.YourData}</Text>
        </Layout>
        <Divider />
        <Text style={styles.text}>
        {strings.AboutParag5}
        </Text>
      </Layout>
      <Layout style={{ flex: 1 }}>
        <Layout style={styles.bottom}>
          <Button
            onPress={() => Linking.openURL("http://www.a2sv.org")}
            accessoryLeft={renderInfiniteAnimationIcon}
          >
            {strings.CheckOutOurWebsite}
          </Button>
        </Layout>
      </Layout>
    </ScrollView>
  );
};

export default About;

const themedStyle = StyleService.create({
  title_container: { margin: 5, alignItems: "center" },
  text: {
    padding: 10,
  },
  bottom: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
