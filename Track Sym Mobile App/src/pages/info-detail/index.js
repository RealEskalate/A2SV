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
import { covidData as data } from './extra/data';
import styles from './extra/styles';

const BackIcon = (props) => <Icon name='arrow-ios-back-outline' {...props} />;

export default InfoDetailScreen = (props) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

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
        title='COVID DETAIL'
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
                  There is much more to coronaviruses than SARS-CoV-2.
                  Coronaviruses are actually a family of hundreds of viruses.
                  Most of these infect animals such as bats, chickens, camels
                  and cats.
                  {'\n'}
                  {'\n'}
                  Occasionally, viruses that infect one species can mutate in
                  such a way that allows them to start infecting other species.
                  This is called cross-species transmission or spillover.
                  {'\n'}
                  {'\n'}
                  The first coronavirus was discovered in chickens in the 1930s.
                  It was a few decades until the first human coronaviruses were
                  identified in the 1960s.
                  {'\n'}
                  {'\n'}
                  To date, seven coronaviruses can cause disease in humans. Four
                  are endemic (regularly found among particular people or in a
                  certain area) and usually cause mild disease, but three can
                  cause much more serious and even fatal disease.
                </Text>
              </Layout>
            </Layout>

            <Layout>
              <Divider />
              <View style={styles.authoringContainer}>
                <Text style={styles.dateLabel} appearance='hint' category='p2'>
                  WHERE DID IT COME FROM ?
                </Text>
              </View>
              <Divider />
              <Layout style={styles.contentContainer}>
                <Text>
                  It is said to have come from a market that sells meat and live
                  animals. It is believed that the virus might have been
                  transmitted through direct contact between humans and animals.
                  {'\n'} {'\n'}
                  Either by touching those animals or by eating them. And it can
                  also spread via the air. However, the actual source of this
                  disease is not known yet.
                </Text>
              </Layout>
            </Layout>

            <Layout>
              <Divider />
              <View style={styles.authoringContainer}>
                <Text style={styles.dateLabel} appearance='hint' category='p2'>
                  MISCONCEPTIONS
                </Text>
              </View>
              <Divider />
              <Layout style={styles.contentContainer}>
                <Text>
                  A Common misconception regarding COVID-19 is that
                  coronaviruses affect only old people. This is far from true
                  and is killing many people from various age groups.
                  {'\n'}
                  {'\n'}
                  The risk of dying due to COVID-19 is indeed significantly
                  higher for 80+ age groups(as high as 14.8%) while it is below
                  1% for age groups below 40.
                  {'\n'}
                  {'\n'}
                  But this does not mean that teenagers will not be affected or
                  die. So these and other false facts can lead to a dangerous
                  road.
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
