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
        {{ $t("auth.changePassword") }}
      </h2>
      <v-text-field
        :label="$t('auth.password')"
        v-model="user.password"
        class="col-md-8 mx-auto"
        :rules="rules.password"
      />
      <v-btn class="primary col-md-4 mx-auto d-flex" @click="submit">
        {{ $t("auth.saveChanges") }}</v-btn
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
        signature: null,
        password: null
      },
      rules: Rules
    };
  },
  methods: {
    submit() {
      this.loading = true;
      ajax
        .post("user/change-password", this.user)
        .then(
          res => {
            store.dispatch(
              "setStateMessage",
              "Password is changed successfully"
            );
            console.log(res);
          },
          error => {
            store.dispatch("setStateMessage", error.message);
            console.log(error);
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
