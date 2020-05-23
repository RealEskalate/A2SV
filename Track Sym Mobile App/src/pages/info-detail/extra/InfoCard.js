import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, Card, Text} from '@ui-kitten/components';
import {ImageOverlay} from '../../../components/ImageOverlay/image-overlay.component';
import {ClockIcon} from './icons';

export const InfoCard = (props) => {
  const {style, data, ...cardProps} = props;

  return (
    <Card {...cardProps} style={[styles.container, style]}>
      <ImageOverlay style={styles.image} source={data.image}>
        <Text style={styles.level} category="s1" status="control">
          {data.label}
        </Text>
        <Text style={styles.title} category="h2" status="control">
          {data.title}
        </Text>
        <Button style={styles.durationButton} size="tiny" icon={ClockIcon}>
          {data.tag}
        </Button>
      </ImageOverlay>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    height: 200,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  level: {
    zIndex: 1,
  },
  title: {
    zIndex: 1,
  },
  durationButton: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    borderRadius: 16,
    paddingHorizontal: 0,
  },
});
