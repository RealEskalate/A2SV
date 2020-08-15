import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  Icon,
  Layout,
  Text,
  List,
} from '@ui-kitten/components';
import { Divider } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

const ArrowIosBackIcon = (style) => <Icon {...style} name='arrow-ios-back' />;

const NotificationView = (props) => {
  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title='Notification Detail'
        alignment='center'
        accessoryLeft={renderBackAction}
      />
      <Layout style={{ flex: 1, flexDirection: "column" }}>
      <ScrollView>
        <Layout style={styles.headerContainer} level="4">
              <Text style={styles.headerTitle} category='h1'>
                {props.route.params.data.result.title}
              </Text>
              <Layout style={styles.activityContainer} level="4">
                <Text>FULL NAME: </Text>
                <Text>
                {props.route.params.data.result.name}
              </Text>
              </Layout>
              <Layout style={styles.activityContainer} level="4">
                <Text>TEST DATE: </Text>
              <Text
                style={styles.headerDescription}
                category='s1'>
                {props.route.params.data.result.test_date}
              </Text>
              </Layout>
              <Layout style={styles.activityContainer} level="4">
                <Text>TEST RESULT: </Text>
              <Text
                style={styles.headerDescription}
                category='s1'>
                {props.route.params.data.result.test_result}
              </Text>
              </Layout>
                
            </Layout>
            <Layout >
            <Divider />
              <Text style={styles.messageContainer}>
                {props.route.params.data.result.message}
              </Text>
            </Layout>
        <List
          data={props.route.params.data.methods}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <>
              <Layout>
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
            </>
          )}
        />
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

export default NotificationView;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingVertical: 24,
  },
  headerTitle: {
    textAlign: 'center',
    marginVertical: 24,
    zIndex: 1,
  },
  headerTitle: {
    marginHorizontal: 16,
    // fontSize: 18,
  },
  horizontalItem: {
    width: 256,
    marginHorizontal: 8,
  },
  horizontalList: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  headerDescription: {
    zIndex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  content_Container: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  activityContainer: {
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  authoringInfoContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  dateLabel: {
    marginHorizontal: 8,
    fontSize: 18,
  },
  authoringContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
  radio: {
    margin: 2,
  },
  messageContainer: {
    marginHorizontal: 16,
    paddingVertical: 5,

  },
});

