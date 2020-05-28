import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar } from '@ui-kitten/components';

export const ProfileAvatar = (props) => {
  const { style, ...restProps } = props;

  return (
    <View style={style}>
      <Avatar {...restProps} style={[style, styles.avatar]} />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignSelf: 'center',
  },
});
