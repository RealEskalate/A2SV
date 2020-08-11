import React from 'react';
import { SafeAreaView, Linking } from 'react-native';
import {
  Layout,
  TopNavigationAction,
  TopNavigation,
  Divider,
  Icon,
  List,
  ListItem,
} from '@ui-kitten/components';
import { LangContext } from '../../../assets/lang/language-context';
import { strings } from '../../localization/localization';

const ArrowIosBackIcon = (style) => <Icon {...style} name='arrow-ios-back' />;
const CallIcon = (style) => <Icon {...style} name='phone-call-outline' />;

export const HotlineScreen = (props) => {
  const langContext = React.useContext(LangContext);
  const [] = React.useState(false);
  const lang = langContext.lang;
  strings.setLanguage(lang);

  const renderBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  const data = [
    {
      id: 0,
      name: '8335',
      description: 'Addis Ababa',
      link: 'tel:8335',
    },
    {
      id: 1,
      name: '6220',
      description: 'Afar',
      link: 'tel:+123456789',
    },
    {
      id: 2,
      name: '6981',
      description: 'Amhara',
      link: 'tel:+123456789',
    },
    {
      id: 3,
      name: '6016',
      description: 'Benishangul Gumuz',
      link: 'tel:+123456789',
    },
    {
      id: 4,
      name: '6407',
      description: 'Dire Dawa',
      link: 'tel:+123456789',
    },
    {
      id: 5,
      name: '1212',
      description: 'Gambela',
      link: 'tel:+123456789',
    },
    {
      id: 6,
      name: '1212',
      description: 'Harari',
      link: 'tel:+123456789',
    },
    {
      id: 7,
      name: '1212',
      description: 'Oromia',
      link: 'tel:+123456789',
    },
    {
      id: 8,
      name: '1212',
      description: 'Tigrai',
      link: 'tel:+123456789',
    },
    {
      id: 9,
      name: '1212',
      description: 'Sidama',
      link: 'tel:+123456789',
    },
    {
      id: 10,
      name: '6929',
      description: 'SNNPR',
      link: 'tel:+123456789',
    },
    {
      id: 11,
      name: '1212',
      description: 'Somali',
      link: 'tel:+123456789',
    },
  ];

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          alignment='center'
          title='Hotlines'
          accessoryLeft={renderBackAction}
        />
        <Divider />
        <Layout style={{ flex: 1 }}>
          <List
            data={data}
            renderItem={({ item }) => (
              <>
                <ListItem
                  title={item.name}
                  description={item.description}
                  accessoryLeft={CallIcon}
                  onPress={() => Linking.openURL(item.link)}
                />
                <Divider />
              </>
            )}
          />
        </Layout>
      </SafeAreaView>
    </>
  );
};
