import React from 'react';
import {ImageStyle} from 'react-native';
import {Icon, IconElement} from '@ui-kitten/components';

export const BackIcon = (style) => (
  <Icon {...style} name="arrow-ios-back-outline" />
);
export const FacebookIcon = (style) => <Icon {...style} name="facebook" />;
export const GoogleIcon = (style) => <Icon {...style} name="google" />;
export const HeartIconFill = (style) => <Icon {...style} name="heart" />;
export const TwitterIcon = (style) => <Icon {...style} name="twitter" />;
