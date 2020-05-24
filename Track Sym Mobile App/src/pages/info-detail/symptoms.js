import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  Divider,
  Layout,
  Text,
  Icon,
  List,
} from '@ui-kitten/components';
import {ImageOverlay} from './extra/image-overlay.component';
import {symptomsData as data} from './extra/data';
import styles from './extra/styles';
import {InfoCard} from './extra/InfoCard';

const BackIcon = (props) => <Icon name="arrow-ios-back-outline" {...props} />;
const mostCommon = [
  {
    title: 'High Fever',
    label: 'Symptom of an underlying condition, most often an infection',
    tag: 'More than 60 oC',
    image: require('../info-detail/assets/fever.jpg'),
  },
  {
    title: 'Dry Cough',
    label: 'The virus can be reason to trigger coughing',
    tag: 'Use your Elbow',
    image: require('../info-detail/assets/cough.jpg'),
  },
  {
    title: 'Tiredness',
    label: 'Fatigue can be one symtpom of virus',
    tag: '',
    image: require('../info-detail/assets/tired.jpg'),
  },
];

const lessCommon = [
  {
    title: 'Aches and Pain',
    label: 'loss of smell or a blocked nose, it is usually associated',
    tag: 'Check your Status',
    image: require('../info-detail/assets/ache.jpg'),
  },
  {
    title: 'Sore Throat',
    label: 'Infections like the common cold and flu can casue it',
    tag: 'Use medicne for throat',
    image: require('../info-detail/assets/cough.jpg'),
  },
  {
    title: 'Head Ache',
    label: 'Headache related to these viral fever',
    tag: 'Treat your self well',
    image: require('../info-detail/assets/headache.jpg'),
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
          <Text style={styles.dateLabel} appearance="hint" category="p2">
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
        alignment="center"
        title="Symptoms"
        accessoryLeft={renderBackAction}
      />
      <Layout style={styles.container} level="2">
        <ScrollView>
          <ImageOverlay style={styles.headerContainer} source={data.image}>
            <Text style={styles.headerTitle} category="h1" status="control">
              {data.title}
            </Text>
            <Text
              style={styles.headerDescription}
              category="s1"
              status="control">
              {data.description}
            </Text>
          </ImageOverlay>
          <Layout style={styles.contentContainer} level="1">
            <Text>{data.content + '\n'}</Text>
            <Text>{data.content_two}</Text>
          </Layout>
          <Divider />
          <View style={{marginTop: 10}}>
            <Text style={styles.headerTitle} appearance="hint">
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
          <View style={{marginTop: 10}}>
            <Text style={styles.headerTitle} appearance="hint">
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
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};
