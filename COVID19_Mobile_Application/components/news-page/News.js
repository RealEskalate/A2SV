import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { SearchBar } from 'react-native-elements';

class News extends Component {
  state = {
    data: [],
    isLoading: true,
    searchedCountry: '',
    searching: false,
    refreshing: false,
  };

  componentDidMount() {
    this.fetchNews('');
  }

  fetchNews = (country) => {
    if (country === '') {
      fetch('https://sym-track.herokuapp.com/api/news/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((json) => {
          this.setState({
            data: json.data,
            isLoading: false,
            refreshing: false,
          });
        });
    } else {
      alert(country);
      fetch(
        'https://sym-track.herokuapp.com/api/news?country=' +
          this.state.searchedCountry,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          this.setState({
            data: json.data,
            isLoading: false,
            refreshing: false,
            searching: false,
          });
          //console.log(json);
        })
        .catch((error) => {
          Alert.alert(
            "Couldn't connect",
            'Unable to connect to server, please try again!'
          );
        });
    }
  };

  getMyTitle = (title) => {
    var array = title.split('-');
    var _title = '';

    for (let index = 0; index < array.length - 1; index++) {
      _title += array[index];
      if (index != array.length - 2) {
        _title += '-';
      }
    }

    return _title;
  };

  getNewsDate = (date) => {
    var today = new Date();
    var newsDate = new Date(date);
    var diffMs = today - newsDate; // milliseconds between now & Christmas
    var days = Math.floor(diffMs / 86400000); // days
    var hrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var mins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    if (days > 0) {
      return days + ' days ago';
    }
    if (hrs == 0) {
      return mins + ' min ago';
    }

    return hrs + ' hr : ' + mins + ' min ago';
  };

  onCountryChange = (country) => {
    const result = this.setState({
      searchedCountry: country,
      searching: true,
    });

    this.fetchNews(country);
  };

  onRefreshNews = (country) => {
    this.setState({ refreshing: true });
    this.fetchNews(country);
  };

  goToNews = (reference_link) => {
    if(Platform.Version > 22){
      this.props.navigation.navigate('NewsView', {uri: reference_link});
    }else{
      Linking.openURL(reference_link);
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <SearchBar
          placeholder='Search a country...'
          lightTheme={true}
          onChangeText={(country) => {
            this.onCountryChange(country);
          }}
          value={this.state.searchedCountry}
          showLoading={this.state.searching}
        />
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={() => this.onRefreshNews(this.state.searchedCountry)}
          data={this.state.data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}>
              <Image
                source={require('../../assets/news/people.png')}
                resizeMethod='auto'
                style={{ width: 60, height: 60 }}
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ color: 'grey', fontSize: 10 }}>
                    {item.source}
                  </Text>
                  <Text style={{ color: 'grey', fontSize: 10 }}>
                    {this.getNewsDate(item.date)}
                  </Text>
                </View>
                <View>
                  <Text>{this.getMyTitle(item.title)}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'flex-end',
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#bbdefb',
                      padding: 5,
                      borderRadius: 5,
                    }}
                    onPress={() => this.goToNews(item.reference_link)}>
                    <Text style={{ color: '#1565c0', fontSize: 10 }}>
                      GO TO NEWS
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

export default News;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
});
