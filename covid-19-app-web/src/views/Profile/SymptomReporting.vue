<template>
  <v-container>
    <h3 class="display-1 font-weight-thin mb-10" v-text="$t('auth.symptoms')" />
    <v-fade-transition hide-on-leave>
      <div class="text-center py-12" v-if="!loggedInUser">
        <v-btn
          class="mx-auto v-card--shaped"
          outlined
          small
          text
          :to="{ name: 'Login' }"
        >
          <v-icon small class="mr-2" color="primary" v-text="mdiInformation" />
          Sign in to submit symptoms
        </v-btn>
      </div>
      <div class="text-center" v-else-if="!editing">
        <div class="shadow-in v-card--shaped grey lighten-4 px-6 py-2">
          <div v-if="symTrackLoaders.selfSymptoms">
            <v-progress-linear
              style="margin-top: -7px; margin-bottom: 10px;"
              height="2"
              indeterminate
              color="primary"
            />
            <v-list-item-subtitle
              class="my-8 grey--text text--darken-1"
              v-text="'Loading...'"
            />
          </div>
          <v-list-item-subtitle
            class="my-8 grey--text text--darken-1"
            v-else-if="userSymptoms.length === 0"
            v-text="$t('auth.noSymptoms')"
          />
          <v-row v-else>
            <v-col
              cols="12"
              sm="4"
              md="3"
              :key="i"
              v-for="(symptom, i) in userSymptoms"
            >
              <v-card
                shaped
                outlined
                style="height: 100%"
                class="shadow-sm pa-2 overflow-hidden align-center justify-center d-flex"
              >
                <v-tooltip
                  bottom
                  open-delay="1000"
                  transition="fade-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div v-on="on" v-bind="attrs">
                      <v-avatar class="my-2" width="70" height="70">
                        <v-img contain :src="server_url + symptom.image" />
                      </v-avatar>
                      <br />
                      <span class="mb-0" v-text="symptom.name" />
                      <br />
                      <small class="font-weight-thin grey--text text--darken-1">
                        {{ $t("auth.relevance") }}:
                        <span
                          :class="
                            `text--darken-1 ${relevanceColor(
                              symptom.relevance
                            )}--text`
                          "
                          v-text="symptom.relevance"
                        />
                      </small>
                    </div>
                  </template>
                  <span v-text="symptom.description" />
                </v-tooltip>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <v-btn
          depressed
          small
          color="primary"
          :disabled="loading"
          class="v-card--shaped my-5 mx-1"
          @click="setMode('symptoms')"
        >
          <v-icon class="mr-2" small v-text="mdiAccountEdit" />
          {{ $t("auth.editSymptoms") }}
        </v-btn>
        <v-btn
          depressed
          small
          color="secondary"
          :disabled="loading"
          class="v-card--shaped my-5 mx-1"
          :to="{ name: 'Profile' }"
        >
          {{ $t("moreInfo") }}
          <v-icon class="ml-1" small v-text="mdiArrowRight" />
        </v-btn>
      </div>

      <!--Editing Symptoms-->
      <v-container class="text-center px-md-10" v-else>
        <div class="shadow-in v-card--shaped grey lighten-4 px-6 py-2">
          <v-item-group v-model="selectedSymptoms" multiple>
            <div v-if="symTrackLoaders.allSymptoms">
              <v-progress-linear
                style="margin-top: -7px; margin-bottom: 10px;"
                height="2"
                striped
                indeterminate
                color="primary"
              />
              <v-list-item-subtitle
                class="my-8 grey--text text--darken-1"
                v-text="'Loading...'"
              />
            </div>
            <v-list-item-subtitle
              class="my-8 grey--text text--darken-1"
              v-else-if="allSymptoms.length === 0"
              v-text="$t('auth.noSymptoms')"
            />
            <v-row v-else>
              <v-col
                cols="12"
                sm="4"
                md="3"
                :key="i"
                v-for="(symptom, i) in allSymptoms"
              >
                <v-item v-slot:default="{ active, toggle }">
                  <v-hover v-slot:default="{ hover }">
                    <v-card
                      shaped
                      outlined
                      @click="toggle"
                      style="height: 100%"
                      :class="
                        `${
                          hover ? '' : 'shadow-sm'
                        } pa-2 overflow-hidden align-center justify-center d-flex`
                      "
                    >
                      <v-tooltip
                        bottom
                        open-delay="1000"
                        transition="fade-transition"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <div v-on="on" v-bind="attrs">
                            <v-icon
                              style="position: absolute; right: 0; top: 0; z-index: 2; opacity: 0.7"
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
                              <v-img
                                contain
                                :src="server_url + symptom.image"
                              />
                            </v-avatar>
                            <br />
                            <span class="mb-0" v-text="symptom.name" />
                            <br />
                            <small
                              class="font-weight-thin grey--text text--darken-1"
                            >
                              {{ $t("auth.relevance") }}:
                              <span
                                :class="
                                  `text--darken-1 ${relevanceColor(
                                    symptom.relevance
                                  )}--text`
                                "
                                v-text="symptom.relevance"
                              />
                            </small>
                            <v-overlay
                              color="primary"
                              absolute
                              z-index="2"
                              :opacity="0.3"
                              :value="active"
                            />
                          </div>
                        </template>
                        <span v-text="symptom.description" />
                      </v-tooltip>
                    </v-card>
                  </v-hover>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>
        </div>
        <v-btn
          depressed
          small
          color="secondary"
          :disabled="loading"
          class="v-card--shaped my-5 mx-1"
          @click="setMode()"
        >
          <v-icon class="mr-2" small v-text="mdiWindowClose" />
          {{ $t("auth.cancel") }}
        </v-btn>
        <v-btn
          depressed
          small
          color="success"
          :loading="loading"
          class="v-card--shaped my-5 mx-1"
          @click="updateSymptoms"
        >
          <v-icon class="mr-2" small v-text="mdiAccountEdit" />
          {{ $t("auth.saveChanges") }}
        </v-btn>
      </v-container>
    </v-fade-transition>
  </v-container>
