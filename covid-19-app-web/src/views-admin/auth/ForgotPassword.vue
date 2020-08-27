<template>
  <v-card
    outlined
    class="align-content-center align-center mx-auto container py-5"
  >
    <v-snackbar top color="primary" v-model="snackbar" :timeout="5000">
      <span class="ma-2" v-text="getMessage" />
      <v-btn text icon x-small color="white" @click="snackbar = false">
        <v-icon v-text="mdiCloseCircleOutline" />
      </v-btn>
    </v-snackbar>

    <v-form v-model="valid">
      <h2 class="text-center font-weight-thin">
        {{ $t("auth.forgotPassword") }}
      </h2>
      <v-text-field
        :label="$t('contactUs.email')"
        v-model="user.email"
        class="col-md-8 mx-auto"
        :rules="rules.email"
      />
      <v-btn
        class="primary col-md-4 mx-auto d-flex"
        :disabled="!valid"
        @click="submit"
      >
        {{ $t("contactUs.send") }}</v-btn
      >
    </v-form>
  </v-card>
</template>

<script>
import { Rules } from "../../views/Auth/user";
import ajax from "../../auth/ajax";
import store from "@/store/";
import { mdiCloseCircleOutline } from "@mdi/js";

export default {
  name: "ChangePassword",
  mounted() {
    this.user.signature = this.$route.query.signature;
  },
  data() {
    return {
      mdiCloseCircleOutline,
      valid: false,
      user: {
        email: null
      },
      rules: Rules
    };
  },
  methods: {
    submit() {
      console.log(1);
      this.loading = true;
      ajax
        .post("user/reset-password ", this.user)
        .then(
          () => {
            store.dispatch("setStateMessage", "Email is sent successfully");
          },
          error => {
            store.dispatch("setStateMessage", error.message);
          }
        )
        .finally(() => {
          this.snackbar = true;
          this.loading = false;
        });
    },
    computed: {
      getMessage() {
        return store.getters.getMessage;
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 30rem;
}
.container {
  color: #455d7a;
}
</style>
