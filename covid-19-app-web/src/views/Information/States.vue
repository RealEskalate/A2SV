<template>
  <v-container>
    <v-row>
      <h3
        class="display-1 font-weight-thin mb-10"
        v-text="'States of Transition'"
      />
    </v-row>
    <v-card shaped style="overflow: hidden" outlined>
      <v-row>
        <v-col cols="12" md="7" class="pl-md-12 py-md-9 px-8 py-5">
          <img-svg
            class="col-12 py-md-12 px-md-12 px-5 py-3 grey lighten-4 v-card--shaped in-shadow"
          />
        </v-col>
        <v-col cols="12" md="5" class="pr-md-12 py-md-8 px-8 py-5">
          <h2 class="mb-5 primary--text" v-text="'What phases are there?'" />
          <v-list disabled>
            <v-list-item-group color="primary">
              <v-list-item
                v-for="(state, i) in states"
                :key="i"
                dense
                class="px-0"
              >
                <v-list-item-content>
                  <h4 class="mb-2 primary--text" v-text="state.title" />
                  <p class="grey--text darken-3" v-html="state.description" />
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import ImageSvg from "./ImageSvg";
import store from "@/store";

export default {
  components: {
    "img-svg": ImageSvg
  },
  computed: {
    states() {
      return store.getters.getStates;
    }
  }
};
</script>
