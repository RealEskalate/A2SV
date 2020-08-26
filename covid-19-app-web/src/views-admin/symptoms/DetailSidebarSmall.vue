<template>
  <div class="text-center">
    <v-bottom-sheet
      v-model="sheet"
      :scrollable="true"
      overlay-color="primary"
      overlay-opacity="0.1"
    >
      <div class="text-center" style="background-color: white">
        <v-btn class="my-2" text color="error" @click="sheet = !sheet"
          >close</v-btn
        >
        <v-card class="mx-auto" outlined>
          <v-card-text>
            <h3 class="d-inline-flex text--primary">{{ detail.name }}</h3>
            <v-chip
              class="float-right"
              small
              :color="getColor(detail.risk)"
              text-color="white"
            >
              {{ detail.risk }} RISK</v-chip
            >
          </v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>Gender</v-list-item-content>
              <v-list-item-action-text class="align-start">
                {{ detail.gender }}
              </v-list-item-action-text>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>Last Update</v-list-item-content>
              <v-list-item-action-text class="align-start">
                {{ detail.lastUpdate }}
              </v-list-item-action-text>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>Status</v-list-item-content>
              <v-list-item-action-text class="align-start">
                {{ detail.status }}
              </v-list-item-action-text>
            </v-list-item>
          </v-list>
          <v-card-text>
            <h3 class="text--primary">Symptoms</h3>
          </v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>Location</v-list-item-content>
              <v-list-item-action-text class="align-start">
                {{ detail.location }}
              </v-list-item-action-text>
            </v-list-item>
            <v-list-item v-for="(symptom, i) in detail.allSymptoms" :key="i">
              <v-list-item-content>Symptom {{ i + 1 }}</v-list-item-content>
              <v-list-item-action-text class="text-left left">
                {{ symptom }}
              </v-list-item-action-text>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
  props: ["sheet", "detail", "sidebar"],
  methods: {
    getColor(risk) {
      if (risk.toLowerCase() === "low") {
        return "#009c4d";
      } else if (risk.toLowerCase() === "medium") {
        return "#ffa64e";
      } else if (risk.toLowerCase() === "high") {
        return "#ff6767";
      }
    }
  }
};
</script>
