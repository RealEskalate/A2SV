import * as React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';

export default function Preventions() {
  return (
    <ScrollView>
      <Card
        // title='Preventions'
        image={require('./icons/handWash.gif')}
        containerStyle={{ margin: 0 }}>
        <ScrollView>
          <Text style={{ marginBottom: 10 }}>
            Tips for prevention Follow the guidelines to help protect yourself
            from catching, carrying and passing on SARS-CoV-2. 1. Wash your
            hands frequently and carefully Use warm water and soap and rub your
            hands for at least 20 seconds. Work the lather to your wrists,
            between your fingers, and under your fingernails. You can also use
            an antibacterial and antiviral soap. Use hand sanitizer when you
            cannot wash your hands properly. Rewash your hands several times a
            day, especially after touching anything including your phone or
            laptop. 2. Avoid touching your face SARS-CoV-2 can live on hard
            surfaces for up to 72 hours. You can get the virus on your hands if
            you touch a surface like a doorknob, gas pump handle, or your cell
            phone. Avoid touching any part of your face or head including your
            mouth, nose, and eyes. Also avoid biting your fingernails. This can
            give SARS-CoV-2 a chance to go from your hands into your body. 3.
            Stop shaking hands and hugging people — for now Similarly, avoid
            touching other people. Skin to skin contact can pass SARS-CoV-2 from
            one person to another. 4. Don’t share personal items Do not share
            personal items like phones, makeup, or combs. It’s also important
            not to share eating utensils and straws. Teach children to recognize
            their reusable cup, straw, and other dishes for their own use only.
            5. Cover your mouth and nose when you cough and sneeze SARS-CoV-2 is
            found in high amounts in the nose and mouth. This means it can be
            carried by air droplets to other people when you cough or sneeze. It
            can also land on hard surfaces and stay there for up to 3 days. Use
            a tissue or sneeze into your elbow to keep your hands as clean as
            possible. Wash your hands carefully after you sneeze or cough,
            regardless. 6. Clean and disinfect surfaces Use alcohol-based
            disinfectants to clean hard surfaces in your home like countertops,
            door handles, furniture, and toys. Also clean your phone, laptop,
            and anything else you use regularly several times a day. Disinfect
            areas after you bring groceries or packages into your home. Use
            white vinegar or hydrogen peroxide solutions for general cleaning in
            between disinfecting surfaces. 7. Take social distancing seriously
            If you are carrying the SARS-CoV-2 virus, it will be found in high
            amounts in your spit (sputum). This can happen even if you do not
            have symptoms. Social distancing means staying home and working
            remotely when possible. If you must go out for necessities, keep a
            distance of 6 feet from other people. You can transmit the virus by
            speaking to someone in close contact to you. 8. Do not gather in
            groups Being in a group or gathering makes it more likely that you
            will be in close contact with someone. This includes avoiding all
            religious places of worship, as you may have to sit or stand too
            close to another congregant. It also includes congregating at parks
            or beaches. 9. Avoid eating or drinking in public places Now is not
            the time to go out to eat. This means avoiding restaurants, coffee
            shops, bars, and other eateries. The virus can be transmitted
            through food, utensils, dishes, and cups. It may also be airborne
            from other people in the venue. You can still get delivery or
            takeaway food. Choose foods that are thoroughly cooked and can be
            reheated. High heat (at least 132°F/56°C, according to one recent,
            not-yet-peer-reviewed lab study) helps to kill coronaviruses. This
            means it may be best to avoid cold foods from restaurants and all
            food from buffets and open salad bars. 10. Wash fresh groceries Soak
            all raw, whole fruits and vegetables in a solution of food-grade
            hydrogen peroxide or white vinegar. Let dry before putting them away
            in your fridge and cupboards. You can also use vegetable
            antibacterial wash to clean produce. Wash your hands before and
            after handling fresh produce. 11. Wear a (homemade) mask The Centers
            for Disease Control and Prevention (CDC) recommendsTrusted Source
            that almost everyone wear a cloth face mask in public settings where
            social distancing may be difficult, such as grocery stores. When
            used correctly, these masks can help prevent people who are
            asymptomatic or undiagnosed from transmitting SARS-CoV-2 when they
            breathe, talk, sneeze, or cough. This, in turn, slows the spread of
            the virus. The CDC’s website provides instructionsTrusted Source for
            making your own mask at home, using basic materials such as a
            T-shirt and scissors. Some pointers to keep in mind: Wearing a mask
            alone will not prevent you from getting a SARS-CoV-2 infection.
            Careful handwashing and social (physical) distancing must also be
            followed. Cloth masks aren’t as effective as other types of masks,
            such as surgical masks or N95 respirators. However, these other
            masks should be reserved for healthcare workers. Wash your hands
            before you put on your mask. Wash your mask after each use. You can
            transfer the virus from your hands to the mask. If you’re wearing a
            mask, avoid touching the front of it. You can also transfer the
            virus from the mask to your hands. Wash your hands if you touch the
            front of the mask. A mask shouldn’t be worn by a child under 2 years
            old, a person who has trouble breathing, or a person who can’t
            remove the mask on their own. 12. Self-quarantine if sick Call your
            doctor if you have any symptoms. Stay home until you recover. Avoid
            sitting, sleeping, or eating with your loved ones even if you live
            in the same home. Wear a mask and wash your hands as much as
            possible. If you need urgent medical care, wear a mask and let them
            know you may have COVID-19.
          </Text>
        </ScrollView>
      </Card>
    </ScrollView>
  );
}