</template>

<script>
import store from "@/store";
import ajax from "@/auth/ajax";

import {
  mdiAccountEdit,
  mdiCheck,
  mdiCheckboxBlankCircleOutline,
  mdiCheckboxMarkedCircle,
  mdiCloseCircleOutline,
  mdiKey,
  mdiArrowRight,
  mdiInformation,
  mdiWindowClose
} from "@mdi/js";

export default {
  name: "SymptomReporting",
  data() {
    return {
      mdiAccountEdit,
      mdiKey,
      mdiCheck,
      mdiArrowRight,
      mdiCloseCircleOutline,
      mdiCheckboxMarkedCircle,
      mdiCheckboxBlankCircleOutline,
      mdiWindowClose,
      mdiInformation,
      editing: false,
      loading: false,
      selectedSymptoms: []
    };
  },
  methods: {
    setMode(mode = "none") {
      this.selectedSymptoms = this.userSymptomIndexes();
      this.editing = mode !== "none";
    },
    setAlert(message, type, show = true) {
      this.alert.show = show;
      this.alert.type = type;
      this.alert.message = message;
    },
    relevanceColor(relevance) {
      switch (relevance.toLowerCase()) {
        case this.$t("auth.high").toLowerCase():
          return "red";
        case this.$t("auth.medium").toLowerCase():
          return "orange";
        case this.$t("auth.low").toLowerCase():
          return "yellow";
        default:
          return "grey";
      }
    },
    updateSymptoms() {
      this.loading = true;
      ajax
        .post(`symptomuser/multiple`, {
          symptoms: this.symptomIDs()
        })
        .then(() => {
          store.dispatch("setSelfSymptomUser", {
            userId: this.loggedInUser._id,
            lang: this.$i18n.locale,
            demo: false
          });
          this.setMode();
          this.setAlert("Successfully Updated Symptoms", "success");
          store.dispatch("setSymptomHistory", {
            userId: this.loggedInUser._id,
            lang: this.$i18n.locale
          });
        })
        .catch(err => {
          this.setAlert(err.response.data, "red");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    userSymptomIndexes() {
      let res = [];
      let allSymptoms = this.allSymptoms;
      this.userSymptoms.forEach(function(userSymptom) {
        const ind = allSymptoms.findIndex(symptom => {
          return symptom._id === userSymptom._id;
        });
        if (ind >= 0) res.push(ind);
      });
      return res;
    },
    symptomIDs() {
      let res = [];
      for (let i = 0; i < this.selectedSymptoms.length; i++) {
        const ind = this.selectedSymptoms[i];
        res.push(this.allSymptoms[ind]._id);
      }
      return res;
    }
  },
  created() {
    if (this.loggedInUser) {
      store.dispatch("setSelfSymptomUser", {
        userId: this.loggedInUser._id,
        demo: false,
        lang: this.$i18n.locale
      });
    }
    store.dispatch("setAllSymptoms", { lang: this.$i18n.locale });
  },
  computed: {
    retrievedSymptoms: () => store.getters.getSelfSymptomUser,
    userSymptoms: () => {
      let res = [];
      let retrieved = store.getters.getSelfSymptomUser;
      retrieved.symptom_info.forEach(function(sym) {
        res.push(sym.Symptom);
      });
      return res;
    },
    allSymptoms: () => store.getters.getAllSymptoms,
    symTrackLoaders: () => store.getters.getSymTrackLoaders
  }
};
</script>
