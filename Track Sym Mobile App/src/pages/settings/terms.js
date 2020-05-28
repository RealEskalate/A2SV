import React from 'react';
import { SafeAreaView } from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  Icon,
  Divider,
  Layout,
  Text,
} from '@ui-kitten/components';

const TermsAndPrivacyScreen = (props) => {
  const ArrowIosBackIcon = (style) => <Icon {...style} name='arrow-ios-back' />;

  const renderBackIcon = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={() => props.navigation.goBack()}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title='TERMS AND PRIVACY'
        alignment='center'
        accessoryLeft={renderBackIcon}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text category='h1'>Terms & Privacy</Text>
      </Layout>
    </SafeAreaView>
  );
};

export default TermsAndPrivacyScreen;
