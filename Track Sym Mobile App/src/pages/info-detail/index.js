import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  Divider,
  Layout,
  Text,
  Icon,
  ViewPager,
  Radio,
  Button,
} from '@ui-kitten/components';
import { ImageOverlay } from './extra/image-overlay.component';
import styles from './extra/styles';
import { strings } from '../../localization/localization';
import { LangContext } from '../../../assets/lang/language-context';

const BackIcon = (props) => <Icon name='arrow-ios-back-outline' {...props} />;

export default InfoDetailScreen = (props) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  //setting up the language
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  strings.setLanguage(lang);

  const data = {
    title: strings.WhatIsCOVID19,
    description: strings.CoronaVirusDesease2019,
    content: strings.WhatIsCOVID19DetailInfoDescriptionContentOne,
    image: require('./assets/covid.jpg'),
    title_2: strings.WhatDoWeKnowSoFar,
  };

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const prevIcon = (props) => <Icon name='arrow-left-outline' {...props} />;
  const nextIcon = (props) => <Icon name='arrow-right-outline' {...props} />;

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        alignment='center'
        title={strings.CovidDetail}
        accessoryLeft={renderBackAction}
      />
      <Layout style={styles.container}>
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
            <Text>{data.content}</Text>
          </Layout>

          <ViewPager
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}>
            <Layout>
              <Divider />
              <View style={styles.authoringContainer}>
                <Text style={styles.dateLabel} appearance='hint' category='p2'>
                  {data.title_2}
                </Text>
              </View>
              <Divider />
              <Layout style={styles.contentContainer}>
                <Text>
                  {strings.InfoCovidDetailParagraphOneSubOne}
                  {'\n'}
                  {'\n'}
                  {strings.InfoCovidDetailParagraphOneSubTwo}
                  {'\n'}
                  {'\n'}
                  {strings.InfoCovidDetailParagraphOneSubThree}
                  {'\n'}
                  {'\n'}
                  {strings.InfoCovidDetailParagraphOneSubFour}
                </Text>
              </Layout>
            </Layout>

            <Layout>
              <Divider />
              <View style={styles.authoringContainer}>
                <Text style={styles.dateLabel} appearance='hint' category='p2'>
                  {strings.WhereDidItComeFrom}
                </Text>
              </View>
              <Divider />
              <Layout style={styles.contentContainer}>
                <Text>
                  {strings.InfoCovidDetailParagraphTwoSubOne}
                  {'\n'} {'\n'}
                  {strings.InfoCovidDetailParagraphTwoSubTwo}
                </Text>
              </Layout>
            </Layout>

            <Layout>
              <Divider />
              <View style={styles.authoringContainer}>
                <Text style={styles.dateLabel} appearance='hint' category='p2'>
                  {strings.Misconceptions}
                </Text>
              </View>
              <Divider />
              <Layout style={styles.contentContainer}>
                <Text>
                  {strings.InfoCovidDetailParagraphThreeSubOne}
                  {'\n'}
                  {'\n'}
                  {strings.InfoCovidDetailParagraphThreeSubTwo}
                  {'\n'}
                  {'\n'}
                  {strings.InfoCovidDetailParagraphThreeSubThree}
                  {'\n'}
                </Text>
              </Layout>
            </Layout>
          </ViewPager>

          <Layout
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}
            level='1'>
            <Radio
              onChange={() => setSelectedIndex(0)}
              style={styles.radio}
              checked={selectedIndex == 0}
            />
            <Radio
              onChange={() => setSelectedIndex(1)}
              style={styles.radio}
              checked={selectedIndex == 1}
            />
            <Radio
              onChange={() => setSelectedIndex(2)}
              style={styles.radio}
              checked={selectedIndex == 2}
            />
          </Layout>
          <Layout
            style={{
              flex: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingHorizontal: 15,
              paddingBottom: 10,
            }}>
            <Button
              size='small'
              disabled={selectedIndex == 0}
              onPress={() => setSelectedIndex(selectedIndex - 1)}
              accessoryLeft={prevIcon}></Button>
            <Button
              size='small'
              disabled={selectedIndex == 2}
              accessoryLeft={nextIcon}
              onPress={() => setSelectedIndex(selectedIndex + 1)}></Button>
          </Layout>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};
