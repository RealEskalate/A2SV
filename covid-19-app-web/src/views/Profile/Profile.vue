<template>
  <v-container class="mb-12">
    <v-snackbar top :color="alert.type" v-model="alert.show" :timeout="5000">
      <span class="ma-2" v-text="alert.message" />
      <v-btn
        icon
        x-small
        class="float-right"
        color="white"
        @click="alert.show = false"
      >
        <v-icon v-text="mdiCloseCircleOutline" />
      </v-btn>
    </v-snackbar>

    <h3 class="display-1 font-weight-thin" v-text="$t('navbar.profile')" />
    <v-row>
      <v-col cols="12" md="3" class="text-center">
        <v-form ref="form" v-model="valid" class="mt-12">
          <v-avatar class="mb-3" width="90" height="90">
            <v-img cover src="/logo.png" />
          </v-avatar>

          <v-fade-transition>
            <div v-if="editing.profile">
              <v-list-item>
                <v-list-item-content>
                  <div>
                    <v-text-field
                      class="v-card--shaped"
                      prefix="@"
                      outlined
                      dense
                      :label="$t('auth.username')"
                      v-model="form_user.username"
                      :rules="rules.nameRules"
                      counter="30"
                    />
                  </div>
                  <div>
                    <v-select
                      dense
                      :rules="rules.ageGroupRules"
                      v-model="form_user.age_group"
                      :items="age_groups"
                      class="v-card--shaped"
                      :label="$t('auth.ageGroup')"
                      outlined
                    />
                  </div>
                  <div>
                    <v-select
                      dense
                      :rules="rules.genderRules"
                      v-model="form_user.gender"
                      :items="genders"
                      class="v-card--shaped"
                      :label="$t('auth.gender')"
                      outlined
                    />
                  </div>
                  <div>
                    <v-text-field
                      class="v-card--shaped"
                      outlined
                      dense
                      :label="$t('auth.passwordConfirmation')"
                      v-model="form_password.old"
                      :rules="rules.old_password"
                    />
                  </div>
                  <div class="text-center">
                    <v-btn
                      depressed
                      small
                      color="secondary"
                      :disabled="loading"
                      class="v-card--shaped mt-3 mx-1"
                      @click="setMode()"
                    >
                      <v-icon class="mr-2" small v-text="mdiWindowClose" />
                      Cancel
                    </v-btn>
                    <v-btn
                      depressed
                      small
                      color="success"
                      :loading="loading"
                      :disabled="!valid"
                      class="v-card--shaped mt-3 mx-1"
                      @click="updateProfile"
                    >
                      <v-icon class="mr-2" small v-text="mdiCheck" />
                      {{ $t("saveChanges") }}
                    </v-btn>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </div>
            <div v-else-if="editing.password">
              <v-list-item>
                <v-list-item-content>
                  <div>
                    <v-text-field
                      class="v-card--shaped"
                      outlined
                      dense
                      :label="$t('auth.oldPassword')"
                      v-model="form_password.old"
                      :rules="rules.old_password"
                    />
                  </div>
                  <div>
                    <v-text-field
                      class="v-card--shaped"
                      outlined
                      dense
                      :label="$t('auth.newPassword')"
                      v-model="form_password.new"
                      :rules="rules.new_password"
                    />
                  </div>
                  <div>
                    <v-text-field
                      class="v-card--shaped"
                      outlined
                      dense
                      :label="$t('auth.confirmPassword')"
                      v-model="form_password.confirm"
                      :rules="rules.confirm_password"
                    />
                  </div>
                  <div class="text-center">
                    <v-btn
                      depressed
                      small
                      color="secondary"
                      :disabled="loading"
                      class="v-card--shaped mt-3 mx-1"
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
                      :disabled="!valid"
                      class="v-card--shaped mt-3 mx-1"
                      @click="updatePassword"
                    >
                      <v-icon class="mr-2" small v-text="mdiCheck" />
                      {{ $t("auth.saveChanges") }}
                    </v-btn>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </div>
            <div v-else>
              <v-list-item>
                <v-list-item-content>
                  <h2
                    class="mb-2 font-weight-regular"
                    v-text="'@' + loggedInUser.username"
                  />
                  <h4 class="font-weight-thin mb-4 mt-2">
                    {{ $t("auth.ageGroup") }}:
                    <span
                      class="grey--text font-italic"
                      v-text="loggedInUser.age_group"
                    />
                  </h4>
                  <h4 class="font-weight-thin mb-4">
                    {{ $t("auth.sicknessProbability") }}:
                    <span
                      class="grey--text font-italic"
                      v-text="retrievedSymptoms.probability.toFixed(2) + '%'"
                    />
                  </h4>
                  <v-list-item-subtitle
                    v-text="$t('auth.' + loggedInUser.gender.toLowerCase())"
                  />
                </v-list-item-content>
              </v-list-item>
              <div class="text-center my-3">
                <v-btn
                  depressed
                  small
                  color="primary"
                  :disabled="loading"
                  class="v-card--shaped ma-2"
                  @click="setMode('profile')"
                >
                  <v-icon class="mr-2" small v-text="mdiAccountEdit" />
                  {{ $t("auth.editProfile") }}
                </v-btn>
                <br />
                <v-btn
                  depressed
                  small
                  color="primary"
                  :disabled="loading"
                  class="v-card--shaped ma-2"
                  @click="setMode('password')"
                >
                  <v-icon class="mr-2" small v-text="mdiKey" />
                  {{ $t("auth.changePassword") }}
                </v-btn>
              </div>
            </div>
          </v-fade-transition>
        </v-form>
      </v-col>
      <v-col cols="12" md="9">
        <h1
          class="text-center font-weight-regular primary--text"
          v-text="$t('auth.symptoms')"
        />
        <v-fade-transition hide-on-leave>
          <v-container class="text-center" v-if="!editing.symptoms">
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
                    <div>
                      <v-avatar class="my-2" width="70" height="70">
                        <v-img contain :src="server_url + symptom.image" />
                      </v-avatar>
                      <br />
                      <span class="mb-0" v-text="symptom.name" />
                      <br />
                      <small class="font-weight-thin grey--text text--darken-1">
                        Relevance:
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
                  </v-card>
                </v-col>
              </v-row>
            </div>
            <v-btn
              depressed
              small
              color="primary"
              :disabled="loading"
              class="v-card--shaped ma-5"
              @click="setMode('symptoms')"
            >
              <v-icon class="mr-2" small v-text="mdiAccountEdit" />
              {{ $t("auth.editSymptoms") }}
            </v-btn>
          </v-container>

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
                          <div>
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
                              Relevance:
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
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <symptom-history :relevanceColor="relevanceColor" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  mdiAccountEdit,
  mdiCheck,
  mdiCheckboxBlankCircleOutline,
  mdiCheckboxMarkedCircle,
  mdiCloseCircleOutline,
  mdiKey,
  mdiWindowClose
} from "@mdi/js";
import SymptomHistory from "./SymptomHistory";
import store from "@/store";
import ajax from "@/auth/ajax";
import bcrypt from "bcryptjs";

