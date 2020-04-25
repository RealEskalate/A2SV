<template>
  <v-content class="about">
    <section class="mb-12 mt-10 text-justify">
      <v-container>
        <h1 class="display-2 font-weight-thin">A2SV</h1>
        <p class="my-5">
          Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum
          Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet sit
          Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum
          Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum Dolor Dolor amet
          sit Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet Lorem ipsum
          Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet sit
          Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum
          Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet sit
          Lorem ipsum Dolor amet sit
        </p>
        <br />
        <h1 class="display-1 font-weight-thin">Symptom Tracker</h1>
        <p class="my-5">
          Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum
          Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet sit
          Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum
          Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum Dolor Dolor amet
          sit Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet Lorem ipsum
          Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet sit
          Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum
          Dolor amet sit Lorem ipsum Dolor amet sit Lorem ipsum Dolor amet sit
          Lorem ipsum Dolor amet sit
        </p>
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
              <h1 class="font-weight-thin display-1" v-text="action.title" />
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
      <v-container ali>
        <v-card class="mx-auto px-5 py-5" width="500px">
          <v-card-title>
            Contact Us
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field label="Name" append-icon="mdi-home" />
              <v-text-field label="Email" append-icon="mdi-mail" />
              <v-textarea label="Message" append-icon="mdi-note" />
            </v-form>
          </v-card-text>
        </v-card>
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
          icon: "mdi-key",
          title: "This example trial",
          description:
            "lorem ipsum dolor amet sitlorem ipsum dolor amet sitlorem ipsum dolor amet sit",
          links: [{ text: "Go for it", href: "#" }]
        }
      ]
    };
  }
};
</script>
