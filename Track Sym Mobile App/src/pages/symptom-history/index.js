import React, { useState } from 'react';
import { Layout, Text, List, ListItem, Divider } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View as AnimatableView } from 'react-native-animatable';

const data = [
  {
    name: 'Fatigue',
    sever: 'high',
    startDate: 'Apr 10',
    endDate: 'Apr 10',
  },
  {
    name: 'Headache',
    sever: 'high',
    startDate: 'Apr 2',
    endDate: '6/20/2020',
  },
  {
    name: 'Soar Throat',
    sever: 'high',
    startDate: 'Apr 2',
    endDate: '6/20/2020',
  },
  {
    name: 'Ansomnia',
    sever: 'high',
    startDate: 'Mar 29',
    endDate: '6/20/2020',
  },
  {
    name: 'Maylgia',
    sever: 'high',
    startDate: 'Apr 6',
    endDate: '6/20/2020',
  },
  {
    name: 'Fatigue',
    sever: 'high',
    startDate: 'Apr 10',
    endDate: 'Apr 10',
  },
  {
    name: 'Headache',
    sever: 'high',
    startDate: 'Apr 2',
    endDate: '6/20/2020',
  },
  {
    name: 'Soar Throat',
    sever: 'high',
    startDate: 'Apr 2',
    endDate: '6/20/2020',
  },
  {
    name: 'Ansomnia',
    sever: 'high',
    startDate: 'Mar 29',
    endDate: '6/20/2020',
  },
  {
    name: 'Maylgia',
    sever: 'high',
    startDate: 'Apr 6',
    endDate: '6/20/2020',
  },
];

const dates = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const datesNum = [11, 12, 13, 14, 15, 16, 17];

const SymptomHistory = (props) => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [height, setHeight] = useState(10);
  const idx = Math.round(Math.random() * 2);
  const colors = [
    { c: '#d32f2f', n: 'High' },
    { c: '#fbc02d', n: 'Moderate' },
    { c: '#558b2f', n: 'Mild' },
  ];

  return (
    <Layout style={styles.contanier} level='2'>
      <Layout style={{ flex: 1 }}>
        <Layout>
          <List
            horizontal
            data={dates}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => setSelectedDate(datesNum[index])}>
                <Layout
                  level={selectedDate === datesNum[index] ? '3' : '0'}
                  style={{
                    width: 60,
                    height: 70,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text appearance='hint' category='h6'>
                    {datesNum[index]}
                  </Text>
                  <Text category='h6' style={{ fontWeight: 'bold' }}>
                    {item}
                  </Text>
                  <Text appearance='hint'>Apr</Text>
                </Layout>
              </TouchableOpacity>
            )}
          />
        </Layout>

        <Divider />
        <Layout level='2' style={{ padding: 10 }}>
          <Text category='h6' appearance='hint'>
            MY SYMPTOMS
          </Text>
        </Layout>
        <Divider />

        <Layout style={{ flex: 1 }}>
          <List
            data={data}
            renderItem={({ item, index }) => (
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
                    <Text appearance='hint'>{item.startDate}</Text>
                  </Layout>
                  <Layout
                    style={{
                      width: 50,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AnimatableView
                      style={{
                        backgroundColor:
                          colors[Math.round(Math.random() * 2)].c,
                        width: 30,
                        height: 30,
                        borderRadius: 5,
                      }}
                      animation='pulse'
                      iterationCount='2'></AnimatableView>
                    <Text appearance='hint'>
                      {colors[Math.round(Math.random() * 2)].n}
                    </Text>
                  </Layout>
                </Layout>
                <Divider />
              </>
            )}
          />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SymptomHistory;

const styles = StyleSheet.create({
  contanier: { flex: 1 },
});
