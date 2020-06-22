import React, { useState, useEffect } from 'react';
import {
  Layout,
  Text,
  List,
  Divider,
  Icon,
  Spinner,
} from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import userIDStore from '../../data-management/user-id-data/userIDStore';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sem',
  'Oct',
  'Nov',
  'Dec',
];

const SymptomHistory = () => {
  const [data, setData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredData, setFilteredData] = useState();
  const [loading, setLoading] = useState(true);

  const [calander, setCalander] = useState();

  const populateCalander = () => {
    const caladerData = [];

    for (let index = 0; index < 14; index++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - index);

      caladerData.push({
        day: currentDate.getDate(),
        dayIdx: currentDate.getDay(),
        monthIdx: currentDate.getMonth(),
        compareDate: new Date(currentDate),
      });
    }

    setCalander(caladerData);
  };

  const colors = {
    LOW: '#558b2f',
    MEDIUM: '#fbc02d',
    HIGH: '#d32f2f',
  };

  useEffect(() => {
    populateCalander();
    fetchSymptom();
  }, []);

  const fetchSymptom = async () => {
    try {
      const response = await fetch(
        `https://sym-track.herokuapp.com/api/symptomuserhistory/user/${
          userIDStore.getState().userId
        }`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userIDStore.getState().userToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const json = await response.json();
        setData(json.events);

        json && updateSymptomHistory(0);
      }
    } catch (error) {
      console.log(`sym hist ${error}`);
    }
  };

  const getParsedDate = (unparsedDate) => {
    const date = new Date(unparsedDate);
    return `${
      months[date.getMonth()]
    } ${date.getDate()} - ${date.getFullYear()}`;
  };

  const updateSymptomHistory = (dateIndex) => {
    setSelectedIndex(dateIndex);
    setLoading(true);

    let selectedDate = new Date();
    if (calander) {
      selectedDate = new Date(calander[dateIndex].compareDate);
    }

    setFilteredData(
      data.filter((d) => {
        return selectedDate.getTime() >= new Date(d.start).getTime();
      })
    );

    setLoading(false);
  };

  return (
    <Layout style={styles.contanier} level='2'>
      <Layout style={{ flex: 1 }}>
        <Layout style={{ flexDirection: 'row' }}>
          <List
            horizontal
            data={calander}
            inverted
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  updateSymptomHistory(index);
                }}>
                <Layout
                  level={selectedIndex === index ? '3' : '1'}
                  style={{
                    width: 60,
                    height: 70,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text appearance='hint' category='h6'>
                    {item.day}
                  </Text>
                  <Text category='h6' style={{ fontWeight: 'bold' }}>
                    {days[item.dayIdx]}
                  </Text>
                  <Text appearance='hint'>{months[item.monthIdx]}</Text>
                </Layout>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              setSelectedIndex(-1);
            }}>
            <Layout
              level={selectedIndex === -1 ? '3' : '1'}
              style={{
                width: 60,
                height: 70,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon
                style={{ width: 24, height: 24 }}
                fill='#8F9BB3'
                name='calendar-outline'
              />
              <Text appearance='hint'>Current</Text>
            </Layout>
          </TouchableOpacity>
        </Layout>

        <Divider />

        <Layout level='2' style={{ padding: 10 }}>
          <Text category='h6' appearance='hint'>
            MY SYMPTOMS
          </Text>
        </Layout>
        <Divider />

        <Layout style={{ flex: 1 }}>
          {loading ? (
            <Layout
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Spinner />
            </Layout>
          ) : (
            <List
              data={filteredData}
              renderItem={({ item }) => (
                <>
                  <Layout
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20,
                      paddingVertical: 7,
                    }}>
                    <Layout style={{ justifyContent: 'center' }}>
                      <Text category='h6'>{item.name}</Text>
                      <Text appearance='hint'>
                        Registered {getParsedDate(item.start)}
                      </Text>
                    </Layout>
                    <Layout
                      style={{
                        width: 50,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          backgroundColor: colors[item.relevance],
                          width: 30,
                          height: 30,
                          borderRadius: 5,
                        }}
                      />
                      <Text appearance='hint'>{item.relevance}</Text>
                    </Layout>
                  </Layout>
                  <Divider />
                </>
              )}
            />
          )}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SymptomHistory;

const styles = StyleSheet.create({
  contanier: { flex: 1 },
});
