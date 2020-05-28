<template>
  <v-content class="about">
    <section class="mb-12 text-justify">
      <v-container>
        <v-row>
          <v-fade-transition hide-on-leave>
            <v-col
              class="px-md-10"
              cols="12"
              md="7"
              v-if="loaders.descriptions"
            >
              <div :key="i" v-for="i in 4">
                <v-skeleton-loader
                  ref="skeleton"
                  type="article"
                  class="mx-auto mb-2"
                />
              </div>
            </v-col>
            <v-col v-else class="px-md-10" cols="12" md="7">
              <div :key="i" v-for="(description, i) in descriptions">
                <h3
                  class="display-1 font-weight-thin"
                  v-text="description.title"
                />
                <div
                  class="my-5 grey--text text--darken-2"
                  v-html="description.description"
                />
              </div>
            </v-col>
          </v-fade-transition>

          <v-col class="px-md-10" cols="12" md="5">
            <v-fade-transition hide-on-leave>
              <div v-if="loaders.descriptions">
                <v-skeleton-loader
                  ref="skeleton"
                  type="article"
                  class="mx-auto mb-2"
                />
              </div>
              <div v-else>
                <h3
                  class="display-1 font-weight-thin"
                  v-text="whoWeAre.title"
                />
                <div class="my-5 grey--text text--darken-2">
                  <p v-html="whoWeAre.description" />
                </div>
              </div>
            </v-fade-transition>
            <div class="mx-auto mt-10 py-5">
              <h3
                class="display-1 font-weight-thin mb-5"
                v-text="$t('aboutTitles.contact')"
              />
              <v-alert
                v-if="showAlert"
                :type="type"
                v-text="message"
                dismissible
              />
              <v-form ref="form" v-model="valid" class="mt-7">
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
                    :disabled="!valid"
                    class="primary mx-auto v-card--shaped"
                    @click="sendForm"
                  >
                    Send
                    <v-icon class="ml-2" small v-text="mdiSend" />
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
            <v-icon
              class="white--text mb-7"
              x-large
              v-text="$data[action.icon]"
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
      </v-parallax>
    </section>
    <br />
    <br />
    <!--    <section class="my-12">-->
    <!--      <v-container class="text-center">-->
    <!--        <h1 class="display-2 font-weight-thin mb-12">Our Partners</h1>-->
    <!--        <span-->
    <!--          class="d-inline-block my-5 mx-2"-->
    <!--          :key="i"-->
    <!--          v-for="(partner, i) in partners"-->
    <!--        >-->
    <!--          <v-tooltip bottom>-->
    <!--            <template v-slot:activator="{ on }">-->
    <!--              <a :href="partner.link" target="_blank" v-on="on">-->
    <!--                <img-->
    <!--                  height="180px"-->
    <!--                  alt="partner.name"-->
    <!--                  style="opacity: 0.7"-->
    <!--                  :src="partner.image_url"-->
    <!--                />-->
    <!--              </a>-->
    <!--            </template>-->
    <!--            <span>{{ partner.name }}</span>-->
    <!--          </v-tooltip>-->
    <!--        </span>-->
    <!--      </v-container>-->
    <!--    </section>-->
    <br />
    <br />
  </v-content>
</template>

<script>
import axios from "axios";
import store from "@/store";
import {
  mdiCloudDownloadOutline,
  mdiSearchWeb,
  mdiSend,
  mdiYoutube
} from "@mdi/js";

export default {
  data: () => {
    return {
      mdiCloudDownloadOutline,
      mdiSearchWeb,
      mdiSend,
      mdiYoutube,
      valid: false,
      showAlert: false,
      submitting: false,
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
      let self = this;
      self.submitting = true;
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/api/messages`, this.contact)
        .then(
          () => {
            this.showAlert = true;
            this.type = "success";
            this.message = "Your feedback is successfully submitted!";
            this.$refs.form.reset();
          },
          () => {
            this.showAlert = true;
            this.type = "error";
            this.message = "Something went wrong!";
          }
        )
        .finally(() => {
          self.submitting = false;
        });
    }
  },
  created() {
    store.dispatch("setAboutActions", { lang: this.$i18n.locale });
    store.dispatch("setAboutDescriptions", { lang: this.$i18n.locale });
  },
  computed: {
    loaders: () => store.getters.getAboutLoaders,
    actions: () => store.getters.getAboutActions,
    allDescriptions: () => store.getters.getAboutDescriptions,
    descriptions() {
      let list = [];
      const needed = ["aboutTrackSym", "theMission", "yourData"];
      let self = this;
      try {
        needed.forEach(function(key) {
          list.push(self.allDescriptions[self.$t("aboutTitles." + key)]);
        });
        // eslint-disable-next-line no-empty
      } catch (e) {}
      return list;
    },
    whoWeAre() {
      if (
        this.allDescriptions &&
        this.allDescriptions[this.$t("aboutTitles.we")]
      ) {
        return this.allDescriptions[this.$t("aboutTitles.we")];
      }
      return {
        title: "",
        description: ""
      };
    }
  }
};
</script>
