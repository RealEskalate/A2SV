export const covidData = {
  title: 'WHAT IS COVID-19 ?',
  description: 'CORONAVIRUS DESEASE 2019',
  content:
    'Severe Acute Respiratory Syndrome Coronavirus-2 (SARS-CoV-2) is the ' +
    'name given to the 2019 novel coronavirus. COVID-19 is the name given ' +
    'to the disease associated with the virus. \n\n' +
    'SARS-CoV-2 is a new strain of coronavirus that has not been ' +
    'previously identified in humans. Coronaviruses are viruses that ' +
    'circulate among animals with some of them also known to infect ' +
    'humans.',
  image: require('../assets/covid.jpg'),
  title_2: 'WHAT DO WE KNOW SOFAR ?',
};

export const symptomsData = {
  title: 'SYMPTOMS of COVID-19',
  description: 'COMMON SYMPTOMS OF CORONAVIRUS',
  content:
    'From what is known so far, a person infected with this disease may ' +
    'suffer from dry cough, mild fever, tiredness, and breathing issues ' +
    'which may go unnoticed at first. ',
  content_two:
    'What’s making the virus so difficult to contain is that Just like ' +
    'the common cold or flu and spread from people to people rather ' +
    'quickly.' +
    "\n\nSome people will get COVID-19 but don't show any symptoms. In fact, " +
    '80% of people infected with COVID-19 recover without any special ' +
    'treatment. As people move around the world, COVID-19 has spread in ' +
    'all parts of the world and is continuing to do so.',
  most_list: [
    {
      key: '1',
      name: 'High Fever',
      inside:
        'It is a body temperature above 39 °C (103 °F). This is one of the most common symptoms of COVID-19 patients’ experience. The high fever is an indication of the Immune System fighting the viruses. ',
    },
    {
      key: '2',
      name: 'Dry Cough',
      inside:
        "It is a cough that doesn't bring up mucus. It may feel like you have a tickle in the back of your throat triggering your cough reflex, giving you hacking coughs. Dry coughs are often caused by upper respiratory infections, such as COVID-19. More than 60% of cases have dry cough as a symptom.",
    },
    {
      key: '3',
      name: 'Fatigue',
      inside: 'Lack of enengy and Motivation (physical and mental)',
    },
    {
      key: '4',
      name: 'Shortness of breath',
      inside:
        'Also known medically as dyspnea — is often described as an intense tightening in the chest, air hunger, difficulty breathing, breathlessness, or a feeling of suffocation. Very strenuous exercise, extreme temperatures, obesity, and higher altitude all can cause shortness of breath in a healthy person. Outside of these examples, shortness of breath is likely a sign of a medical problem.',
    },
    {
      key: '5',
      name: 'Myalgia',
      inside:
        'It is pain or aches in muscles characterized by chronic pain, stiffness, and tenderness.  It describes muscle aches and pain, which can involve ligaments, tendons, and fascia, the soft tissues that connect muscles, bones, and organs.',
    },
  ],
  less_list: [
    {
      name: 'Headache',
      inside: 'It can be a sharp, throbbing or dull feeling across the head.',
    },
    {
      name: 'Ansomia',
      inside: 'It is the partial or complete loss of the sense of smell.',
    },
    {
      name: 'Sore Throat',
      inside:
        'It is a painful, dry, or scratchy feeling in the throat that often worsens when swallowing because of redness and swelling formed around the back of the mouth and larynx. This occurs in around 10% of coronavirus cases.',
    },
    {
      name: 'Chills',
      inside:
        'It is the feeling of being cold without an apparent cause. You get this feeling when your muscles repeatedly expand and contract and the vessels in your skin constrict. Chills can occur with a fever and cause shivering or shaking.',
    },
  ],
  image: require('../assets/sym.jpg'),
};

export const preventionData = {
  title: 'Prevention',
  description: 'PREVENTION IS BETTER THAN CURE!',
  image: require('../assets/wash.jpg'),
  methods1: [
    {
      name: 'Washing Hand',
      inside:
        'Make sure you, and the people around you, follow good respiratory hygiene. This means covering your mouth ' +
        'and nose with your bent elbow or tissue when you cough or sneeze. Then dispose of the used tissue immediately.',
    },
    {
      name: 'Social Distancing',
      inside:
        'Maintain at least 2 meters (6 feet) distance between yourself and anyone who is coughing or sneezing.',
    },
  ],
  methods2: [
    {
      name: 'Respiratory hygiene',
      inside:
        'Make sure you, and the people around you, follow good respiratory hygiene. This means covering your mouth ' +
        'and nose with your bent elbow or tissue when you cough or sneeze. Then dispose of the used tissue immediately.',
    },
    {
      name: 'Stay Informed',
      inside:
        'Stay informed on the latest developments about COVID-19. Follow the advice given by your healthcare provider, your national and ' +
        'local public health authority, or your employer on how to protect yourself and others from COVID-19.',
    },
  ],
};

export const spreadData = {
  title: 'How does it spread?',
  description: 'How does coronavirus become contagious ?',
  content:
    'Unlike most deadly viruses who quickly hospitalize their hosts ' +
    'leading to their quarantine, can be highly contagious and ' +
    'spread quickly because the patient may not even show any ' +
    'symptoms for days after infection.',
  content_two:
    'Since most patients do not show symptoms for up to 14 days, they ' +
    'likely pass it to others before they are quarantined ' +
    'and treated. The coronavirus is not only able to spread to ' +
    'others by direct contacts like touching each other’s hands but ' +
    'also through indirect contacts like digital devices like phone, ' +
    'desks, chairs, stairs, and elevator buttons and then touching ' +
    'your face (eyes, nose, or mouth). ',
  image: require('../assets/spread.jpg'),
  date: '19 Sep, 2018',
  author: {
    fullName: 'Weakpeadia',
  },
};

export const messageData = {
  title: 'Message From TrackSym',
  description: 'Stay Home Stay Safe',
  content:
    'We are dealing with a pandemic and we need to be prepared and be ' +
    'willing to accept the advice, instructions, and mandate of authorities and ' +
    'health officials to have it under control soon. ' +
    '\n\nParents should deal with the COVID-19 pandemic calmly and confidently ' +
    'so that their children will be able to follow in the same direction. Parents ' +
    'can be more reassuring to others around them. Since this is a new virus ' +
    'and we do not know enough about how it affects children or pregnant ' +
    'women, people of any age can be infected and transmit the virus. ',
  content_two:
    'Children may be disproportionately affected by measures taken to control ' +
    'the outbreak, such as school closures and physical distancing measures. ' +
    'Special attention needs to be paid to prevent and minimize negative ' +
    'consequences for children as much as possible. ',
  image: require('../assets/home.jpg'),
  date: '19 Sep, 2018',
  author: {
    fullName: 'Weakpeadia',
  },
};