export default {
  name: "Profile",
  components: { SymptomHistory },
  data() {
    return {
      mdiAccountEdit,
      mdiKey,
      mdiCheck,
      mdiCloseCircleOutline,
      mdiCheckboxMarkedCircle,
      mdiCheckboxBlankCircleOutline,
      mdiWindowClose,
      alert: {
        show: false,
        type: "success",
        message: "Welcome"
      },
      valid: false,
      editing: {
        profile: false,
        password: false,
        symptoms: false
      },
      loading: false,
      selectedSymptoms: [],
      form_user: {
        _id: null,
        username: "",
        age_group: "",
        gender: ""
      },
      form_password: {
        old: "",
        new: "",
        confirm: ""
      },
      rules: {
        nameRules: [
          v => !!v || "Username is required",
          v => (v && v.length <= 30) || "Name must be less than 10 characters"
        ],
        ageGroupRules: [v => !!v || "Age Range is required"],
        genderRules: [v => !!v || "Gender is required"],
        old_password: [
          value => !!value || "Old Password is required.",
          value =>
            bcrypt.compareSync(value, this.loggedInUser.password) ||
            "Wrong Password"
        ],
        new_password: [
          value => !!value || "New password is required.",
          v => v.length >= 6 || "Min 6 characters"
        ],
        confirm_password: [
          value => !!value || "Password Confirmation is required.",
          value => value === this.form_password.new || "Password doesn't match"
        ]
      },
      genders: ["MALE", "FEMALE", "UNDISCLOSED"],
      age_groups: [
        "0-10",
        "11-20",
        "21-30",
        "31-40",
        "41-50",
        "51-60",
        "61-70",
        "71-80",
        "81-90",
        ">90"
      ]
    };
  },
  methods: {
    resetForms() {
      this.form_user = {
        _id: this.loggedInUser._id,
        username: this.loggedInUser.username,
        age_group: this.loggedInUser.age_group,
        gender: this.loggedInUser.gender
      };
      this.form_password = {
        old: "",
        new: "",
        confirm: ""
      };
      this.selectedSymptoms = this.userSymptomIndexes();
    },
    setMode(mode = "none") {
      this.resetForms();
      if (mode === "none") {
        this.editing = {
          profile: false,
          password: false,
          symptoms: false
        };
      } else {
        for (let key in this.editing) {
          this.editing[key] = key === mode;
        }
      }
    },
    setAlert(message, type, show = true) {
      this.alert.show = show;
      this.alert.type = type;
      this.alert.message = message;
    },
    relevanceColor(relevance) {
      switch (relevance.toLowerCase()) {
        case "high":
          return "red";
        case "medium":
          return "orange";
        case "low":
          return "yellow";
        default:
          return "grey";
      }
    },
    updateProfile() {
      this.loading = true;
      ajax
        .patch(`users`, this.form_user)
        .then(res => {
          store.dispatch("setUser", { user: res.data });
          this.setMode();
          this.setAlert("Successfully Updated Profile", "success");
        })
        .catch(err => {
          this.setAlert(err.response.data, "red");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    updatePassword() {
      this.loading = true;
      ajax
        .patch(`users`, {
          _id: this.loggedInUser._id,
          password: this.form_password.new
        })
        .then(res => {
          store.dispatch("setUser", { user: res.data });
          this.setMode();
          this.setAlert("Successfully Changed Password", "success");
        })
        .catch(err => {
          this.setAlert(err.response.data, "red");
        })
        .finally(() => {
          this.loading = false;
        });
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
    store.dispatch("setSelfSymptomUser", {
      userId: this.loggedInUser._id,
      demo: false,
      lang: this.$i18n.locale
    });
    store.dispatch("setAllSymptoms", { lang: this.$i18n.locale });
  },
  watch: {
    userSymptoms() {
      this.selectedSymptoms = this.userSymptomIndexes();
    }
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
