import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function Welcome() {
    return ( 
        <Text style = {styles.container}>
        Welcome to A2SV 's COVID-19 Mobile App! 
        </Text >
    );
}
const styles = StyleSheet.create({
    container: {
      marginTop: 200,
      marginLeft:50,
      marginRight:50,
      textAlign:"center",
      fontWeight: 'bold',
      fontSize: 30,
    }
  });