import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  Divider,
  Layout,
  Text,
  Icon,
  List,
} from '@ui-kitten/components';
import { ImageOverlay } from './extra/image-overlay.component';
import { symptomsData as data } from './extra/data';
import styles from './extra/styles';
import { InfoCard } from './extra/InfoCard';

const BackIcon = (props) => <Icon name='arrow-ios-back-outline' {...props} />;
const mostCommon = [
  {
    title: 'Fever',
    label: 'Body temperature is 103°F (39.4°C) or above',
    tag: '83% - 99%',
    image: require('../info-detail/assets/fever.jpg'),
  },
  {
    title: 'Dry Cough',
    label: 'Does not bring up mucus and stays for eight weeks or more',
    tag: '59% - 82%',
    image: require('../info-detail/assets/cough2.jpg'),
  },
  {
    title: 'Fatigue',
    label: 'Lack of enengy and Motivation (physical and mental)',
    tag: '40% - 70%',
    image: require('../info-detail/assets/tired.jpg'),
  },
  {
    title: 'Shortness of Breath',
    label:
      'Trouble inhaling or exhaling or feels as though they cannot get enough oxygen',
    tag: '31% - 40%',
    image: require('../info-detail/assets/short.jpg'),
  },
  {
    title: 'Myalgia',
    label:
      'Pain or ache in muscles characterized by chronic pain, stiffness and tenderness',
    tag: '11% - 35%',
    image: require('../info-detail/assets/ache.jpg'),
  },
];

const lessCommon = [
  {
    title: 'Headache',
    label: 'Sharp, throbbing or dull feeling across the head',
    tag: '',
    image: require('../info-detail/assets/headache.jpg'),
  },
  {
    title: 'Anosmia',
    label: 'Usually associated with partial loss of smell or a blocked nose',
    tag: '',
    image: require('../info-detail/assets/smell.jpg'),
  },
  {
    title: 'Sore Throat',
    label:
      'Scratchiness or irritation of the throat that often worsens when you swallow',
    tag: '',
    image: require('../info-detail/assets/cough.jpg'),
  },
  {
    title: 'Chills',
    label: 'Feeling of being cold without an apparent cause',
    tag: '',
    image: require('../info-detail/assets/cold2.jpg'),
  },
];

export default PrevDetailScreen = (props) => {
  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const renderHorizontalTrainingItem = (info) => (
    <InfoCard style={styles.horizontalItem} data={info.item} />
  );

  const renderDetail = (list) => {
    return list.map((item) => (
      <Layout key={item.key}>
        <Divider />
        <View style={styles.authoringContainer}>
          <Text style={styles.dateLabel} appearance='hint' category='p2'>
            {item.name}
          </Text>
        </View>
        <Divider />
        <Layout style={styles.content_Container}>
          <Text>{item.inside}</Text>
        </Layout>
      </Layout>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        alignment='center'
        title='Symptoms'
        accessoryLeft={renderBackAction}
      />
      <Layout style={styles.container} level='2'>
        <ScrollView>
          <ImageOverlay style={styles.headerContainer} source={data.image}>
            <Text style={styles.headerTitle} category='h1' status='control'>
              {data.title}
            </Text>
            <Text
              style={styles.headerDescription}
              category='s1'
              status='control'>
              {data.description}
            </Text>
          </ImageOverlay>
          <Layout style={styles.contentContainer} level='1'>
            <Text>{data.content + '\n'}</Text>
            <Text>{data.content_two}</Text>
          </Layout>
          <Divider />
          <View style={{ marginTop: 10 }}>
            <Text style={styles.headerTitle} appearance='hint'>
              MOST COMMON
            </Text>
            <List
              contentContainerStyle={styles.horizontalList}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={mostCommon}
              renderItem={renderHorizontalTrainingItem}
            />
          </View>
          {renderDetail(data.most_list)}
          <Divider />
          <View style={{ marginTop: 10 }}>
            <Text style={styles.headerTitle} appearance='hint'>
              LESS COMMON
            </Text>
            <List
              contentContainerStyle={styles.horizontalList}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={lessCommon}
              renderItem={renderHorizontalTrainingItem}
            />
          </View>
          {renderDetail(data.less_list)}
          <Layout style={{ marginBottom: 10 }}></Layout>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};
