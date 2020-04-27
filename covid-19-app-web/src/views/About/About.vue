<template>
  <v-content class="about">
    <section class="mb-12 mt-10 text-justify">
      <v-container>
        <v-row>
          <v-col class="px-md-10" cols="12" md="7">
            <div :key="i" v-for="(description, i) in descriptions">
              <h3
                class="display-1 font-weight-thin"
                v-text="description.title"
              />
              <div
                class="my-5 grey--text text--darken-2"
                v-html="description.content"
              />
            </div>
          </v-col>
          <v-col class="px-md-10" cols="12" md="5">
            <div>
              <h3 class="display-1 font-weight-thin" v-text="'Who we are'" />
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
              <h3 class="display-1 font-weight-thin" v-text="'Contact Us'" />
              <v-form class="py-5">
                <v-text-field label="Name" />
                <v-text-field label="Email" />
                <v-textarea rows="5" label="Message" />
                <div class="text-center py-3">
                  <v-btn width="100" class="primary mx-auto">
                    Send <v-icon class="ml-2" small>mdi-send</v-icon>
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
        height="400"
        src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
      >
        <v-container>
          <v-row class="py-5 text-center white--text">
            <v-col
              cols="12"
              md="4"
              class="px-12"
              :key="'actions_' + action_i"
              v-for="(action, action_i) in actions"
            >
              <v-icon
                class="white--text mb-7"
                style="font-size: 4em"
                v-text="action.icon"
              />
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
        </v-container>
      </v-parallax>
    </section>
    <br />
    <br />
    <section class="my-12">
      <v-container>
        <h1 class="display-1 font-weight-thin mb-5">Our Partners</h1>
        <v-row class="justify-content-center">
          <v-col lg="2" cols="4" :key="i" v-for="(partner, i) in partners">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <a :href="partner.link" target="_blank" v-on="on">
                  <v-img
                    :aspect-ratio="1"
                    transition="scale-transition"
                    alt="partner.name"
                    :lazy-src="partner.image_url"
                  />
                </a>
              </template>
              <span>{{ partner.name }}</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <br />
    <br />
  </v-content>
</template>

<script>
export default {
  data: () => {
    return {
      actions: [
        {
          icon: "mdi-cloud",
          title: "A2SV Website",
          description:
            "Check out our website for this and that and this as well for this and that and this as well for this and that and this as well",
          links: [{ text: "Visit Website", href: "#" }]
        },
        {
          icon: "mdi-check",
          title: "Download The App",
          description:
            "The App will have this and that and thisThe App will have this and that and thisThe App will have this and that and this and that",
          links: [
            { text: "Get on Play Store", href: "#" },
            { text: "Get on App Store", href: "#" }
          ]
        },
        {
          icon: "mdi-youtube",
          title: "Understand the Goal",
          description: "Learn more about the app and why it exists.",
          links: [{ text: "Go to Youtube", href: "#" }]
        }
      ],
      descriptions: [
        {
          title: "Corona App",
          content: `<p> COVID-19 symptom tracking app is a non-commercial app that uses crowd-sourcing to collect and visualize the density of the relevant symptoms. Registration only asks about age and gender to be used for data science purposes. Users can anonymously report symptoms and choose a location to see the density of symptoms in a map view. The data is aggregated by places, therefore, the app can help people avoid visiting a grocery store or a gas station that is heavily used by symptomatic people. </p>
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
      partners: [
        {
          name: "Addis Ababa University",
          image_url:
            "https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png",
          link: "#"
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
            "https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png",
          link: "#"
        }
      ]
    };
  }
};
</script>
