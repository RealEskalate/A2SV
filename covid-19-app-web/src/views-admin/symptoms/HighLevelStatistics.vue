<template>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="(stat, i) in highLevelStats" :key="i">
        <v-card class="mx-auto" :flat="true" max-width="344">
          <v-card-text>
            <p class="display-1 text--primary">{{stat.statistic}}</p>
            <div class="text--primary">{{stat.description}}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
</template>

<script>
import { highLevelStats } from "./dummy";

export default {
    name: "HighLevelStatistics",
    data() {
        return {
            highLevelStats: highLevelStats
        };
    }
}
</script>