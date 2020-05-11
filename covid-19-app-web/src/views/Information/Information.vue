<!--suppress HtmlUnknownTarget -->
<template>
  <v-content class="information">
    <section class="mb-12 text-justify">
      <v-container>
        <v-row>
          <h3
            class="display-1 font-weight-thin mb-10"
            v-text="'Learn About Covid-19'"
          />
          <carousel-3d
            style="min-height: 300px"
            :border="0"
            :perspective="20"
            :inverse-scaling="50"
            :space="350"
            autoplay
            :autoplay-timeout="5000"
            width="400"
          >
            <slide
              :key="i"
              v-for="(item, i) in information"
              :index="i"
              style="height: auto; background-color: transparent"
            >
              <v-card class="mx-auto" outlined shaped>
                <v-img
                  class="white--text align-end"
                  height="200px"
                  :lazy-src="item.image"
                >
                  <v-card-title
                    class="text-truncate mr-3"
                    v-text="item.title"
                  />
                </v-img>

                <v-card-subtitle
                  class="pb-0 text-truncate"
                  v-text="htmlToText(item.description)"
                />

                <v-card-actions>
                  <v-btn
                    text
                    color="primary"
                    @click.stop="
                      () => {
                        dialog = true;
                        selectedInfo = item;
                      }
                    "
                  >
                    Read More
                  </v-btn>
                </v-card-actions>
              </v-card>
            </slide>
          </carousel-3d>
        </v-row>
      </v-container>
      <v-dialog v-model="dialog" width="500">
        <v-card outlined shaped>
          <v-img
            height="150px"
            :lazy-src="selectedInfo.image"
            :src="selectedInfo.image"
          />
          <v-card-title class="headline my-2" v-text="selectedInfo.title" />
          <v-card-text class="text-justify" v-html="selectedInfo.description" />
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="dialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </section>
    <section class="my-12 text-justify">
      <actions class="my-12" />
    </section>
    <section class="my-12 text-justify">
      <states class="my-12" />
    </section>
    <section class="my-12 text-justify">
      <learning-paths class="my-12" />
    </section>
  </v-content>
</template>

<script>
import States from "./States.vue";
import LearningPaths from "./LearningPaths.vue";
import { Carousel3d, Slide } from "vue-carousel-3d";
import Actions from "./Actions";

