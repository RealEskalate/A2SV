import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  Divider,
  Layout,
  Text,
  Icon,
} from '@ui-kitten/components';
import {ImageOverlay} from './extra/image-overlay.component';
import {covidData as data} from './extra/data';
import styles from './extra/styles';

const BackIcon = (props) => <Icon name="arrow-ios-back-outline" {...props} />;

export default InfoDetailScreen = (props) => {
  const navigateBack = () => {
    props.navigation.goBack();
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );
  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        alignment="center"
        title="Detail"
        accessoryLeft={renderBackAction}
      />
      <Layout style={styles.container}>
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
            <Text>{data.content}</Text>
          </Layout>
          <View style={styles.authoringContainer}>
            <Text appearance="hint" category="p2">
              {`By ${data.author.fullName}`}
            </Text>
            <Text style={styles.dateLabel} appearance="hint" category="p2">
              {data.date}
            </Text>
          </View>
          <Divider />
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};
