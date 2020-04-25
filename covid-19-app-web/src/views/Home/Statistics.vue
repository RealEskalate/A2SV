<template>
  <section class="statistics py-10">
    <v-card elevation="2">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Statistics</v-toolbar-title>
      </v-toolbar>

      <v-tabs fixed-tabs dark background-color="primary">
        <v-tab class="justify-start">
          <v-icon left>mdi-account</v-icon>
          Display Counts
        </v-tab>
        <v-tab class="justify-start">
          <v-icon left>mdi-account</v-icon>
          Display Rates
        </v-tab>
        <v-tab class="justify-start">
          <v-icon left>mdi-lock</v-icon>
          Compare Country Stats
        </v-tab>
        <v-tab class="justify-start">
          <v-icon left>mdi-access-point</v-icon>
          Compare Similar Diseases
        </v-tab>

        <v-tab-item>
          <display />
        </v-tab-item>
        <v-tab-item>
          <display mode="rates" />
        </v-tab-item>
        <v-tab-item>
          <country-compare />
        </v-tab-item>
        <v-tab-item>
          <disease-compare />
        </v-tab-item>
      </v-tabs>
    </v-card>
  </section>
</template>

<script>
import Display from "./Charts/Display.vue";
import CountryCompare from "./Charts/CountryCompare.vue";
import DiseaseCompare from "./Charts/DiseaseCompare.vue";

export default {
  components: {
    Display,
    CountryCompare,
    DiseaseCompare
  }
};
</script>
