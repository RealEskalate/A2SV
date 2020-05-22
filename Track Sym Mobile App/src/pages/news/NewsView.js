import React from 'react';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native';
import {TopNavigation, TopNavigationAction, Icon} from '@ui-kitten/components';
import {Divider} from 'react-native-paper';

const ArrowIosBackIcon = (style) => <Icon {...style} name="arrow-ios-back" />;

const NewsView = (props) => {
  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title="News Detail"
        alignment="center"
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <WebView
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        source={{uri: props.route.params.uri}}
      />
    </SafeAreaView>
  );
};

export default NewsView;
