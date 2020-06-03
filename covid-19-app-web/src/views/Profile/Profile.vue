<template>
  <v-container>
    <h3
      class="display-1 font-weight-thin mb-12"
      v-text="$t('navbar.profile')"
    />
    <v-row>
      <v-col cols="12" md="3" class="text-center mb-10 d-flex align-center">
        <div>
          <v-avatar class="shadow-sm v-card--shaped" width="90" height="90">
            <v-img
              cover
              src="https://images.pexels.com/photos/3894157/pexels-photo-3894157.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
            />
          </v-avatar>
          <v-list-item class="my-3">
            <v-list-item-content>
              <h2 class="font-weight-regular" v-text="'@' + 'MarcusObrien'" />
              <h3 class="font-weight-thin mb-4 mt-2">
                Age Group:
                <span class="grey--text font-italic" v-text="'12-14'" />
              </h3>
              <v-list-item-subtitle v-text="'MALE'" />
            </v-list-item-content>
          </v-list-item>
          <div class="text-center">
            <v-btn depressed small color="primary" class="v-card--shaped ma-2">
              <v-icon class="mr-2" small v-text="mdiAccountEdit" />
              Edit Profile
            </v-btn>
            <br />
            <v-btn depressed small color="primary" class="v-card--shaped ma-2">
              <v-icon class="mr-2" small v-text="mdiKey" />
              Change Password
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="9">
        <h1 class="text-center font-weight-regular primary--text" v-text="'Symptoms'" />
        <v-fade-transition hide-on-leave>
          <v-container class="text-center px-md-10" v-if="!editingSymptoms">
            <div class="shadow-in v-card--shaped grey lighten-4 py-3">
              <v-card
                shaped
                outlined
                width="150"
                class="shadow-sm d-inline-block my-2 mx-2 py-2 px-4"
                :key="i"
                v-for="(symptom, i) in symptoms"
              >
                <v-avatar class="my-2" width="70" height="70">
                  <v-img contain :src="symptom.image_url" />
                </v-avatar>
                <br />
                <span class="mb-0" v-text="'Medium-grade Fever'" />
                <br />
                <small class="font-weight-thin">
                  Relevance:
                  <span
                    :class="
                      `font-italic text--darken-2 ${relevanceColor(
                        'HIGH'
                      )}--text`
                    "
                    v-text="'HIGH'"
                  />
                </small>
              </v-card>
            </div>
            <v-btn
              depressed
              small
              color="primary"
              class="v-card--shaped ma-5"
              @click="editingSymptoms = true"
            >
              <v-icon class="mr-2" small v-text="mdiAccountEdit" />
              Edit Symptoms
            </v-btn>
          </v-container>

          <!--Editing Symptoms-->
          <v-container class="text-center px-md-10" v-else>
            <div class="shadow-in v-card--shaped grey lighten-4 py-3">
              <v-item-group v-model="selectedSymptoms" multiple>
                <v-item
                  :key="i"
                  v-for="(symptom, i) in symptoms"
                  v-slot:default="{ active, toggle }"
                >
                  <v-hover v-slot:default="{ hover }">
                    <v-card
                      width="150"
                      shaped
                      outlined
                      @click="toggle"
                      :class="
                        `${
                          hover ? '' : 'shadow-sm'
                        } d-inline-block my-2 mx-2 py-2 px-4 overflow-hidden`
                      "
                    >
                      <v-icon
                        style="position: absolute; right: 0; top: 0; z-index: 100; opacity: 0.7"
                        class="mt-1 mr-1"
                        color="primary"
                        @click="dialog = false"
                        v-text="
                          active
                            ? mdiCheckboxMarkedCircle
                            : mdiCheckboxBlankCircleOutline
                        "
                      />
                      <v-avatar class="my-2" width="70" height="70">
                        <v-img contain :src="symptom.image_url" />
                      </v-avatar>
                      <br />
                      <span class="mb-0" v-text="'Medium-grade Fever'" />
                      <br />
                      <small class="font-weight-thin">
                        Relevance:
                        <span
                          :class="
                            `font-italic text--darken-2 ${relevanceColor(
                              'HIGH'
                            )}--text`
                          "
                          v-text="'HIGH'"
                        />
                      </small>
                      <v-overlay
                        color="primary"
                        absolute
                        :opacity="0.3"
                        :value="active"
                      />
                    </v-card>
                  </v-hover>
                </v-item>
              </v-item-group>
            </div>
            <v-btn
              depressed
              small
              color="success"
              class="v-card--shaped ma-5"
              @click="editingSymptoms = false"
            >
              <v-icon class="mr-2" small v-text="mdiAccountEdit" />
              Save Changes
            </v-btn>
          </v-container>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  mdiAccountEdit,
  mdiKey,
  mdiCheckboxMarkedCircle,
  mdiCheckboxBlankCircleOutline
} from "@mdi/js";
import store from "@/store";

export default {
  name: "Profile",
  data() {
    return {
      mdiAccountEdit,
      mdiKey,
      mdiCheckboxMarkedCircle,
      mdiCheckboxBlankCircleOutline,
      changingPassword: false,
      editingProfile: false,
      editingSymptoms: false,
      selectedSymptoms: [],
      symptoms: [
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
    relevanceColor(relevance) {
      switch (relevance.toLowerCase()) {
        case "high":
          return "red";
        case "low":
          return "amber";
        default:
          return "grey";
      }
    }
  },
  created() {
    store.dispatch("setAllSymptoms");
  },
  computed: {
    allSymptoms: () => store.getters.getAllSymptoms
  }
};
</script>
