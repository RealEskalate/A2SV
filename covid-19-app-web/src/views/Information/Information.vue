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
                        selectedInfo = item;
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
          <v-img height="150px" :src="selectedInfo.image" />
          <v-card-title class="headline" v-text="selectedInfo.title" />
          <v-card-text v-text="selectedInfo.description" />
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </section>
    <section class="my-12 text-justify">
      <actions />
    </section>
    <section class="my-12 text-justify">
      <states />
    </section>
  </v-content>
</template>

<script>
import States from "@/views/Home/States.vue";
import { Carousel3d, Slide } from "vue-carousel-3d";
import Actions from "../Home/Actions";

export default {
  name: "Information",
  components: {
    Actions,
    States,
    Slide,
    "carousel-3d": Carousel3d
  },
  data: function() {
    return {
      selectedInfo: {
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
