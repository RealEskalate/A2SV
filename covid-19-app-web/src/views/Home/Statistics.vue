<template>
  <section class="statistics py-10">
    <v-card elevation="2">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Statistics</v-toolbar-title>
      </v-toolbar>

      <v-tabs centered fixed-tabs dark background-color="primary">
        <v-tab class="justify-start">
          <v-icon left>mdi-numeric</v-icon>
          Display Counts
        </v-tab>
        <v-tab class="justify-start">
          <v-icon left>mdi-percent-outline</v-icon>
          Display Rates
        </v-tab>
        <v-tab class="justify-start">
          <v-icon left>mdi-map-marker</v-icon>
          Compare Countries
        </v-tab>
        <v-tab class="justify-start">
          <v-icon left>mdi-virus-outline</v-icon>
          Compare Similar Diseases
        </v-tab>

        <v-tab-item style="height: 750px">
          <display mode="counts" y_label="People" />
        </v-tab-item>
        <v-tab-item style="height: 750px">
          <display mode="rates" y_label="Percent" />
        </v-tab-item>
        <v-tab-item style="height: 750px">
          <country-compare />
        </v-tab-item>
        <v-tab-item style="height: 750px">
          <disease-compare x_axis_type="category" />
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
