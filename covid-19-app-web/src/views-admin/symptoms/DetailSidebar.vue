<template>
    <v-navigation-drawer
      width="450"
      v-model="sidebar"
      right
      absolute
      bottom
      temporary
      color="#F5F6F7"
      class="shadow-sm pb-9"
      style="z-index: 3"
    >
      <v-card>
        <v-row>
          <v-icon large class="ma-2 ml-6" @click="sidebar=false">{{mdiClose}}</v-icon>
          <p class="mx-auto d-inline-flex display-1 text--primary">Symptom Details</p>
        </v-row>
      </v-card>
      <v-container>
        <v-card class="mx-auto mt-5">
          <v-card-text>
            <h1 class="d-inline-flex text--primary"> {{detail.name}} </h1>
            <v-chip class="float-right" color="red" text-color="white"> {{detail.risk}} Risk</v-chip>
          </v-card-text>
          <v-list-item>
            <v-list-item-content>Gender</v-list-item-content>
            <v-list-item-content class="align-end"> {{detail.gender}} </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Last Update</v-list-item-content>
            <v-list-item-content class="align-end"> {{detail.lastUpdate}} </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>Status</v-list-item-content>
            <v-list-item-content class="align-end"> {{detail.status}} </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-card class="mx-auto mt-10">
          <v-card-text>
            <h1 class="text--primary">Symptoms</h1>
          </v-card-text>
          <!-- <v-list-item>
            <v-list-item-content>Source</v-list-item-content>
            <v-list-item-content class="align-end ml-0">Mobile</v-list-item-content>
          </v-list-item> -->
          <v-list-item>
            <v-list-item-content>Location</v-list-item-content>
            <v-list-item-content class="align-end"> {{detail.location}} </v-list-item-content>
          </v-list-item>
          <v-list-item v-for="(symptom, i) in detail.allSymptoms" :key="i">
            <v-list-item-content>Symptom {{i+1}}</v-list-item-content>
            <v-list-item-content class="align-end"> {{symptom}} </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-container>
    </v-navigation-drawer>
</template>

<script>
import { mdiClose } from "@mdi/js";

export default {
    name: "DetailSidebar",
    props: ["detail", "sidebar"],
    data() {
        return {
            mdiClose
        }
    }
}
</script>