<template>
  <v-container>
    <h3 class="display-1 font-weight-thin" v-text="$t('navbar.profile')" />
    <v-row>
      <v-col cols="12" md="4" class="text-center mb-10">
        <v-form ref="form" v-model="valid" class="mt-7">
          <v-avatar class="mb-5" width="90" height="90">
            <v-img cover src="/logo.png" />
          </v-avatar>

          <v-fade-transition>
            <div v-if="editing.profile">
              <v-list-item class="px-md-12">
                <v-list-item-content>
                  <div>
                    <v-text-field
                      class="v-card--shaped"
                      prefix="@"
                      outlined
                      dense
                      label="Username"
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
                      label="Age Group"
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
                      label="Gender"
                      outlined
                    />
                  </div>
                  <div class="text-center">
                    <v-btn
                      depressed
                      small
                      color="secondary"
                      :disabled="loading"
                      class="v-card--shaped my-5 mx-1"
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
                      class="v-card--shaped my-5 mx-1"
                      @click="updateProfile"
                    >
                      <v-icon class="mr-2" small v-text="mdiCheck" />
                      Save Changes
                    </v-btn>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </div>
            <div v-else-if="editing.password">
              <v-list-item class="px-md-12">
                <v-list-item-content>
                  <div>
                    <v-text-field
                      class="v-card--shaped"
                      outlined
                      dense
                      label="Old Password"
                      v-model="form_password.old"
                      :rules="rules.password"
                    />
                  </div>
                  <div>
                    <v-text-field
                      class="v-card--shaped"
                      outlined
                      dense
                      label="New Password"
                      v-model="form_password.new"
                      :rules="rules.nameRules"
                    />
                  </div>
                  <div>
                    <v-text-field
                      class="v-card--shaped"
                      outlined
                      dense
                      label="Confirm Password"
                      v-model="form_password.confirm"
                      :rules="rules.password || rules.match"
                    />
                  </div>
                  <div class="text-center">
                    <v-btn
                      depressed
                      small
                      color="secondary"
                      :disabled="loading"
                      class="v-card--shaped my-5 mx-1"
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
                      class="v-card--shaped my-5 mx-1"
                      @click="updatePassword"
                    >
                      <v-icon class="mr-2" small v-text="mdiCheck" />
                      Save Changes
                    </v-btn>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </div>
            <div v-else>
              <v-list-item>
                <v-list-item-content>
                  <h2
                    class="font-weight-regular"
                    v-text="'@' + loggedInUser.username"
                  />
                  <h3 class="font-weight-thin mb-4 mt-2">
                    Age Group:
                    <span
                      class="grey--text font-italic"
                      v-text="loggedInUser.age_group"
                    />
                  </h3>
                  <v-list-item-subtitle v-text="loggedInUser.gender" />
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
                  Edit Profile
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
                  Change Password
                </v-btn>
              </div>
            </div>
          </v-fade-transition>
        </v-form>
      </v-col>
      <v-col cols="12" md="8">
        <h1
          class="text-center font-weight-regular primary--text"
          v-text="'Symptoms'"
        />
        <v-fade-transition hide-on-leave>
          <v-container class="text-center px-md-10" v-if="!editing.symptoms">
            <div class="shadow-in v-card--shaped grey lighten-4 py-3">
              <v-list-item-subtitle
                class="my-8 grey--text text--darken-1"
                v-if="userSymptoms.length === 0"
                v-text="'No Symptoms'"
              />
              <v-card
                v-else
                shaped
                outlined
                width="150"
                class="shadow-sm d-inline-block my-2 mx-2 py-2 px-4"
                :key="i"
                v-for="(symptom, i) in userSymptoms"
              >
                <v-avatar class="my-2" width="70" height="70">
                  <v-img contain :src="symptom.image_url" />
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
              </v-card>
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
              Edit Symptoms
            </v-btn>
          </v-container>

          <!--Editing Symptoms-->
          <v-container class="text-center px-md-10" v-else>
            <div class="shadow-in v-card--shaped grey lighten-4 py-3">
              <v-item-group v-model="selectedSymptoms" multiple>
                <v-item
                  :key="i"
                  v-for="(symptom, i) in allSymptoms"
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
                        <v-img contain src="/logo.png" />
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
                      <v-overlay
                        color="primary"
                        absolute
                        z-index="2"
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
              color="secondary"
              :disabled="loading"
              class="v-card--shaped my-5 mx-1"
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
              class="v-card--shaped my-5 mx-1"
              @click="updateSymptoms"
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
  mdiCheck,
  mdiCheckboxMarkedCircle,
  mdiCheckboxBlankCircleOutline,
  mdiWindowClose
} from "@mdi/js";
import store from "@/store";

export default {
  name: "Profile",
  data() {
    return {
      mdiAccountEdit,
      mdiKey,
      mdiCheck,
      mdiCheckboxMarkedCircle,
      mdiCheckboxBlankCircleOutline,
      mdiWindowClose,
      valid: false,
      editing: {
        profile: false,
        password: false,
        symptoms: false
      },
      loading: false,
      selectedSymptoms: [],
      form_user: {
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
        password: [v => !!v || "Password is required"],
        match: [
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
        username: this.loggedInUser.username,
        age_group: this.loggedInUser.age_group,
        gender: this.loggedInUser.gender
      };
      this.form_password = {
        old: "",
        new: "",
        confirm: ""
      };
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
      this.setMode();
      this.loading = false;
    },
    updatePassword() {
      this.loading = true;
      this.setMode();
      this.loading = false;
    },
    updateSymptoms() {
      this.loading = true;
      this.setMode();
      this.loading = false;
    },
    userSymptomIndexes() {
      let res = [];
      for (let i = 0; i < this.allSymptoms.length; i++) {
        if (this.userSymptoms().includes(this.allSymptoms[i])) {
          res.push(i);
        }
      }
      return res;
    }
  },
  created() {
    store.dispatch("setAllSymptoms");
  },
  watch: {
    userSymptoms() {
      this.selectedSymptoms = this.userSymptomIndexes();
    }
  },
  computed: {
    userSymptoms: () => store.getters.getSymptomUser,
    allSymptoms: () => store.getters.getAllSymptoms
  }
};
</script>
