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
import styles from './extra/styles';
import { InfoCard } from './extra/InfoCard';
import { strings } from '../../localization/localization';
import { LangContext } from '../../../assets/lang/language-context';

const BackIcon = (props) => <Icon name='arrow-ios-back-outline' {...props} />;

export default PrevDetailScreen = (props) => {
  //setting up the language
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  strings.setLanguage(lang);

  const methods = [
    {
      title: strings.HandWashing,
      label: strings.InfoDetailPreventionMethodsLabelOne,
      tag: strings.InfoDetailPreventionMethodsTagOne,
      image: require('../info-detail/assets/washing.jpg'),
    },
    {
      title: strings.SocialDistancing,
      label: strings.InfoDetailPreventionMethodsLabelTwo,
      tag: strings.InfoDetailPreventionMethodsTagTwo,
      image: require('../info-detail/assets/social.jpg'),
    },
    {
      title: strings.RespiratoryHygiene,
      label: strings.InfoDetailPreventionMethodsLabelThree,
      tag: strings.InfoDetailPreventionMethodsTagThree,
      image: require('../info-detail/assets/face.jpg'),
    },
    {
      title: strings.StayInformed,
      label: strings.InfoDetailPreventionMethodsLabelFour,
      tag: strings.InfoDetailPreventionMethodsTagFour,
      image: require('../info-detail/assets/info.jpg'),
    },
  ];
  
  const data = {
    title: strings.Prevention,
    description: strings.PreventionIsBetterThanCure,
    image: require('./assets/wash.jpg'),
    methods1: [
      {
        name: strings.HandWashing,
        inside:
          strings.PreventionDetailInfoDescriptionMethodOneInsideContentOne,
      },
      {
        name: strings.SocialDistancing,
        inside:
          strings.PreventionDetailInfoDescriptionMethodOneInsideContetnTwo,
      },
    ],
    methods2: [
      {
        name: strings.RespiratoryHygiene,
        inside:
          strings.PreventionDetailInfoDescriptionMethodTwoInsideContentOne,
      },
      {
        name: strings.StayInformed,
        inside:
          strings.PreventionDetailInfoDescriptionMethodTwoInsideContetnTwo,
      },
    ],
  };

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
        title={strings.Prevention}
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
              {strings.RecommendedMethods}
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
