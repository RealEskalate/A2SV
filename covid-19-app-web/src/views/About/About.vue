<template>
  <v-content class="about">
    <section class="mb-12 text-justify">
      <v-container>
        <v-row>
          <v-col class="px-md-10" cols="12" md="7">
            <div :key="i" v-for="(description, i) in descriptions">
              <h3 class="display-1 font-weight-thin">
                {{ description.title }}
              </h3>
              <div
                class="my-5 grey--text text--darken-2"
                v-html="description.content"
              ></div>
            </div>
          </v-col>
          <v-col class="px-md-10" cols="12" md="5">
            <div>
              <h3 class="display-1 font-weight-thin">Who we are</h3>
              <div class="my-5 grey--text text--darken-2">
                <p>
                  <strong>A2SV - Africa to Silicon Valley</strong> is a team of
                  highly motivated and talented students from Ethiopia, led by
                  an ex-Google and Palantir Software/ML engineer. The team went
                  through an intense 3-month preparation program in the pursuit
                  of summer internships at top SV companies. Now A2SV dedicates
                  all the time and energy to the war against COVID-19.
                </p>
              </div>
            </div>
            <div class="mx-auto mt-10 py-5">
              <h3 class="display-1 font-weight-thin mb-5">Contact us</h3>
              <v-alert
                v-if="showAlert"
                :type="type"
                v-text="message"
                dismissible
              />
              <v-form class="mt-7">
                <v-text-field
                  class="v-card--shaped"
                  outlined
                  dense
                  label="Name"
                  v-model="contact.name"
                  :rules="rules.nameRules"
                  counter="30"
                />
                <v-text-field
                  class="v-card--shaped"
                  outlined
                  dense
                  label="Email"
                  v-model="contact.email"
                  :rules="rules.emailRules"
                />
                <v-textarea
                  class="v-card--shaped"
                  outlined
                  dense
                  rows="5"
                  label="Message"
                  :rules="rules.messageRules"
                  v-model="contact.message"
                />
                <div class="text-center py-3">
                  <v-btn
                    width="100"
                    class="primary mx-auto v-card--shaped"
                    @click="sendForm"
                  >
                    Send
                    <v-icon class="ml-2" small> {{ mdiSend }}</v-icon>
                  </v-btn>
                </div>
              </v-form>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <br />
    <br />
    <section class="my-12">
      <v-parallax
        :height="$vuetify.breakpoint.mdAndUp ? 350 : 900"
        class="v-card--shaped shadow"
        src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
      >
        <v-row class="text-center white--text d-flex align-center">
          <v-col
            cols="12"
            md="4"
            class="px-12 my-3 my-md-0"
            :key="'actions_' + action_i"
            v-for="(action, action_i) in actions"
          >
            <v-icon class="white--text mb-7" x-large v-text="action.icon" />
            <h1 v-text="action.title" />
            <p class="font-weight-thin my-2" v-text="action.description" />
            <a
              :key="'links_' + link_i"
              v-for="(link, link_i) in action.links"
              :href="link.href"
              class="mx-2 grey--text text--lighten-5"
              target="_blank"
              v-text="link.text"
            />
          </v-col>
        </v-row>
      </v-parallax>
    </section>
    <br />
    <br />
    <section class="my-12">
      <v-container class="text-center">
        <h1 class="display-2 font-weight-thin mb-12">Our Partners</h1>
        <span
          class="d-inline-block my-5 mx-2"
          :key="i"
          v-for="(partner, i) in partners"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <a :href="partner.link" target="_blank" v-on="on">
                <img
                  height="180px"
                  alt="partner.name"
                  style="opacity: 0.7"
                  :src="partner.image_url"
                />
              </a>
            </template>
            <span>{{ partner.name }}</span>
          </v-tooltip>
        </span>
      </v-container>
    </section>
    <br />
    <br />
  </v-content>
</template>

<script>
import axios from "axios";
import {
  mdiCloudDownloadOutline,
  mdiSearchWeb,
  mdiSend,
  mdiYoutube
} from "@mdi/js";

