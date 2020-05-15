<!--suppress HtmlUnknownTarget -->
<template>
  <div class="information">
    <section class="mb-12 text-justify">
      <v-container>
        <v-row>
          <h3
            class="display-1 font-weight-thin mb-10"
            v-text="'Learn About Covid-19'"
          />
          <carousel-3d
            style="min-height: 300px"
            :border="0"
            :perspective="20"
            :inverse-scaling="50"
            :space="350"
            autoplay
            :autoplay-timeout="5000"
            width="400"
          >
            <slide
              :key="i"
              v-for="(item, i) in information"
              :index="i"
              style="height: auto; background-color: transparent"
            >
              <v-card class="mx-auto" outlined shaped>
                <v-img
                  class="white--text align-end"
                  height="200px"
                  :lazy-src="item.image"
                >
                  <v-card-title
                    class="text-truncate mr-3"
                    v-text="item.title"
                  />
                </v-img>

                <v-card-subtitle
                  class="pb-0 text-truncate"
                  v-text="htmlToText(item.description)"
                />

                <v-card-actions>
                  <v-btn
                    text
                    color="primary"
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
        <v-card outlined shaped>
          <v-img
            height="150px"
            :lazy-src="selectedInfo.image"
            :src="selectedInfo.image"
          />
          <v-card-title class="headline my-2" v-text="selectedInfo.title" />
          <v-card-text class="text-justify" v-html="selectedInfo.description" />
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
      <actions class="my-12" />
    </section>
    <section class="my-12 text-justify">
      <states class="my-12" />
    </section>
    <section class="my-12 text-justify">
      <learning-paths class="my-12" />
    </section>
  </div>
</template>

<script>
import States from "./States.vue";
import Actions from "./Actions";
import LearningPaths from "./LearningPaths.vue";
import { Carousel3d, Slide } from "vue-carousel-3d";
import store from "@/store";

export default {
  name: "Information",
  components: {
    Actions,
    States,
    LearningPaths,
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
      dialog: false
    };
  },
  computed: {
    information: () => store.getters.getInformation
  }
};
</script>
