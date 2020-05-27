<template>
  <v-tour
    name="appTour"
    :steps="tour_steps"
    :options="tour_options"
    :callbacks="tour_callbacks"
  >
    <template slot-scope="tour">
      <template v-for="(step, index) of tour.steps">
        <v-fade-transition hide-on-leave :key="index">
          <v-step
            class="px-3 py-2 white black--text shadow-sm"
            style="border-radius: 20px 3px 20px 3px"
            v-if="tour.currentStep === index"
            :step="step"
            :previous-step="tour.previousStep"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :skip="tour.skip"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            :labels="tour.labels"
            :highlight="tour.highlight"
          >
            <template slot="header" v-if="step.header">
              <h3
                class="ma-2 font-weight-regular primary--text"
                v-html="step.header"
              />
              <v-divider />
            </template>
            <template slot="content" v-if="step.content">
              <p
                style="font-size: 0.9em"
                class="pa-3 pb-1 font-weight-light grey--text text--darken-2"
                v-html="step.content"
              />
            </template>
            <template v-slot:actions>
              <div class="ma-3">
                <v-btn
                  v-if="!tour.isLast"
                  class="mr-1"
                  small
                  text
                  color="primary"
                  @click="tour.skip"
                  v-text="tour.labels.buttonSkip"
                />
                <v-btn
                  v-if="tour.isFirst"
                  class="mr-1 v-card--shaped"
                  small
                  depressed
                  color="primary"
                  @click="tour.nextStep"
                  v-text="tour.labels.buttonStart"
                />
                <v-btn
                  v-if="!tour.isFirst"
                  class="mr-1"
                  small
                  text
                  color="primary"
                  @click="tour.previousStep"
                  v-text="tour.labels.buttonPrevious"
                />
                <v-btn
                  v-if="!tour.isFirst && !tour.isLast"
                  class="mr-1 v-card--shaped"
                  small
                  depressed
                  color="primary"
                  @click="tour.nextStep"
                  v-text="tour.labels.buttonNext"
                />
                <v-btn
                  v-if="tour.isLast"
                  class="mr-1 v-card--shaped"
                  small
                  depressed
                  color="primary"
                  @click="tour.stop"
                  v-text="tour.labels.buttonStop"
                />
              </div>
            </template>
          </v-step>
        </v-fade-transition>
      </template>
    </template>
  </v-tour>
</template>

<script>
export default {
  methods: {
    onNewSelect() {
      setTimeout(function() {
        window.scrollBy(0, -200);
      }, 500);
    }
  },
  data() {
    return {
      tour_callbacks: {
        onPreviousStep: this.onNewSelect,
        onNextStep: this.onNewSelect
      },
      tour_options: {
        useKeyboardNavigation: true,
        highlight: true,
        labels: {
          buttonStart: "Start Tour",
          buttonSkip: "Skip",
          buttonPrevious: "Previous",
          buttonNext: "Next",
          buttonStop: "Finish"
        }
      },
      tour_steps: [
        {
          target: '[data-v-step="0"]',
          header: "TrackSym",
          content: `Take a quick tour to understand how to use the website`,
          params: {
            placement: "bottom"
          }
        },
        {
          target: '[data-v-step="1"]',
          header: "Graphs",
          content: `Go through the tabs to visit different graphs. Click on the question mark to learn more about the graph.`,
          params: {
            placement: "right"
          }
        },
        {
          target: '[data-v-step="2"]',
          header: "Filters",
          content: `Select the required parameters to filter data by and observe the the dynamic data`,
          params: {
            placement: "right"
          }
        },
        {
          target: '[data-v-step="3"]',
          header: "Ethiopia",
          content: `Visit the Ethiopia section for local statistics and more.`,
          params: {
            placement: "top"
          }
        },
        {
          target: '[data-v-step="4"]',
          header: `Language`,
          content: `Switch between different languages`
        }
      ]
    };
  }
};
</script>

<style>
.v-tour__target--highlighted {
  border: #009ce5 solid 2px !important;
  background: white;
  padding-left: 10px;
  padding-right: 10px;
  offset-start: 100px;
  border-radius: 15px 3px 15px 3px;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.3) !important;
}
</style>
