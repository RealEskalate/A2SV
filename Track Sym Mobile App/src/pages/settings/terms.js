import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  Linking,
} from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  Icon,
  Divider,
  Layout,
  Text,
  Button,
} from '@ui-kitten/components';

import Octicons from 'react-native-vector-icons/Octicons';

const data = [
  {
    title: 'Privacy Policy',
    detail:
      'A2SV built the [Track Sym] app as a Free app. This SERVICE is provided by A2SV at no cost and is intended for use as is. ' +
      ' This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service. ' +
      ' If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. we will not use or share your information with anyone except as described in this Privacy Policy.' +
      ' The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at [Track Sym] unless otherwise defined in this Privacy Policy ',
  },
  {
    title: 'Information Collection and Use',
    detail:
      'For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to age and gender. The information that we request will be retained by us and used as described in this privacy policy. \n The app does use third-party services that may collect information used to identify you. Link to the privacy policy of third party service providers used by the app',
  },
  {
    title: 'Service Providers',
    detail:
      'We may employ third-party companies and individuals due to the following reasons:',
    bullets: [
      'To facilitate our Service.',
      'To provide the Service on our behalf.',
      'To perform Service-related services.',
      'To assist us in analyzing how our Service is used.',
    ],
    detailAfter:
      'We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.',
  },
  {
    title: 'Log Data',
    detail:
      'We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.',
  },
  {
    title: 'Security',
    detail:
      'We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.',
  },
  {
    title: 'Links to Other Sites',
    detail:
      'This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. we have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.',
  },
  {
    title: 'Children’s Privacy',
    detail:
      'These Services do not address anyone under the age of 13. we do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do the necessary actions.',
  },
  {
    title: 'Changes to This Privacy Policy',
    detail:
      'We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. we will notify you of any changes by posting the new Privacy Policy on this page. This policy is effective as of 2020-05-25.',
  },
  {
    title: 'Terms & Conditions',
    detail:
      'By downloading or using the app, these terms will automatically apply to you – you should make sure therefore that you read them carefully before using the app. You’re not allowed to copy or modify the app, any part of the app, or our trademarks in any way. You’re not allowed to attempt to extract the source code of the app, and you also shouldn’t try to translate the app into other languages or make derivative versions. The app itself, and all the trademarks, copyright, database rights and other intellectual property rights related to it, still belong to A2SV.\n\n' +
      'A2SV is committed to ensuring that the app is as useful and efficient as possible. For that reason, we reserve the right to make changes to the app or to charge for its services, at any time and for any reason. We will never charge you for the app or its services without making it very clear to you exactly what you’re paying for.\n\n' +
      'The [Track Sym] app stores and processes personal data that you have provided to us, in order to provide our Service. It’s your responsibility to keep your phone and access to the app secure. We, therefore, recommend that you do not jailbreak or root your phone, which is the process of removing software restrictions and limitations imposed by the official operating system of your device. It could make your phone vulnerable to malware/viruses/malicious programs, compromise your phone’s security features and it could mean that the [Track Sym] app won’t work properly or at all.\n\n' +
      'The app does use third party services that declare their own Terms and Conditions. Link to Terms and Conditions of third party service providers used by the app\n\n' +
      'You should be aware that there are certain things that A2SV will not take responsibility for. Certain functions of the app will require the app to have an active internet connection. The connection can be Wi-Fi or provided by your mobile network provider, but A2SV cannot take responsibility for the app not working at full functionality if you don’t have access to Wi-Fi, and you don’t have any of your data allowance left.\n' +
      'If you’re using the app outside of an area with Wi-Fi, you should remember that your terms of the agreement with your mobile network provider will still apply. As a result, you may be charged by your mobile provider for the cost of data for the duration of the connection while accessing the app, or other third party charges. In using the app, you’re accepting responsibility for any such charges, including roaming data charges if you use the app outside of your home territory (i.e. region or country) without turning off data roaming. If you are not the bill payer for the device on which you’re using the app, please be aware that we assume that you have received permission from the bill payer for using the app.\n\n' +
      'Along the same lines, A2SV cannot always take responsibility for the way you use the app i.e. You need to make sure that your device stays charged – if it runs out of battery and you can’t turn it on to avail the Service, A2SV cannot accept responsibility.\n' +
      'With respect to A2SV’s responsibility for your use of the app, when you’re using the app, it’s important to bear in mind that although we endeavor to ensure that it is updated and correct at all times, we do rely on third parties to provide information to us so that we can make it available to you. A2SV accepts no liability for any loss, direct or indirect, you experience as a result of relying wholly on this functionality of the app.\n' +
      'At some point, we may wish to update the app. The app is currently available on Android & iOS – the requirements for both systems(and for any additional systems we decide to extend the availability of the app to) may change, and you’ll need to download the updates if you want to keep using the app. A2SV does not promise that it will always update the app so that it is relevant to you and/or works with the Android & iOS version that you have installed on your device. However, you promise to always accept updates to the application when offered to you, We may also wish to stop providing the app, and may terminate use of it at any time without giving notice of termination to you. Unless we tell you otherwise, upon any termination, (a) the rights and licenses granted to you in these terms will end; (b) you must stop using the app, and (if needed) delete it from your device.',
  },
  {
    title: 'Changes to This Terms and Conditions',
    detail:
      'We may update our Terms and Conditions from time to time. Thus, you are advised to review this page periodically for any changes. we will notify you of any changes by posting the new Terms and Conditions on this page. \n\nThese terms and conditions are effective as of 2020-05-25',
  },
];

