import React from 'react';
import { Image, Dimensions, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Layout,
  Text,
  StyleService,
  useStyleSheet,
  Button,
  Icon,
} from '@ui-kitten/components';
import { Divider } from 'react-native-paper';

const About = (props) => {
  const styles = useStyleSheet(themedStyle);
  const infiniteAnimationIconRef = React.useRef();

  React.useEffect(() => {
    infiniteAnimationIconRef.current.startAnimation();
  }, []);

  const renderInfiniteAnimationIcon = (props) => (
    <Icon
      {...props}
      ref={infiniteAnimationIconRef}
      animationConfig={{ cycles: Infinity }}
      animation='pulse'
      name='globe-outline'
    />
  );

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <Layout level='2' style={{ height: 220 }}>
        <Image
          source={require('../../../assets/images/track.png')}
          style={{ height: 220, width: Dimensions.get('screen').width }}
          resizeMode='cover'
        />
      </Layout>
      <Layout>
        <Layout style={styles.title_container}>
          <Text category='h5'>TRACK SYM</Text>
        </Layout>
        <Divider />
        <Text style={styles.text}>
          It is a non-commercial COVID-19 symptom tracking app that uses
          crowd-sourcing to collect and visualize the density of the relevant
          symptoms. Users can anonymously report their symptoms and choose a
          location to see the density of symptoms in a map view. {'\n\n'} It
          represents publicly avaible data with a short description on how to
          see the trend going on . The dat includes the number of confirmed
          cases, deaths, recovered, and tests conducted of any selected country
          or globally. It is also a great place to look for global and local
          news about Covid-19.{'\n'}
        </Text>
      </Layout>
      <Layout level='2' style={{ height: 230 }}>
        <Image
          source={require('../../../assets/images/team.png')}
          style={{ height: 230, width: Dimensions.get('screen').width }}
          resizeMode='cover'
        />
      </Layout>
      <Layout>
        <Layout style={styles.title_container}>
          <Text category='h5'>WHO ARE WE ?</Text>
        </Layout>
        <Divider />
        <Text style={styles.text}>
          <Text style={{ fontWeight: 'bold' }}>A2SV </Text>- Africa to Silicon
          Valley is a team of highly motivated and talented students from
          Ethiopia, led by an ex-Google and Palantir Software/ML engineer.
          {'\n\n'}
          The team went through an intense 3-month preparation program in the
          pursuit of summer internships at top Silicon Valley companies. Now
          A2SV is dedicating all the time and energy to the fight against
          COVID-19. COVID-19 is taking the world by storm. Even though some
          countries are scaling up their testing capacities, it has been a
          challenge for developed countries and is much harder for many
          developing countries.{' '}
          <Text style={{ fontWeight: 'bold' }}>
            A2SV puts humanity first and is giving a non-commercial symptom
            tracker app.{'\n'}
          </Text>
        </Text>
      </Layout>
      <Layout level='2' style={{ height: 220 }}>
        <Image
          source={require('../../../assets/images/file.png')}
          style={{ height: 230, width: Dimensions.get('screen').width }}
          resizeMode='cover'
        />
      </Layout>
      <Layout>
        <Layout style={styles.title_container}>
          <Text category='h5'>YOUR DATA</Text>
        </Layout>
        <Divider />
        <Text style={styles.text}>
          Your data will be used anonymously for the purpose of data science and
          statistics, meaning any info generated isn’t traced back to a single
          user. This is a non-commercial project with no intention of profit.
        </Text>
      </Layout>
      <Layout style={{ flex: 1 }}>
        <Layout style={styles.bottom}>
          <Button
            onPress={() => Linking.openURL('http://www.a2sv.org')}
            accessoryLeft={renderInfiniteAnimationIcon}>
            CHECK OUT OUR WEBSITE
          </Button>
        </Layout>
      </Layout>
    </ScrollView>
  );
};

export default About;

const themedStyle = StyleService.create({
  title_container: { margin: 5, alignItems: 'center' },
  text: {
    padding: 10,
  },
  bottom: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
