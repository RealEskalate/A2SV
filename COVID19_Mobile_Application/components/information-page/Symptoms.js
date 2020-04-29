import * as React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";

export default function Symptoms() {
  return (
    <ScrollView>
      <Card
        title="Symptoms"
        image={require("../../assets/symptoms.jpg")}
        containerStyle={{ margin: 0 }}
      >
        <ScrollView>
          <Text style={{ marginBottom: 10 }}>
            Fever, cough and shortness of breath are the common symptoms
            reported by patients. Chills, body aches, sore throat, runny nose,
            headache, diarrhea and nausea are also possible, as well as a
            general sensation of severe illness. In recent days, some doctors
            have reported seeing COVID-19 patients who had lost their sense of
            smell.
          </Text>
        </ScrollView>
      </Card>
    </ScrollView>
  );
}
