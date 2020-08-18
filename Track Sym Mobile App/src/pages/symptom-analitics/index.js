import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import {
  TopNavigationAction,
  TopNavigation,
  Layout,
  Text,
  Icon,
  Divider,
  List,
  Autocomplete,
  AutocompleteItem,
  Card,
} from '@ui-kitten/components';

import userIDStore from '../../data-management/user-id-data/userIDStore';

const ArrowIosBackIcon = (style) => <Icon {...style} name='arrow-ios-back' />;

const SymptomAnaliticsPage = (props) => {
  const [data, setData] = useState([
    { index: 0, val: 'loading...', label: 'Total Symptom Reports' },
    { index: 1, val: 'loading...', label: 'Symptom Reports Yesterday' },
    { index: 2, val: '0.8', label: 'Symptom Reports to COVID Cases' },
    { index: 3, val: 'loading...', label: 'Most Reported Symptom' },
  ]);
  const [mostCommonFetched, setMostCommonFetched] = useState(false);
  const [last24HourFetched, setLast24HourFetched] = useState(false);
  const [pepoleFetched, setPepoleFetched] = useState(false);
  const [search, setSearch] = useState('World');
  const [countryFilter, setCountryFilter] = useState('');
  const [countries, setCountries] = useState([]);
  const [controlCountries, setControlCountries] = useState([]);

  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  const fetchMostCommon = async (filter) => {
    setMostCommonFetched(false);
    let url =
      'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptom_statistics/most_common';
    if (filter && filter !== 'World') {
      url += `?country=${filter}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userIDStore.getState().userToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const json = await response.json();
        setData((data) =>
          data.map((d) => {
            if (d.index === 3) {
              return { ...d, val: json[0] ? json[0].name : 'No Symptom Yet' };
            }
            return d;
          })
        );
        setMostCommonFetched(true);
      }
    } catch (error) {}
  };

  const fetchStat = async (filter) => {
    let url =
      'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptom_statistics/';
    if (filter && filter !== 'World') {
      url += `?country=${filter}`;
    }

    setLast24HourFetched(false);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userIDStore.getState().userToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const json = await response.json();
        console.log(json);

        setData((data) =>
          data.map((d) => {
            if (d.index === 1) {
              return { ...d, val: json.result };
            }
            return d;
          })
        );
        setLast24HourFetched(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPeopleStat = async (filter) => {
    let url =
      'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptom_statistics/people';
    if (filter && filter !== 'World') {
      url += `?country=${filter}`;
    }

    setPepoleFetched(false);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + userIDStore.getState().userToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log(response.status);
      if (response.status === 200) {
        const json = await response.json();
        console.log(json);

        setData((data) =>
          data.map((d) => {
            if (d.index === 0) {
              return { ...d, val: json.result };
            }
            return d;
          })
        );
        setPepoleFetched(true);
      }
    } catch (error) {
      console.log(error);
      setPepoleFetched(true);
    }
  };

  const getCountryList = async () => {
    try {
      const response = await fetch(
        'https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/statistics/countries',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + userIDStore.getState().userToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const json = await response.json();
        setCountries(json);
        setControlCountries(json);
      }
    } catch (error) {}
  };

  const handleTextChange = (item, query) =>
    item.name.toLowerCase().includes(query.toLowerCase());

  useEffect(() => {
    getCountryList();
    fetchStat(countryFilter);
    fetchMostCommon(countryFilter);
    fetchPeopleStat(countryFilter);
  }, [countryFilter]);

  return (
    <SafeAreaView style={styles.screen}>
      <TopNavigation
        title='Symptom Analitics'
        alignment='center'
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <Layout style={styles.container}>
        <Autocomplete
          style={{ paddingTop: 5, marginHorizontal: 10 }}
          placeholder='Enter Country'
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setCountries(
              controlCountries.filter((item) => handleTextChange(item, text))
            );
          }}
          onSelect={(index) => {
            setCountryFilter(countries[index].name);
            setSearch(countries[index].name);
          }}>
          {countries.map((item, index) => (
            <AutocompleteItem
              key={index}
              title={item.name}
              style={{ paddingVertical: 10, paddingHorizontal: 10 }}
            />
          ))}
        </Autocomplete>

        <List
          style={{ flex: 1, paddingTop: 5 }}
          data={data}
          refreshing={
            !mostCommonFetched && !last24HourFetched && !pepoleFetched
          }
          onRefresh={() => {
            fetchStat(countryFilter);
            fetchMostCommon(countryFilter);
            fetchPeopleStat(countryFilter);
          }}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, _ }) => (
            <Card level='1' style={styles.card} disabled>
              <Layout style={styles.layout}>
                <Text status='primary' style={styles.number}>
                  {item.val}
                </Text>
                <Text appearance='hint'>{item.label}</Text>
              </Layout>
            </Card>
          )}
        />
      </Layout>
    </SafeAreaView>
  );
};

export default SymptomAnaliticsPage;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
  },
  container: {
    flex: 1,
  },
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 45,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  screen: { flex: 1 },
});
