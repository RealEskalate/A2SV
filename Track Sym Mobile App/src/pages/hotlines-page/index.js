import React from 'react';
import { SafeAreaView, Linking, StyleSheet } from 'react-native';
import {
  Layout,
  TopNavigationAction,
  TopNavigation,
  Divider,
  Icon,
  List,
  ListItem,
  Card,
  Text,
  Button
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
      link: 'tel:6220',
    },
    {
      id: 2,
      name: '6981',
      description: 'Amhara',
      link: 'tel:6981',
    },
    {
      id: 3,
      name: '6016',
      description: 'Benishangul Gumuz',
      link: 'tel:6016',
    },
    {
      id: 4,
      name: '6407',
      description: 'Dire Dawa',
      link: 'tel:6407',
    },
  ];

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          alignment='center'
          title={strings.Hotlines}
          accessoryLeft={renderBackAction}
        />
        <Divider />
        <Layout style={{ flex: 1 }}>
          <List
            data={data}
            renderItem={({ item }) => (
              <>
                <Card 
                style={styles.card}
                onPress={() => Linking.openURL(item.link)}
                >
                  <Layout
                    style={{
                      flexDirection: "row"
                    }}
                  >
                    <Button
                      style={styles.button}
                      size="giant"
                      appearance="ghost"
                      status="primary"
                      accessoryLeft={CallIcon}
                      onPress={() => Linking.openURL(item.link)}
                    >
                      {item.name}
                    </Button>
                    <Layout style={styles.description_container}>
                      <Text appearance='hint'
                        style={styles.description}
                      >{item.description}</Text>
                    </Layout>
                  </Layout>
                </Card>
              </>
            )}
          />
        </Layout>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    borderWidth: 1,
  },
  button: { 
    marginLeft: -10,
    paddingHorizontal: 0 
  },
  description: { 
    marginLeft: 10 
  },
  description_container : { 
    alignSelf: "center", 
    borderLeftWidth: 1 
  },
});
