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
// import { symptomsData as data } from "./extra/data";
import styles from './extra/styles';
import { InfoCard } from './extra/InfoCard';
import { strings } from '../../localization/localization';
import { LangContext } from '../../../assets/lang/language-context';

const BackIcon = (props) => <Icon name='arrow-ios-back-outline' {...props} />;
const mostCommon = [
  {
    title: strings.HighFever,
    label: strings.InfoDetailMostCommonSyptomsListLableOne,
    tag: '83% - 99%',
    image: require('../info-detail/assets/fever.jpg'),
  },
  {
    title: strings.DryCough,
    label: strings.InfoDetailMostCommonSyptomsListLableTwo,
    tag: '59% - 82%',
    image: require('../info-detail/assets/cough2.jpg'),
  },
  {
    title: strings.Fatigue,
    label: strings.InfoDetailMostCommonSyptomsListLableThree,
    tag: '44% - 70%',
    image: require('../info-detail/assets/tired.jpg'),
  },
  {
    title: strings.ShortnessOfBreath,
    label: strings.InfoDetailMostCommonSyptomsListLableFour,
    tag: '31% - 40%',
    image: require('../info-detail/assets/short.jpg'),
  },
  {
    title: strings.Myalgia,
    label: strings.InfoDetailMostCommonSyptomsListLableFive,
    tag: '11% - 35%',
    image: require('../info-detail/assets/ache.jpg'),
  },
];

const lessCommon = [
  {
    title: strings.Headache,
    label: strings.InfoDetailLessCommonSyptomsListLableOne,
    tag: '< 14%',
    image: require('../info-detail/assets/headache.jpg'),
  },
  {
    title: strings.SoreThroat,
    label: strings.InfoDetailLessCommonSyptomsListLableTwo,
    tag: '< 14%',
    image: require('../info-detail/assets/cough.jpg'),
  },
  {
    title: strings.Chills,
    label: strings.InfoDetailLessCommonSyptomsListLableThree,
    tag: '< 11%',
    image: require('../info-detail/assets/cold2.jpg'),
  },
  {
    title: strings.Anosmia,
    label: strings.InfoDetailLessCommonSyptomsListLableFour,
    tag: '< 5%',
    image: require('../info-detail/assets/smell.jpg'),
  },
];

export default PrevDetailScreen = (props) => {
  //setting up the language
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  strings.setLanguage(lang);

  const data = {
    title: strings.SymptomsOfCOVID19,
    description: strings.SyptomsDetailInfoDescription,
    content: strings.SyptomsDetailInfoDescriptionContentOne,
    content_two: strings.SyptomsDetailInfoDescriptionContentTwo,
    most_list: [
      {
        key: '1',
        name: strings.HighFever,
        inside: strings.SyptomsDetailInfoDescriptionMostListInsideContentOne,
      },
      {
        key: '2',
        name: strings.DryCough,
        inside: strings.SyptomsDetailInfoDescriptionMostListInsideContentTwo,
      },
      {
        key: '3',
        name: strings.Fatigue,
        inside: strings.SyptomsDetailInfoDescriptionMostListInsideContentThree,
      },
      {
        key: '4',
        name: strings.ShortnessOfBreath,
        inside: strings.SyptomsDetailInfoDescriptionMostListInsideContentFour,
      },
      {
        key: '5',
        name: strings.Myalgia,
        inside: strings.SyptomsDetailInfoDescriptionMostListInsideContentFive,
      },
    ],
    less_list: [
      {
        name: strings.SyptomsDetailInfoDescriptionLessListNameOne,
        inside: strings.SyptomsDetailInfoDescriptionLessListInsideContentone,
      },
      {
        name: strings.SyptomsDetailInfoDescriptionLessListNameTwo,
        inside: strings.SyptomsDetailInfoDescriptionLessListInsideContentTwo,
      },
      {
        name: strings.SoreThroat,
        inside: strings.SyptomsDetailInfoDescriptionLessListInsideContentThree,
      },
      {
        name: strings.Chills,
        inside: strings.SyptomsDetailInfoDescriptionLessListInsideContentFour,
      },
    ],
    image: require('./assets/sym.jpg'),
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
        title={strings.COVID19Symptoms}
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
              {strings.MostCommon}
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
              {strings.LessCommon}
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
