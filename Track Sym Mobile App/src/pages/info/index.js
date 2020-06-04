import React from 'react';
import { StyleSheet, View, Share } from 'react-native';
import { Button, Card, List, Text, Layout } from '@ui-kitten/components';
import { ImageOverlay } from '../../components/ImageOverlay/image-overlay.component';
import { PlusIcon, ShareIcon } from './extra/icons';
import { strings } from '../../localization/localization';
import { LangContext } from '../../../assets/lang/language-context';

export default InformationScreen = (props) => {
  //setting up the language
  const langContext = React.useContext(LangContext);
  const lang = langContext.lang;
  strings.setLanguage(lang);

  const data = [
    {
      name: strings.WhatIsCOVID19,
      description:
        'Coronavirus disease 2019 is an infectious disease caused by severe acute respiratory syndrome',
      photo: require('./assets/covid.jpg'),
      time: 16,
      sytx: 55,
      link: 'InfoDetailScreen',
    },
    {
      name: strings.Symptoms,
      description:
        'Fever, Cough, and Shortness of breath are common symptoms reported by patients',
      photo: require('./assets/sym.jpg'),
      time: 2,
      sytx: 55,
      link: 'SymDetailScreen',
    },
    {
      name: strings.Prevention,
      description:
        'Follow the guidelines to help protect yourself from catching, carrying, and passing on SARS-CoV-2',
      photo: require('./assets/wash.jpg'),

      time: 16,
      sytx: 55,
      link: 'PrevDetailScreen',
    },
    {
      name: strings.HowDoesItSpreads,
      description:
        'COVID-19 virus primarily transmitted between people through respiratory droplets and contact routes',
      photo: require('./assets/cough.jpg'),
      time: 16,
      sytx: 55,
      link: 'SpdDetailScreen',
    },
    {
      name: strings.MessageFromUs,
      description:
        'There is a lot of information circulating about COVID-19, so it is important to know what is right and what is not.',
      photo: require('./assets/home.jpg'),
      time: 16,
      sytx: 55,
      link: 'MsgDetailScreen',
    },
  ];

  const renderItemHeader = (info) => (
    <ImageOverlay style={styles.itemHeader} source={info.item.photo}>
      <Text style={styles.itemTitle} category='h4' status='control'>
        {info.item.name}
      </Text>
    </ImageOverlay>
  );

  const onShare = async (message) => {
    try {
      const result = await Share.share({
        message,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const renderItemFooter = (message, route) => (
    <View style={styles.itemFooter}>
      <View style={styles.itemReactionsContainer}>
        <Button
          style={styles.iconButton}
          appearance='ghost'
          status='primary'
          onPress={() => onShare(message + '\n\nTrack Sym 2020.')}
          accessoryLeft={ShareIcon}
        />
      </View>
      <Button
        onPress={() => props.navigation.navigate(route)}
        style={styles.itemAddButton}
        appearance='ghost'
        icon={PlusIcon}>
        {strings.ReadMore}
      </Button>
    </View>
  );

  const renderItem = (info) => (
    <Card
      style={styles.item}
      onPress={() => props.navigation.navigate(info.item.link)}
      header={() => renderItemHeader(info)}
      footer={() => renderItemFooter(info.item.description, info.item.link)}>
      <Text style={styles.itemDescription} category='s1'>
        {info.item.description}
      </Text>
    </Card>
  );

  return (
    <List
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={data}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  item: {
    marginVertical: 8,
    borderRadius: 10,
  },
  itemHeader: {
    minHeight: 220,
  },
  itemTitle: {
    position: 'absolute',
    left: 24,
    bottom: 24,
  },
  itemDescription: {
    marginHorizontal: -8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemReactionsContainer: {
    flexDirection: 'row',
  },
  itemAddButton: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 0,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});
