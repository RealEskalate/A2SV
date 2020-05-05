<!--suppress HtmlUnknownTarget -->
<template>
  <v-content class="information">
    <section class="my-12 text-justify">
      <v-container>
        <v-row>
          <h3
            class="display-1 font-weight-thin mb-10"
            v-text="'Learn About Covid-19'"
          />
          <carousel-3d
            :perspective="20"
            :inverse-scaling="50"
            :space="350"
            height="300"
            autoplay
            :autoplay-timeout="5000"
            width="400"
          >
            <slide
              :key="i"
              v-for="(item, i) in information"
              :index="i"
              style="height: auto"
            >
              <v-card class="mx-auto">
                <v-img
                  class="white--text align-end"
                  height="200px"
                  :src="item.image"
                >
                  <v-card-title
                    class="text-truncate mr-3"
                    v-text="item.title"
                  />
                </v-img>

                <v-card-subtitle
                  class="pb-0 text-truncate"
                  v-text="item.description"
                />

                <v-card-actions>
                  <v-btn
                    color="primary"
                    text
                    @click.stop="
                      () => {
                        dialog = true;
                        dialogData = item;
                      }
                    "
                  >
                    Read More
                  </v-btn>
                </v-card-actions>
              </v-card>
            </slide>
          </carousel-3d>
        </v-row>
      </v-container>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-img height="150px" :src="dialogData.image" />
          <v-card-title class="headline" v-text="dialogData.title" />
          <v-card-text v-text="dialogData.description" />
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="dialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </section>
    <section class="my-12 text-justify">
      <v-container>
        <v-row>
          <h3
            class="display-1 font-weight-thin mb-10"
            v-text="'What now?'"
          />
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
                  <v-img
                    class="my-5 mx-auto d-md-none"
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
              :src="actions[selectedAction].image"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>
    <section class="my-12 text-justify">
      <states />
    </section>
  </v-content>
</template>

<script>
import States from "@/views/Home/States.vue";
import { Carousel3d, Slide } from "vue-carousel-3d";

export default {
  name: "Information",
  components: {
    States,
    Slide,
    "carousel-3d": Carousel3d
  },
  data: function() {
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
      dialogData: {
        title: null,
        description: null,
        image: null
      },
      dialog: false,
      information: [
        {
          title: "What is Covid-19",
          description:
            "Man doesn’t daily understand any master — but the lover is what disturbs.",
          image: "https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        },
        {
          title: "How powerful is it",
          description:
            "Man doesn’t daily understand any master — but the lover is what disturbs.",
          image: "https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        },
        {
          title: "Grandis bromium sed mire convertams vox est.",
          description:
            "Man doesn’t daily understand any master — but the lover is what disturbs.",
          image: "https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        },
        {
          title: "Grandis bromium sed mire convertams vox est.",
          description:
            "Man doesn’t daily understand any master — but the lover is what disturbs.",
          image: "https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        },
        {
          title: "Grandis bromium sed mire convertams vox est.",
          description:
            "Man doesn’t daily understand any master — but the lover is what disturbs.",
          image: "https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        }
      ]
    };
  }
};
</script>
