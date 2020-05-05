<template>
  <v-container>
    <v-row>
      <h3 class="display-1 font-weight-thin mb-10" v-text="'What now?'" />
    </v-row>
    <v-row>
      <v-col class="pr-12" md="5" cols="12">
        <v-expansion-panels
          accordion
          flat
          v-model="selectedAction"
          style="min-height: 300px"
        >
          <v-expansion-panel v-for="(action, i) in actions" :key="i">
            <v-expansion-panel-header class="font-weight-bold" hide-actions>
              <div class="text--primary">
                <v-progress-circular :value="20" :size="20">
                </v-progress-circular>
                <h3
                  class="text--primary d-inline-block mx-3"
                  v-text="action.title"
                />
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-html="action.description" />
              <v-img class="my-5 mx-auto d-md-none" :src="action.image" />
            </v-expansion-panel-content>
            <v-divider />
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col md="7" cols="12" class="px-10 my-auto d-md-block d-none">
        <v-img
          contain
          transition="fade-transition"
          class="my-5 mx-auto"
          max-height="350px"
          :src="actions[selectedAction].image"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data: () => {
    return {
      selectedAction: 0,
      actions: [
        {
          title: "Don't Panic",
          description: `Pandemic does not refer to the lethality of a virus but to its transmission and geographical extension.
          So Stay mindful and be the help instead of creating more problems in fear.`,
          image: "/img/actions/mindfulness.svg"
        },
        {
          title: "Wash your Hands",
          description: `Respiratory viruses spread when mucus or droplets containing the virus
          get into your body through your eyes, nose or throat. Most often, this
          happens through your hands.`,
          image: "/img/actions/wash_hands.svg"
        },
        {
          title: "Keep Physical Distancing",
          description: `Limiting face-to-face contact with others is the best way to reduce
          the spread of the disease.`,
          image: "/img/actions/social_distancing.svg"
        },
        {
          title: "Learn Even More",
          description: `Go through our Learning paths to explore more about Covid 19.
          Weather you are a child, a teenager or a senior, we have something for you.`,
          image: "/img/actions/book_reading.svg"
        }
      ],
    }
  }
};
</script>
