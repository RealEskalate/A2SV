<template>
  <v-container>
    <h2 class="mx-auto text-center">Invite as many admins you can</h2>

    <form
      v-for="(textField, i) in textFields"
      :key="i"
      class="text-fields-row col-md-5 mx-auto align-center col-sm-8"
    >
      <v-text-field
        :label="textField.label"
        v-model="textField.value"
        :rules="emailRules"
      ></v-text-field>

      <v-btn icon @click="remove(i)" class="mx-auto ">
        <v-icon color="red" class="text--darken-2">{{
          mdiDeleteCircle
        }}</v-icon>
      </v-btn>
    </form>
    <div class="mx-auto align-center align-content-center">
      <v-btn large @click="add" icon class="d-block mx-auto">
        <v-icon large color="blue" class="text--darken-2">
          {{ mdiPlusCircle }}</v-icon
        >
      </v-btn>
      <v-btn
        large
        @click="sendInvites"
        class="primary btn-lg d-block mt-2 mx-auto"
      >
        <v-icon left> {{ mdiEmailSend }} </v-icon>
        Send Invites</v-btn
      >
    </div>
  </v-container>
</template>

<script>
import { mdiDeleteCircle, mdiPlusCircle, mdiEmailSend } from "@mdi/js";
import ajax from "../../auth/ajax";

export default {
  name: "InviteAdmin",
  created() {
    this.add();
  },
  data() {
    return {
      mdiDeleteCircle,
      mdiEmailSend,
      mdiPlusCircle,
      textFields: [],
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
        body.push(this.textFields[i]["value"]);
      }
      ajax
        .post(`${process.env.VUE_APP_BASE_URL}/api/user/invite-multiple`, body)
        .then(
          res => {
            console.log(res);
          },
          err => {
            console.log(err);
          }
        );
    },
    remove(index) {
      this.textFields.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.text-fields-row {
  display: flex;
}
</style>
