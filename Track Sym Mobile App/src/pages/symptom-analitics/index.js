import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import {
  TopNavigationAction,
  TopNavigation,
  Layout,
  Text,
  Icon,
  Divider,
  List,
  Spinner,
} from '@ui-kitten/components';

const ArrowIosBackIcon = (style) => <Icon {...style} name='arrow-ios-back' />;

const SymptomAnaliticsPage = (props) => {
  const [data, setData] = useState([
    { val: 3500, label: 'The Maldives, officially the Republic' },
    { val: 0, label: 'The Maldives, officially the Republic' },
    { val: 3500, label: 'The Maldives, officially the Republic' },
    { val: 0.8, label: 'The Maldives, officially the Republic' },
  ]);
  const [refresing, setRefresing] = useState(false);

  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  return (
    <SafeAreaView style={styles.screen}>
      <TopNavigation
        title='Symptom Analitics'
        alignment='center'
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <Layout style={styles.container}>
        <List
          style={{ flex: 1 }}
          data={data}
          refreshing={refresing}
          onRefresh={() => {}}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, _ }) => (
            <Layout style={styles.card} level='1'>
              <Text status='primary' style={styles.number}>
                {item.val}
              </Text>
              <Text appearance='hint'>{item.label}</Text>
            </Layout>
          )}
        />
      </Layout>
    </SafeAreaView>
  );
};

export default SymptomAnaliticsPage;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  number: {
    fontSize: 50,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  screen: { flex: 1 },
});
