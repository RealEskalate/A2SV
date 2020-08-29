<template>
  <v-container>
    <h2 class="mx-auto text-center">Invite as many admins you can</h2>
    <v-snackbar top color="primary" v-model="snackbar" :timeout="5000">
      <span class="ma-2" v-html="getMessage" />
      <v-btn text icon x-small color="white" @click="snackbar = false">
        <v-icon v-text="mdiCloseCircleOutline" />
      </v-btn>
    </v-snackbar>
    <v-form
      v-for="(textField, i) in textFields"
      :key="i"
      class="text-fields-row col-md-5 mx-auto align-center col-sm-8"
      v-model="form"
    >
      <v-text-field
        :label="textField.label"
        v-model="textField.value"
        :rules="emailRules"
      />

      <v-btn icon @click="remove(i)" class="mx-auto ">
        <v-icon color="red" class="text--darken-2">{{
          mdiDeleteCircle
        }}</v-icon>
      </v-btn>
    </v-form>
    <div class="mx-auto align-center align-content-center">
      <v-btn large @click="add" icon class="d-block mx-auto">
        <v-icon large color="blue" class="text--darken-2">
          {{ mdiPlusCircle }}</v-icon
        >
      </v-btn>
      <v-btn
        large
        @click="sendInvites"
        :disabled="!form"
        class="primary btn-lg d-block mt-2 mx-auto"
      >
        <v-icon left> {{ mdiEmailSend }} </v-icon>
        Send Invites</v-btn
      >
    </div>
  </v-container>
</template>

<script>
import {
  mdiCloseCircleOutline,
  mdiDeleteCircle,
  mdiEmailSend,
  mdiPlusCircle
} from "@mdi/js";
import ajax from "../../auth/ajax";
import store from "@/store/";

export default {
  name: "InviteAdmin",
  created() {
    this.add();
  },
  data() {
    return {
      mdiCloseCircleOutline,
      mdiDeleteCircle,
      mdiEmailSend,
      mdiPlusCircle,
      textFields: [],
      snackbar: false,
      form: false,
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },

  methods: {
    add() {
      this.textFields.push({
        label: "Email address",
        value: ""
      });
    },
    sendInvites() {
      let len = this.textFields.length;
      let body = {
        emails: []
      };
      for (let i = 0; i < len; i++) {
        body.emails.push(this.textFields[i]["value"]);
      }
      ajax
        .post(`${this.server_url}/api/user/invite-multiple`, body)
        .then(
          () => {
            store.dispatch(
              "setStateMessage",
              "Invitation has been sent successfully"
            );
          },
          err => {
            let error = err.response.data;
            let emails = "";
            for (let i = 0; i < error.emails.length; i++) {
              emails += "<br>" + error.emails[i];
            }
            store.dispatch("setStateMessage", err.response.data.error + emails);
          }
        )
        .finally(() => {
          this.snackbar = true;
          this.loading = false;
        });
    },
    remove(index) {
      this.textFields.splice(index, 1);
    }
  },
  computed: {
    getMessage() {
      return store.getters.getMessage;
    }
  }
};
</script>

<style scoped>
.text-fields-row {
  display: flex;
}
</style>
