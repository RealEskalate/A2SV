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
const GlobeIcon = (style) => <Icon {...style} name='globe-2-outline' />;

export const ReferenceScreen = (props) => {
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
      name: 'Ministry of Health, Ethiopia',
      link: 'http://www.moh.gov.et/ejcc/am/COVID19',
    },
    {
      id: 1,
      name: 'Coronavirus at a Glance, Hopkins medicine',
      link:
        'https://www.hopkinsmedicine.org/health/conditions-and-diseases/coronavirus/coronavirus-facts-infographic',
    },
    {
      id: 2,
      name: 'World Health Organization',
      link: 'https://www.who.int/health-topics/coronavirus#tab=tab_1',
    },
    {
      id: 3,
      name: 'ECDC',
      link: 'https://www.ecdc.europa.eu/en/covid-19/questions-answers',
    },
    {
      id: 4,
      name: 'MedicalXpress',
      link: 'https://medicalxpress.com/news/2020-04-coronaviruses-history.html',
    },
    {
      id: 5,
      name: 'A brief history of coronaviruses',
      link:
        'https://www.independent.co.uk/news/coronavirus-history-what-is-sars-mers-covid-19-a9493911.html',
    },
    {
      id: 6,
      name: 'CDC',
      link:
        'https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/symptoms.html',
    },
  ];

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          alignment='center'
          title='References'
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
                  accessoryLeft={GlobeIcon}
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
