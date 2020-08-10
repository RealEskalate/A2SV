import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import { Image, Dimensions } from 'react-native';

export default class UserOption extends React.Component {
  _changeScreen = (userOption) => {
    if (userOption === 'Sign up') {
      this.props.navigation.navigate('SignUpScreen');
    } else {
      this.props.navigation.navigate('LoginScreen');
    }
  };

  render() {
    return (
      <Layout style={styles.container}>
        <Layout
          level='3'
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../../assets/images/app_icon.png')}
            style={{
              width: 100,
              height: 90,
            }}
          />
        </Layout>
        <Text
          category='h3'
          status='primary'
          style={{ fontWeight: 'bold', marginBottom: 20 }}>
          Track Sym
        </Text>
        <Button
          size='large'
          style={{
            backgroundColor: '#4da6ff',
            margin: 10,
            width: Dimensions.get('window').width - 30,
          }}
          onPress={() => this._changeScreen('Sign up')}>
          <Text style={{ fontWeight: 'bold' }}>CREATE ACCOUNT</Text>
        </Button>

        <Button
          appearance='outline'
          style={{ width: Dimensions.get('window').width - 30 }}
          onPress={() => this._changeScreen('Sign in')}>
          <Text style={{ color: '#4da6ff',fontWeight: 'bold' }}>SIGN IN</Text>
        </Button>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
