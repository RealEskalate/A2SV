import React from 'react';
import { SearchBar } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

export default class StaticsPage extends React.Component {

  dataset() {
    return [
      Math.random() * 10,
      Math.random() * 10,
      Math.random() * 10,
      Math.random() * 10,
      Math.random() * 10,
      Math.random() * 10,
    ];
  }
  label() {
    return ['mar 8', 'mar 15', 'mar 20', 'apr 1', 'apr 10', 'apr 15', 'apr 27'];
  }
  state = {
    view_domain: 'World', // basic domain of the data -- dafault is World
    selected_filtering_button: 'button_total', // sets the current filtering parameter on the graph
    data_set: this.dataset(), // the data to be represented on the graph
    graph_label: this.label(),
  };

  render() {
    const HIEGHT = Dimensions.get('window').height;
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <View>
            <SearchBar
              round
              searchIcon={{ size: 24 }}
              onChangeText={text => this.setState({ view_domain: text })}
              placeholder="Type country name"
              value={this.state.view_domain}
              inputContainerStyle={{
                borderRadius: 20,
                margin: -2,
                width: Dimensions.get('window').width - 40
              }}
              containerStyle={{
                borderRadius: 15,
                margin: -2
              }}
              inputStyle={{
                color: 'white',
              }}
            />

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={styles.cards_total} disabled={true} >
                <Text style={styles.cards_header}>Total</Text>
                <Text style={styles.cards_content}>2,345,678</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cards_active} disabled={true}>
                <Text style={styles.cards_header}>Active</Text>
                <Text style={styles.cards_content}>2,345,678</Text>
              </TouchableOpacity>

            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={styles.cards_recovered} disabled={true}>
                <Text style={styles.cards_header}>Recovered</Text>
                <Text style={styles.cards_content}>890,746</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cards_death} disabled={true}>
                <Text style={styles.cards_header}>Death</Text>
                <Text style={styles.cards_content}>200,000</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.container_graph}>
            <Text style={{
              fontSize: 25,
              margin: 10
            }}>
              Graph View
        </Text>
            <LineChart
              data={{
                labels: this.state.graph_label,
                datasets: [{ data: this.state.data_set, }]
              }}
              width={Dimensions.get('window').width} // from react-native
              height={HIEGHT / 4}
              chartConfig={{
                backgroundColor: '#0080ff',
                backgroundGradientFrom: '#0080ff',
                backgroundGradientTo: '#0080ff',
                scrollableDotFill: '#ffffff',
                decimalPlaces: 1, // optional, defaults to 2dp
                color: (opacity = 0) => `rgba(255, 266, 255, ${opacity})`,
                style: {
                  borderRadius: 0
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 0
              }}
            />
          </View>

          <View style={{ flexDirection: 'row' }}>

            <TouchableOpacity style={
              this.state.selected_filtering_button == 'button_total' ?
                styles.touchable_buttons : styles.touchable_buttons_pressed }
              onPress={() => {
                this.setState({
                  data_set : this.dataset(),
                  selected_filtering_button:'button_total'
                })
              }}>
              <Text style={
                this.state.selected_filtering_button == 'button_total' ?
                  styles.text_style : styles.text_style_pressed}> T O T A L </Text>
            </TouchableOpacity>

            <TouchableOpacity style={
              this.state.selected_filtering_button == 'button_active' ?
                styles.touchable_buttons : styles.touchable_buttons_pressed }
              onPress={() => {
                this.setState({
                  data_set : this.dataset(),
                  selected_filtering_button:'button_active'
                })
              }}>
              <Text style={
                this.state.selected_filtering_button == 'button_active' ?
                  styles.text_style : styles.text_style_pressed}> A C T I V E </Text>
            </TouchableOpacity>

            <TouchableOpacity style={
              this.state.selected_filtering_button == 'button_recovered' ?
                styles.touchable_buttons : styles.touchable_buttons_pressed }
              onPress={() => {
                this.setState({
                  data_set : this.dataset(),
                  selected_filtering_button:'button_recovered'
                })
              }}>
              <Text style={
                this.state.selected_filtering_button == 'button_recovered' ?
                  styles.text_style : styles.text_style_pressed}> R E C O V E R E D </Text>
            </TouchableOpacity>
            </View>


            <View style={{ flexDirection: 'row' }}>

            <TouchableOpacity style={
              this.state.selected_filtering_button == 'button_death' ?
                styles.touchable_buttons : styles.touchable_buttons_pressed }
              onPress={() => {
                this.setState({
                  data_set : this.dataset(),
                  selected_filtering_button:'button_death'
                })
              }}>
              <Text style={
                this.state.selected_filtering_button == 'button_death' ?
                  styles.text_style : styles.text_style_pressed}> D E A T H </Text>
            </TouchableOpacity>

            <TouchableOpacity style={
              this.state.selected_filtering_button == 'button_test' ?
                styles.touchable_buttons : styles.touchable_buttons_pressed }
              onPress={() => {
                this.setState({
                  data_set : this.dataset(),
                  selected_filtering_button:'button_test'
                })
              }}>
              <Text style={
                this.state.selected_filtering_button == 'button_test' ?
                  styles.text_style : styles.text_style_pressed}> T E S T S </Text>
            </TouchableOpacity>

            <TouchableOpacity style={
              this.state.selected_filtering_button == 'button_age' ?
                styles.touchable_buttons : styles.touchable_buttons_pressed }
              onPress={() => {
                this.setState({
                  data_set : this.dataset(),
                  selected_filtering_button:'button_age'
                })
              }}>
              <Text style={
                this.state.selected_filtering_button == 'button_age' ?
                  styles.text_style : styles.text_style_pressed}> A G E  G R O U P </Text>
            </TouchableOpacity>

            </View>
          </View>
      </SafeAreaView>
    ); // end of return
  } // end of render function
} // end of class StaticsPage

const styles = StyleSheet.create({
          container: {
          alignItems: 'center',
    justifyContent: 'center',
  },
  cards_total: {
          backgroundColor: '#54E8FF',
    borderRadius: 20,
    height: Dimensions.get('window').height / 10,
    width: Dimensions.get('window').width / 2 - 30,
    margin: 10,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cards_active: {
          backgroundColor: '#4da6ff',
    borderRadius: 20,
    height: Dimensions.get('window').height / 10,
    width: Dimensions.get('window').width / 2 - 30,
    margin: 10,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cards_recovered: {
          backgroundColor: '#00a1b0',
    borderRadius: 20,
    height: Dimensions.get('window').height / 10,
    width: Dimensions.get('window').width / 2 - 30,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cards_death: {
          backgroundColor: '#bf00b0',
    borderRadius: 20,
    height: Dimensions.get('window').height / 10,
    width: Dimensions.get('window').width / 2 - 30,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cards_header: {
          fontSize: 20,

    color: 'white'
  },
  cards_content: {
          fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  container_graph: {
          alignItems: 'center',
    justifyContent: 'center',
    marginTop:10
  },
  touchable_buttons: {
    backgroundColor: '#0080ff',
    padding: 5,
    marginRight: 5,
    borderRadius: 30
  },
  touchable_buttons_pressed: {
    backgroundColor: '#F5F6FA',
    padding: 5,
    marginRight: 5,
    borderRadius: 30
  },
  text_style: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold'
  },
  text_style_pressed: {
    color: '#0080ff',
    fontSize: 15,
    fontWeight:'bold'
  },
}
);