const TermsAndPrivacyScreen = (props) => {
  const ArrowIosBackIcon = (style) => <Icon {...style} name='arrow-ios-back' />;
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

  const renderBackIcon = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={() => props.navigation.goBack()}
    />
  );

  const getBullets = (
    <Octicons
      style={{ marginRight: 5 }}
      name='primitive-dot'
      size={10}
      color='#3c3c3c'
    />
  );

  const renderDetail = (list) => {
    return (
      <Layout style={{ paddingBottom: 10 }}>
        {list.map((item) => (
          <Layout key={item.key}>
            <Divider />
            <View style={styles.authoringContainer}>
              <Text style={styles.dateLabel} appearance='hint' category='p2'>
                {item.title}
              </Text>
            </View>
            <Divider />
            <Layout style={styles.content_Container}>
              <Text>{item.detail}</Text>
              {item.bullets ? (
                item.bullets.map((bullet) => (
                  <Layout
                    style={{
                      paddingLeft: 30,
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {getBullets}
                    <Text>{bullet}</Text>
                  </Layout>
                ))
              ) : (
                <></>
              )}
              <Text style={{ marginTop: 3 }}>{item.detailAfter}</Text>
            </Layout>
          </Layout>
        ))}
      </Layout>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title='TERMS AND PRIVACY'
        alignment='center'
        accessoryLeft={renderBackIcon}
      />
      <Divider />
      <ScrollView>
        {renderDetail(data)}
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
    </SafeAreaView>
  );
};

export default TermsAndPrivacyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottom: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  headerContainer: {
    alignItems: 'center',
    minHeight: 256,
    paddingVertical: 24,
  },
  headerTitle: {
    textAlign: 'center',
    marginVertical: 24,
    zIndex: 1,
  },
  headerTitle: {
    marginHorizontal: 16,
    // fontSize: 18,
  },
  horizontalItem: {
    width: 256,
    marginHorizontal: 8,
  },
  horizontalList: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  headerDescription: {
    zIndex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  content_Container: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  authoringInfoContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  dateLabel: {
    marginHorizontal: 8,
    fontSize: 18,
  },
  authoringContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
  radio: {
    margin: 2,
  },
});
