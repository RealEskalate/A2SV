<template>
  <v-row>
    <v-col cols="12" sm="6" md="4">
      <v-skeleton-loader
          :loading="getSymptomStatLoaders.total"
          height="100"
          type="list-item-two-line"
        >
          <v-card class="mx-auto" :flat="true" max-width="344" >
        <v-card-text>
          <p class="display-1 text--primary">{{getTotalSymptoms}}</p>
          <div class="text--primary">{{title_one}}</div>
        </v-card-text>
      </v-card>
        </v-skeleton-loader>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-skeleton-loader
          :loading="getSymptomStatLoaders.total"
          height="100"
          type="list-item-two-line"
        >
      <v-card class="mx-auto" :flat="true" max-width="344">
        <v-card-text>
          <p class="display-1 text--primary">{{getMostCommonSymptom}} | {{Math.round((getMostCommonSymptomCount*100/getTotalSymptoms)*100)/100}}%</p>
          <div class="text--primary">{{title_two}}</div>
        </v-card-text>
      </v-card>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-skeleton-loader
          :loading="getSymptomStatLoaders.totalPeople"
          height="100"
          type="list-item-two-line"
        >
      <v-card class="mx-auto" :flat="true" max-width="344">
        <v-card-text>
          <p class="display-1 text--primary">{{getTotalPeoplesWithSymptoms}}</p>
          <div class="text--primary">{{title_three}}</div>
        </v-card-text>
      </v-card>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "HighLevelStatistics",
  components: {
    
  },
  data() {
    return {
      title_one: "TOTAL SYMPTOMS REGISTERED",
      title_two: "MOST COMMON SYMPTOMS",
      title_three: "PEOPLE WITH SYMPTOMS"
    };
  },
  methods: {
    ...mapActions([
      "fetchTotalSymptoms",
      "fetchTotalPeoplesWithSymptoms"
    ])
  },
  computed: {
    ...mapGetters([
      "getTotalSymptoms",
      "getMostCommonSymptom",
      "getMostCommonSymptomCount",
      "getTotalPeoplesWithSymptoms",
      "getSymptomStatLoaders"
    ])
  },
  created() {
    this.fetchTotalSymptoms();
    this.fetchTotalPeoplesWithSymptoms();
  }
};
</script>