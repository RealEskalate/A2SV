<template>
  <v-container>
    <v-row>
      <router-link align="center" to="/en/admin/symptoms">
        <v-btn color="primary">Go Back</v-btn>
      </router-link>
      <v-divider class="mx-6" vertical></v-divider>
      <p class="display-1 text--primary">Symptom Details</p>
    </v-row>
    <br /><hr />
    <v-row class="my-5">
      <v-col cols="12" sm="6">
        <v-card class="mx-auto" max-width="500">
          <v-card-text>
            <h1 class="d-inline-flex">Liya M.</h1>
            <v-chip class="float-right" color="red" text-color="white">High Risk</v-chip>
          </v-card-text>
          <v-list-item>
            <v-list-item-content>Id</v-list-item-content>
            <v-list-item-content class="align-end">34343242</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Last Update</v-list-item-content>
            <v-list-item-content class="align-end">07/20/2020 - 16:17:59 PST</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Status</v-list-item-content>
            <v-list-item-content class="align-end">Symptom Submitted</v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card class="mx-auto" max-width="500">
          <v-card-text>
            <h1>Symptoms - 7/20/2020</h1>
          </v-card-text>
          <v-list-item>
            <v-list-item-content>Source</v-list-item-content>
            <v-list-item-content class="align-end">Mobile</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Location</v-list-item-content>
            <v-list-item-content class="align-end">Addis Ababa</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Symptom 1</v-list-item-content>
            <v-list-item-content class="align-end">Cough</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Symptom 2</v-list-item-content>
            <v-list-item-content class="align-end">Sneezing</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Symptom 3</v-list-item-content>
            <v-list-item-content class="align-end">Chills</v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SymptomDetails"
};
</script>

<style scoped></style>
