<template class="mx-auto">
  <v-card class="mx-auto elevation-12 my-8" max-width="344" outlined>
    <v-alert
            dense
            text
            type="error"
            v-show="show"
            v-text="getMessage"
    ></v-alert>

    <v-toolbar color="blue darken-2" dark>
      <v-toolbar-title>Create an account</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-progress-circular
              v-if="loading"
              class="mx-auto"
              :size="50"
              :width="7"
              color="white"
              indeterminate
      ></v-progress-circular>
    </v-toolbar>
    <v-form class="mx-4 my-4" v-model="valid" ref="form">
      <v-text-field
              v-model="user.username"
              :rules="rules.username"
              label="Username"
              required
      ></v-text-field>
      <v-row>
        <v-col>
          <v-select
                  :items="age_group"
                  label="Age group"
                  v-model="user.age_group"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
                  :items="gender"
                  label="Gender"
                  v-model="user.gender"
          ></v-select>
        </v-col>
      </v-row>

      <v-text-field
              :append-icon="!show1 ? mdiEyeOff : mdiEye"
              :rules="rules.password"
              v-model="user.password"
              label="Password"
              :type="show1 ? 'text' : 'password'"
              required
              ref="password"
              @click:append="show1 = !show1"
      ></v-text-field>
      <v-text-field
              :append-icon="!show ? mdiEyeOff : mdiEye"
              :rules="match"
              v-model="user.confirm_password"
              label="Confirm password"
              :type="show1 ? 'text' : 'password'"
              required
              @click:append="show1 = !show1"
      ></v-text-field>

      <div class="my-2 mx-auto align-center align-content-center">
        <v-btn
                :disabled="!valid"
                color="success"
                class="d-block mx-auto"
                @click="submit"
        >
          Register
        </v-btn>
        <router-link
                to="login"
                class="mx-auto d-block text-center my-2 v-card--link"
        >Login
        </router-link>
      </div>
    </v-form>
  </v-card>
</template>

<script>
  import store from "@/store/";
  import ajax from "../../auth/ajax";
  import {Rules, User} from "./user.js";
  import {mdiEye, mdiEyeOff} from "@mdi/js";

  export default {
    data() {
      return {
        mdiEye,
        mdiEyeOff,
        valid: false,
        show1: false,
        loadAnim: false,
        user: User,
        rules: Rules,
        match: [
          value => value === this.user.password || "Password doesn't match"
        ],
        age_group: [
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
        ],
        gender: ["MALE", "FEMALE", "UNDISCLOSED"]
      };
    },
    methods: {
      submit() {
        this.loadAnim = true;
        ajax.post("auth/register", this.user).then(
            user => {
              alert("registration successful");
              console.log(user);
              this.loadAnim = false;
              store.dispatch("setStateMessage", "User successfully created");
            },
            error => {
              this.loadAnim = false;
              store.dispatch("setStateMessage", error.message);
            }
        );
      }
    },
    computed: {
      show() {
        // show an alert message if only there is one
        return store.getters.getMessage !== "";
      },
      loading() {
        return this.loadAnim;
      },
      getMessage() {
        return store.getters.getMessage;
      }
    }
  };
</script>
