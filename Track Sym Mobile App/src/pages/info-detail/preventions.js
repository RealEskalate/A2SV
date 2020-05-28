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
import { preventionData as data } from './extra/data';
import styles from './extra/styles';
import { InfoCard } from './extra/InfoCard';

const BackIcon = (props) => <Icon name='arrow-ios-back-outline' {...props} />;
const methods = [
  {
    title: 'Hand Washing',
    label: 'Rub or wash your hand with soap and water for at least 20 sec',
    tag: '> 20 Sec',
    image: require('../info-detail/assets/washing.jpg'),
  },
  {
    title: 'Social Distancing',
    label: 'Maintain at least 2m (6 ft) gap in groups.',
    tag: '2 Meters',
    image: require('../info-detail/assets/social.jpg'),
  },
  {
    title: 'Respiratory Hygiene',
    label: 'Use mouse and nose covering masks when going outside',
    tag: 'Face covering',
    image: require('../info-detail/assets/face.jpg'),
  },
  {
    title: 'Stay Informed',
    label: 'Follow the advice of healthcare provider and your government',
    tag: 'Truth vs Fake',
    image: require('../info-detail/assets/info.jpg'),
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
    return (
      <Layout style={{ paddingBottom: 10 }}>
        {list.map((item) => (
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
        ))}
      </Layout>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        alignment='center'
        title='PREVENTION'
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
          {renderDetail(data.methods1)}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.headerTitle} appearance='hint'>
              RECOMMENDED METHODS
            </Text>
            <List
              contentContainerStyle={styles.horizontalList}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={methods}
              renderItem={renderHorizontalTrainingItem}
            />
          </View>
          {renderDetail(data.methods2)}
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};
