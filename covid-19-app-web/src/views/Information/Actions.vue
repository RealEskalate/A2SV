<template>
  <v-container>
    <v-row>
      <h3 class="display-1 font-weight-thin mb-10" v-text="'What Then?'" />
    </v-row>
    <v-row>
      <v-col class="pr-12" md="5" cols="12">
        <v-expansion-panels
          accordion
          flat
          v-model="selectedAction"
          style="min-height: 300px"
        >
          <v-expansion-panel
            @change="value = 0"
            v-for="(action, i) in actions"
            :key="i"
          >
            <v-expansion-panel-header
              class="font-weight-bold"
              hide-actions
              @mouseover="auto = false"
              @mouseleave="auto = true"
            >
              <div class="text--primary">
                <v-progress-circular
                  :value="selectedAction === i ? value : 100"
                  :width="7"
                  :size="20"
                  color="primary"
                />
                <h3
                  class="text--primary d-inline-block mx-3"
                  v-text="action.title"
                />
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div
                v-html="action.description"
                @mouseover="auto = false"
                @mouseleave="auto = true"
              />
              <div
                v-if="action.learning"
                @mouseover="auto = false"
                @mouseleave="auto = true"
              >
                <v-chip
                  small
                  color="primary lighten-1"
                  target="_blank"
                  :key="ind"
                  v-for="(path, ind) in learningPaths"
                  class="mx-1 my-2"
                  :href="path.link"
                  v-text="path.text"
                />
              </div>
              <v-img
                class="my-5 mx-auto d-md-none"
                :lazy-src="action.image"
                :src="action.image"
              />
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
          :lazy-src="actions[selectedAction].image"
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
      auto: true,
      interval: 0,
      value: 0,
      selectedAction: 0,
      actions: [
        {
          title: "Stay Calm",
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
        }
        // {
        //   title: "Learn Even More",
        //   description: `Go through our Learning paths to explore more about Covid 19.
        //   Whatever age you are, we have something for you.`,
        //   image: "/img/actions/book_reading.svg",
        //   learning: true
        // }
      ],
      learningPaths: [
        {
          text: "For Kids",
          link:
            "https://docs.google.com/spreadsheets/d/1O19GX2m7a_OY-F0O0wx62wpacRDwbUWHA0JAplojpnE/edit#gid=0"
        },
        {
          text: "For Teenagers",
          link:
            "https://docs.google.com/spreadsheets/d/1O19GX2m7a_OY-F0O0wx62wpacRDwbUWHA0JAplojpnE/edit#gid=1774735521"
        },
        {
          text: "For Adults",
          link:
            "https://docs.google.com/spreadsheets/d/1O19GX2m7a_OY-F0O0wx62wpacRDwbUWHA0JAplojpnE/edit#gid=1786371463"
        },
        {
          text: "For Seniors",
          link:
            "https://docs.google.com/spreadsheets/d/1O19GX2m7a_OY-F0O0wx62wpacRDwbUWHA0JAplojpnE/edit#gid=683871385"
        }
      ]
    };
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  mounted() {
    this.interval = setInterval(() => {
      if (this.value >= 100) {
        this.selectedAction = (this.selectedAction + 1) % this.actions.length;
        return (this.value = 0);
      }
      if (this.auto) {
        this.value += 15;
      }
    }, 1000);
  }
};
</script>
