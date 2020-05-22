import React from 'react';
import {StyleSheet} from 'react-native';
import {Layout, Text, ViewPager, Button, Icon} from '@ui-kitten/components';

export const ViewPagerSimpleUsageShowcase = (props) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <ViewPager
      style={styles.container}
      selectedIndex
      selectedIndex={selectedIndex}
      onSelect={(index) => setSelectedIndex(index)}>
      <Layout style={styles.tab} level="2">
        <Text category="h5">USERS</Text>
        <Button onPress={() => setSelectedIndex(selectedIndex + 1)}>
          NEXT
        </Button>
      </Layout>
      <Layout style={styles.tab} level="2">
        <Text category="h5">ORDERS</Text>
        <Layout style={{flexDirection: 'row'}}>
          <Button
            style={{marginRight: 20}}
            onPress={() => setSelectedIndex(selectedIndex - 1)}>
            Prev
          </Button>
          <Button onPress={() => setSelectedIndex(selectedIndex + 1)}>
            NEXT
          </Button>
        </Layout>
      </Layout>
      <Layout style={styles.tab} level="2">
        <Text category="h5">TRANSACTIONS</Text>
        <Button onPress={() => setSelectedIndex(selectedIndex - 1)}>
          Prev
        </Button>
      </Layout>
    </ViewPager>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
