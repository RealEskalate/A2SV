<template>
  <v-container>
    <v-row>
      <h3
              class="display-1 font-weight-thin mb-10"
              v-text="$t('statesTransitionTitle')"
      />
    </v-row>
    <v-card shaped style="overflow: hidden" outlined>
      <v-row>
        <v-col cols="12" md="7" class="pl-md-12 py-md-9 px-8 py-5">
          <img-svg
            style="max-height: 600px"
            class="col-12 py-md-12 px-md-12 px-5 py-3 grey lighten-4 v-card--shaped shadow-in"
          />
        </v-col>
        <v-col cols="12" md="5" class="pr-md-12 py-md-8 px-8 py-5">
          <h2
                  class="mb-5 primary--text"
                  v-text="$t('statesTransitionSubtitle')"
          />
          <v-list disabled>
            <v-skeleton-loader
              ref="skeleton"
              type="list-item-three-line,list-item-three-line,list-item-three-line,list-item-three-line,list-item-three-line,list-item-three-line"
              class="mx-auto mb-2"
              v-if="loaders.states"
            />
            <p
              v-else-if="states && states.length === 0"
              class="text-center grey--text text--darken-1"
              v-text="'Found Nothing'"
            />
            <v-list-item-group v-else color="primary">
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
  created() {
    if (!this.states) {
      store.dispatch("setStates", {
        lang: this.$i18n.locale === "am" ? "Amharic" : "English"
      });
    }
  },
  computed: {
    states: () => store.getters.getStates,
    loaders: () => store.getters.getLearnLoaders
  }
};
</script>
