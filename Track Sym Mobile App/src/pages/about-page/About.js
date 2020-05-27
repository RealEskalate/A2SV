import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Layout,
  Text,
  StyleService,
  useStyleSheet,
  Button,
} from "@ui-kitten/components";
import { Divider } from "react-native-paper";

const About = (props) => {
  const styles = useStyleSheet(themedStyle);

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
          <Text category="h5">TRACK SYM</Text>
        </Layout>
        <Divider />
        <Text style={styles.text}>
          It is a non-commercial COVID-19 symptom tracking app that uses
          crowd-sourcing to collect and visualize the density of the relevant
          symptoms. Users can anonymously report their symptoms and choose a
          location to see the density of symptoms in a map view. The data is
          aggregated by places, therefore, the app can help people avoid
          visiting a grocery store, a gas station, or any other place that is
          heavily used by symptomatic people
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
          <Text category="h5">WHO ARE WE ?</Text>
        </Layout>
        <Divider />
        <Text style={styles.text}>
          A2SV - Africa to Silicon Valley is a team of highly motivated and
          talented students from Ethiopia, led by an ex-Google and Palantir
          Software/ML engineer.
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
          <Text category="h5">YOUR DATA</Text>
        </Layout>
        <Divider />
        <Text style={styles.text}>
          Your data will be used anonymously for the purpose of data science and
          statistics, meaning any info generated isn’t traced back to a single
          user. This is a non-commercial project with no intention of profit.
        </Text>
      </Layout>
      <Layout style={{ flex: 1 }}>
        <Layout style={styles.bottom}>
          <Button onPress={() => Linking.openURL("http://www.a2sv.org")}>
            CHECK OUT OUR WEBSITE
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
