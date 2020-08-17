<template class="mx-auto">
  <v-row align="center" justify="center" style="height: 100%">
    <v-col cols="12" sm="8" md="4">
      <v-card class="overflow-hidden" shaped outlined>
        <v-snackbar top color="primary" v-model="snackbar" :timeout="5000">
          <h4 class="ma-2" v-text="getMessage" />
          <v-btn text icon x-small color="white" @click="snackbar = false">
            <v-icon v-text="mdiCloseCircleOutline" />
          </v-btn>
        </v-snackbar>

        <v-toolbar class="shadow-sm  mb-3" color="primary" dark flat>
          <v-toolbar-title v-text="$t('auth.signUp')" />
        </v-toolbar>

        <v-card-text>
          <v-form class="mx-4 my-4" v-model="valid" ref="form">
            <v-text-field
              dense
              outlined
              prefix="@"
              class="v-card--shaped"
              v-model="user.username"
              :rules="rules.username"
              :label="$t('auth.username')"
              required
            />
            <v-row>
              <v-col class="py-0">
                <v-select
                  dense
                  outlined
                  class="v-card--shaped"
                  :items="age_group"
                  :label="$t('auth.ageGroup')"
                  v-model="user.age_group"
                />
              </v-col>
              <v-col class="py-0">
                <v-select
                  dense
                  outlined
                  class="v-card--shaped"
                  :items="gender"
                  :item-text="$t(item)"
                  :label="$t('auth.gender')"
                  v-model="user.gender"
                />
              </v-col>
            </v-row>

            <v-text-field
              dense
              outlined
              class="v-card--shaped"
              :append-icon="!show_password ? mdiEyeOff : mdiEye"
              :rules="rules.password"
              v-model="user.password"
              :label="$t('auth.password')"
              :type="show_password ? 'text' : 'password'"
              required
              ref="password"
              @click:append="show_password = !show_password"
            />
            <v-text-field
              dense
              outlined
              class="v-card--shaped"
              :append-icon="!show_password ? mdiEyeOff : mdiEye"
              :rules="match"
              v-model="user.confirm_password"
              :label="$t('auth.passwordConfirmation')"
              :type="show_password ? 'text' : 'password'"
              required
              @click:append="show_password = !show_password"
            />
            <v-col md="12" cols="12">
              <v-checkbox class="d-inline" id="c">
                <template v-slot:label>
                  <div>
                    I agree to
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <a
                          target="_blank"
                          href="https://tracksym.app/en/privacy-policy"
                          @click.stop
                          v-on="on"
                        >
                          Tracksym's terms, privacy policy
                        </a>
                      </template>
                      Opens in new window
                    </v-tooltip>
                    and E-sign consent.
                  </div>
                </template>
              </v-checkbox>
            </v-col>
            <div class="my-2 mx-auto align-center align-content-center">
              <v-btn
                :disabled="!valid"
                color="primary"
                class="d-block mx-auto v-card--shaped"
                @click="submit"
                :loading="loading"
              >
                {{ $t("auth.signUp") }}
              </v-btn>
              <v-btn
                text
                small
                class="d-block mx-auto my-2"
                @click="$router.push('login')"
              >
                {{ $t("auth.goToLogin") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import store from "@/store/";
import ajax from "../../auth/ajax";
import { Rules, User } from "../../views/Auth/user";
import { mdiCloseCircleOutline, mdiEye, mdiEyeOff } from "@mdi/js";

export default {
  mounted() {
    this.user["signature"] = this.$route.query.signature;
    console.log(this.user);
  },
  data() {
    return {
      mdiEye,
      mdiEyeOff,
      mdiCloseCircleOutline,
      valid: false,
      snackbar: false,
      show_password: false,
      loading: false,
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
      this.loading = true;
      ajax
        .post("/api/user/create-invited-user", this.user)
        .then(
          () => {
            store.dispatch("setStateMessage", "User successfully created");
            this.$router.push("login");
          },
          error => {
            store.dispatch("setStateMessage", error.message);
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
