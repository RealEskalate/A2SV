<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-alert
                dense
                text
                type="error"
                v-show="show"
                v-text="getMessage"
        ></v-alert>

        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Login form</v-toolbar-title>
          <v-spacer/>
          <v-progress-circular
                  v-if="loading"
                  class="mx-auto"
                  :size="50"
                  :width="7"
                  color="white"
                  indeterminate
          ></v-progress-circular>
        </v-toolbar>
        <v-card-text>
          <v-form class="mx-4 my-4" v-model="valid">
            <v-text-field
                    :rules="rules.username"
                    v-model="user.username"
                    label="Username"
                    required
            ></v-text-field>
            <v-text-field
                    :rules="rules.password"
                    :append-icon="!show1 ? mdiEyeOff : mdiEye"
                    v-model="user.password"
                    label="Password"
                    :type="show1 ? 'text' : 'password'"
                    required
                    @click:append="show1 = !show1"
            ></v-text-field>

            <div class="my-2 mx-auto align-center align-content-center">
              <v-btn
                      :disabled="!valid"
                      color="primary"
                      class="d-block mx-auto"
                      @click="submit"
              >
                Login
              </v-btn>
              <router-link
                      to="register"
                      class="mx-auto d-block text-center my-2 v-card--link"
              >Register
              </router-link
              >
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
  import ajax from "../../auth/ajax";
  import store from "@/store/";
  import {Rules, User} from "./user.js";
  import {mdiEye, mdiEyeOff} from "@mdi/js";

  export default {
    name: "Login",
    data() {
      return {
        mdiEye,
        mdiEyeOff,
        valid: false,
        show1: false,
        errorMsg: false,
        loadAnim: false,
        user: User,
        rules: Rules
      };
    },
    methods: {
      submit() {
        this.loadAnim = true;
        ajax.post("auth/login", this.user).then(
            success => {
              alert("Login successful");
              console.log(success);
              this.loadAnim = false;
            },
            error => {
              store.dispatch("setStateMessage", error.message);
              this.loadAnim = false;
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