export default {
  data: () => {
    return {
      mdiSend,
      showAlert: false,
      message: "",
      type: "success",
      contact: {
        name: "",
        email: "",
        message: ""
      },
      rules: {
        nameRules: [
          v => !!v || "Name is required",
          v => (v && v.length <= 30) || "Name must be less than 10 characters"
        ],
        emailRules: [
          v => !!v || "E-mail is required",
          v => /.+@.+\..+/.test(v) || "E-mail must be valid"
        ],
        messageRules: [
          v => !!v || "Message is required",
          v =>
            (v && v.length <= 150) || "Message must be less than 150 characters"
        ]
      },
      descriptions: [
        {
          title: "Track Sym",
          content: `<p> <strong> Track Sym </strong> is a non-commercial app that uses crowd-sourcing to collect and visualize the density of the relevant symptoms. Registration only asks about age and gender to be used for data science purposes. Users can anonymously report symptoms and choose a location to see the density of symptoms in a map view. The data is aggregated by places, therefore, the app can help people avoid visiting a grocery store or a gas station that is heavily used by symptomatic people. </p>
                    <p> By filling out simple questionnaires about your health and symptoms every day you can help tackle the spread of the virus and ending the pandemic. Moreover, by looking or searching places you want to go, maybe to run errands or to grab groceries, you can find out how symptomatic the place is and what kinda measure you should take. </p>`
        },
        {
          title: "The Mission",
          content: `<p> When you have coronavirus, you are not just afraid of dying but also about affecting your loved ones. When you go out to the local market or any other place, you fear that you might get infected. Using CoronaApp, users can easily track their movements to keep data and predict which areas are high-risk at the moment. </p>
                    <p> We are striving to have everyone well-aware of the coronavirus and be vigilant towards it, having reliable information that’s analyzed and is ready to comprehend and make use out of. </p>`
        },
        {
          title: "Your Data",
          content: `<p> Your data will be used anonymously for the purpose of data science and statistics being open source meaning any info generated isn’t traced back to a single user. This is a non-commercial project with no intention of profit. </p>`
        }
      ],
      actions: [
        {
          icon: mdiSearchWeb,
          title: "A2SV Website",
          description:
            "Check out the team's website to learn more about our team, our program, our team members and how we started our journey.",
          links: [{ text: "Visit Website", href: "http://a2sv.org/" }]
        },
        {
          icon: mdiCloudDownloadOutline,
          title: "Download The App",
          description:
            "Download our Symptom-tracking app, easily locate areas with a high density of symptoms using real-time data, and keep each other safe.",
          links: [
            { text: "Get on Play Store", href: "#" },
            { text: "Get on App Store", href: "#" }
          ]
        },
        {
          icon: mdiYoutube,
          title: "Watch the Video",
          description:
            "Learn how our app help mitigate the spread of COVID-19 and flatten the curve especially in countries with limited testing capacity.",
          links: [{ text: "Go to Youtube", href: "#" }]
        }
      ],
      partners: [
        {
          name: "Addis Ababa University",
          image_url:
            "https://upload.wikimedia.org/wikipedia/en/thumb/d/dc/Addis_Ababa_University_logo.png/220px-Addis_Ababa_University_logo.png",
          link: "http://www.aau.edu.et/"
        },
        {
          name: "This Organization",
          image_url:
            "https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png",
          link: "#"
        },
        {
          name: "This Other Organization",
          image_url:
            "https://images.theconversation.com/files/93616/original/image-20150902-6700-t2axrz.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1000&fit=clip",
          link: "#"
        }
      ]
    };
  },
  methods: {
    sendForm() {
      axios.post(`${process.env.VUE_APP_BASE_URL}/messages`, this.contact).then(
        resp => {
          this.showAlert = true;
          console.log(resp);
          this.type = "success";
          this.message = "Your feedback is successfully submitted!";
        },
        err => {
          this.showAlert = true;
          console.log(err);
          this.type = "error";
          this.message = "Something went wrong!";
        }
      );
    }
  }
};
</script>
