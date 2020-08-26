<template>
  <v-row align="center" justify="center" style="height: 100%">
    <v-col cols="12" sm="8" md="4">
      <v-card class="overflow-hidden" shaped outlined>
        <v-snackbar top color="primary" v-model="snackbar" :timeout="5000">
          <span class="ma-2" v-text="getMessage" />
          <v-btn text icon x-small color="white" @click="snackbar = false">
            <v-icon v-text="mdiCloseCircleOutline" />
          </v-btn>
        </v-snackbar>

        <v-toolbar class="shadow-sm mb-3" color="primary" dark flat>
          <v-toolbar-title v-text="$t('auth.login')" />
        </v-toolbar>

        <v-card-text>
          <v-form class="mx-4 my-4" v-model="valid">
            <v-text-field
              dense
              outlined
              prefix="@"
              class="v-card--shaped"
              :rules="rules.username"
              v-model="user.username"
              :label="$t('auth.username')"
              required
            />
            <v-text-field
              dense
              outlined
              class="v-card--shaped"
              :rules="rules.password"
              :append-icon="!show_password ? mdiEyeOff : mdiEye"
              v-model="user.password"
              :label="$t('auth.password')"
              :type="show_password ? 'text' : 'password'"
              required
              @click:append="show_password = !show_password"
            />

            <div class="my-2 mx-auto align-center align-content-center">
              <v-btn
                :disabled="!valid"
                color="primary"
                class="d-block mx-auto v-card--shaped"
                @click="submit"
                :loading="loading"
              >
                {{ $t("auth.login") }}
              </v-btn>
              <v-btn
                text
                small
                class="d-block mx-auto my-2"
                @click="$router.push('register')"
              >
                {{ $t("auth.goToSignUp") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import ajax from "@/auth/ajax";
import store from "@/store/";
import { Rules, User } from "./user.js";
import { mdiCloseCircleOutline, mdiEye, mdiEyeOff } from "@mdi/js";

export default {
  name: "Login",
  data() {
    return {
      mdiEye,
      mdiEyeOff,
      mdiCloseCircleOutline,
      valid: false,
      show_password: false,
      snackbar: false,
      errorMsg: false,
      loading: false,
      user: User,
      rules: Rules
    };
  },
  created() {
    console.log(this.$route.query.nextUrl);
  },
  methods: {
    submit() {
      this.loading = true;
      let query = this.$route.query;
      console.log(query);
      ajax
        .post("auth/login", this.user)
        .then(
          res => {
            store.dispatch("setUser", { user: res.data.user });
            store.dispatch("setToken", { token: res.data.token });
            store.dispatch("setStateMessage", "Successfully logged in");
            if (query.nextUrl) {
              this.$router.push(query.nextUrl);
            } else if (res.data.user.role === "ephi_user") {
              this.$router.push({ name: "Dashboard" });
            } else {
              this.$router.push({ name: "Home" });
            }
          },
          error => {
            store.dispatch("setStateMessage", error.response.data);
          }
        )
        .finally(() => {
          this.snackbar = true;
          this.loading = false;
        });
    }
  },
  computed: {
    getMessage() {
      return store.getters.getMessage;
    }
  }
};
</script>