export default {
  name: "Information",
  components: {
    Actions,
    States,
    LearningPaths,
    Slide,
    "carousel-3d": Carousel3d
  },
  data: function() {
    return {
      selectedInfo: {
        title: null,
        description: null,
        image: null
      },
      dialog: false,
      information: [
        {
          title: "What is Covid-19",
          description:
            "What is SARS-COV-2? What is COVID-19(COrona VIrus Disease 2019)? Severe Acute Respiratory Syndrome Coronavirus-2 (SARS-CoV-2) is the name given to the 2019 novel coronavirus. COVID-19 is the name given to the disease associated with the virus. SARS-CoV-2 is a new strain of coronavirus that has not been previously identified in humans.Coronaviruses are viruses that circulate among animals with some of them also known to infect humans.",
          image: "/img/info/covid.jpg"
        },
        {
          title: "Symptoms",
          description:
            "From what is known so far, a person infected with this disease may suffer from dry cough, mild fever, tiredness, and breathing issues which may go unnoticed at first. What’s making the virus so difficult to contain is that Just like the common cold or flu and spread from people to people rather quickly.  Some people will get COVID-19 but don't show any symptoms. In fact 80% of people infected with COVID-19 recover without any special treatment. As people move around the world, COVID-19 has spread in all parts of the world and is continuing to do so.",
          image: "/img/info/symptom.jpg"
        },
        {
          title: "Common misconception?",
          description: `<p>Common misconception regarding COVID-19 is that corona viruses affect only old people. This is far from true and is killing many people from various age groups. It is true that the risk of dying due to COVID-19 is significantly higher for 80+ age groups(as high as 14.8%) while it’s below 1% for age groups below 40. But this does not mean that teenagers won’t be affected or die of this disease either because the virus is winning over the immune system or due to the fact that a large number of people are being infected and admitted to the hospital causing a toll on health care systems resulting in some patients not getting treated as effectively as they should be.  </p>
            <p>Which is why you should be careful not to get the disease and stay safe. Even if you are not heavily sick, there is a very huge chance that you might be affected and continue to pass it to others before the symptoms arise if you go to crowded areas or don’t keep social distancing. </p>
            Read more about the <a href="https://www.worldometers.info/coronavirus/coronavirus-age-sex-demographics" target="_blank">age-sex demographics</a>
            `,
          image: "/img/info/misconception.jpg"
        },
        {
          title: "Brief History on its origin",
          description: `<p>The novel corona virus detected in China in 2019 is closely related genetically to the SARS-CoV-1 virus. SARS emerged at the end of 2002 in China, and it caused more than 8 000 cases in 33 countries over a period of eight months. Around one in ten of the people who developed SARS died. </p>
            <a href= "https://www.cdc.gov/flu/pandemic-resources/basics/past-pandemics.html" target="_black">Previous Pandemics<a>`,
          image: "/img/info/history.jpg"
        },
        {
          title: "Where does it come from?",
          description:
            "Bats are considered natural hosts of these viruses yet several other species of animals are also known to act as sources. For instance, Middle East Respiratory Syndrome Coronavirus (MERS-CoV) is transmitted to humans from camels, and Severe Acute Respiratory Syndrome Coronavirus-1 (SARS-CoV-1) is transmitted to humans from civet cats. As of 30 March 2020, the COVID-19 outbreak had caused over 700 000 cases worldwide since the first case was reported in China in January 2020. Of these, more than 30 000 are known to have died. ",
          image: "/img/info/origin.jpg"
        },
        {
          title: "How it spreads?",
          description: `<p> Unlike most deadly viruses who quickly hospitalize their hosts leading to their quarantine, corona virus is able to be highly contagious and spread quickly because the patient may not even show any symptoms for days after infection.</p>
            <p>Since most patients don’t show symptoms for up to 14 days, it’s likely that they pass it to others before they are quarantined and treated.The corona virus is not only able to spread to others by direct contacts like touching each other’s hands but also through indirect contacts like digital devices like phones,  desks, chairs, stairs, and elevator buttons and then touching your face (eyes, nose, or mouth). </p>
            <p>Read more about <a href = "https://www.who.int/news-room/q-a-detail/q-a-coronaviruses" target="_blank">Covid-19 and Surfaces</a></p>`,
          image: "/img/info/spread.jpg"
        },
        {
          title: "Major concern",
          description:
            "The major concern about COVID-19 is that, unlike influenza, there is no vaccine and no specific treatment for the disease. It also appears to be more transmissible than seasonal influenza. As it is a new virus, nobody has prior immunity, which means that the entire human population is potentially susceptible to SARS-CoV-2 infection. To make matters more pressing, not many preparations have been made on testing among other things during the outbreak of a pandemic.",
          image: "/img/info/concern.jpg"
        },
        {
          title: "Prevention methods",
          description: `<p><ul>
              <li>Wash your hands frequently </li>
              <li>Maintain social distancing</li>
              <li>Avoid touching eyes, nose and mouth</li>
              <li>Practice respiratory hygiene</li>
              <li> Stay informed and follow the advice given by your health care provider</li>
              <li> If you have fever, cough and difficulty breathing, seek medical care early</li>
             </ul></p>`,
          image: "/img/info/prevention.jpg"
        },

        {
          title: "What is Covid-19?",
          description:
            "What is SARS-COV-2? What is COVID-19 (COrona VIrus Disease 2019)?Severe Acute Respiratory Syndrome Coronavirus-2 (SARS-CoV-2) is the name given to the 2019 novel coronavirus. COVID-19 is the name given to the disease associated with the virus. SARS-CoV-2 is a new strain of coronavirus that has not been previously identified in humans. Coronaviruses are viruses that circulate among animals with some of them also known to infect humans.",
          image: "/img/info/covid.jpg"
        },
        {
          title: "Symptoms",
          description:
            "From what is known so far, a person infected with this disease may suffer from dry cough, mild fever, tiredness, and breathing issues which may go unnoticed at first. What’s making the virus so difficult to contain is that Just like the common cold or flu and spread from people to people rather quickly.  Some people will get COVID-19 but don't show any symptoms. In fact 80% of people infected with COVID-19 recover without any special treatment. As people move around the world, COVID-19 has spread in all parts of the world and is continuing to do so.",
          image: "/img/info/symptom.jpg"
        },
        {
          title: "Common misconception?",
          description:
            "Common misconception regarding COVID-19 is that coronaviruses affect only old people. This is far from true and is killing many people from various age groups. \nIt is true that the risk of dying due to COVID-19 is significantly higher for 80+ age groups(as high as 14.8%) while it’s below 1% for age groups below 40. But this doesn’t mean that teenagers won’t be affected or die of this disease either because the virus is winning over the immune system or due to the fact that a large number of people are being infected and admitted to the hospital causing a toll on health care systems resulting in some patients not getting treated as effectively as they should be. \nWhich is why you should be careful not to get the disease and stay safe. Even if you are not heavily sick, there is a very huge chance that you might be affected and continue to pass it to others before the symptoms arise if you go to crowded areas or don’t keep social distancing.",
          image: "/img/info/misconception.jpg"
        },
        {
          title: "Origin story",
          description:
            "The novel coronavirus detected in China in 2019 is closely related genetically to the SARS-CoV-1 virus. SARS emerged at the end of 2002 in China, and it caused more than 8 000 cases in 33 countries over a period of eight months. Around one in ten of the people who developed SARS died.",
          image: "/img/info/history.jpg"
        },
        {
          title: "Where did it come from?",
          description:
            "Bats are considered natural hosts of these viruses yet several other species of animals are also known to act as sources. For instance, Middle East Respiratory Syndrome Coronavirus (MERS-CoV) is transmitted to humans from camels, and Severe Acute Respiratory Syndrome Coronavirus-1 (SARS-CoV-1) is transmitted to humans from civet cats. \nAs of 30 March 2020, the COVID-19 outbreak had caused over 700 000 cases worldwide since the first case was reported in China in January 2020. Of these, more than 30 000 are known to have died. ",
          image: "/img/info/origin.jpg"
        },
        {
          title: "How does it spread?",
          description:
            "Unlike most deadly viruses who quickly hospitalize their hosts leading to their quarantine, coronavirus is able to be highly contagious and spread quickly because the patient may not even show any symptoms for days after infection. \nSince most patients don’t show symptoms for up to 14 days, it’s likely that they pass it to others before they are quarantined and treated. The coronavirus is not only able to spread to others by direct contacts like touching each other’s hands but also through indirect contacts like digital devices like phones,  desks, chairs, stairs, and elevator buttons and then touching your face (eyes, nose, or mouth).",
          image: "/img/info/spread.jpg"
        },
        {
          title: "The major concern",
          description:
            "The major concern about COVID-19 is that, unlike influenza, there is no vaccine and no specific treatment for the disease. It also appears to be more transmissible than seasonal influenza. As it is a new virus, nobody has prior immunity, which means that the entire human population is potentially susceptible to SARS-CoV-2 infection. To make matters more pressing, not many preparations have been made on testing among other things during the outbreak of a pandemic.",
          image: "/img/info/concern.jpg"
        },
        {
          title: "Prevention methods",
          description:
            "Wash your hands frequently \nMaintain social distancing \nAvoid touching eyes, nose and mouth \nPractice respiratory hygiene \nStay informed and follow the advice given by your healthcare provider \nIf you have fever, cough and difficulty breathing, seek medical care early",
          image: "/img/info/prevention.jpg"
        }
      ]
    };
  }
};
</script>
