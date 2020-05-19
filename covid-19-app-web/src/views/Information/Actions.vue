<template>
  <v-container>
    <v-row>
      <h3 class="display-1 font-weight-thin mb-10" v-text="'What Then?'" />
    </v-row>
    <v-row>
      <v-col class="pr-12" md="5" cols="12">
        <v-fade-transition hide-on-leave>
          <v-skeleton-loader
            ref="skeleton"
            type="list-item-two-line,divider,list-item-two-line,divider,list-item-two-line,divider,list-item-two-line,divider"
            class="mx-auto mb-2"
            v-if="loaders.actions"
          />
          <p
            v-else-if="actions && actions.length === 0"
            class="text-center grey--text text--darken-1"
            v-text="'Found Nothing'"
          />
          <v-expansion-panels
            v-else
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
                @mouseenter="auto = false"
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
                  @mouseenter="auto = false"
                  @mouseleave="auto = true"
                />
                <v-img
                  class="my-5 mx-auto d-md-none"
                  :lazy-src="action.image"
                  :src="action.image"
                />
              </v-expansion-panel-content>
              <v-divider />
            </v-expansion-panel>
          </v-expansion-panels>
        </v-fade-transition>
      </v-col>
      <v-col md="7" cols="12" class="px-10 my-auto d-md-block d-none">
        <v-fade-transition hide-on-leave>
          <v-skeleton-loader
            ref="skeleton"
            type="image,image"
            class="mx-mb-12"
            v-if="loaders.actions"
          />
          <v-img
            v-else-if="actions && actions.length > 0"
            contain
            transition="fade-transition"
            class="my-5 mx-auto"
            max-height="350px"
            :lazy-src="server_url + actions[selectedAction].image"
            :src="server_url + actions[selectedAction].image"
          />
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import store from "@/store";

export default {
  data: () => {
    return {
      auto: true,
      interval: 0,
      value: 0,
      selectedAction: 0
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
  },
  created() {
    if (!this.actions) {
      store.dispatch("setActions");
    }
  },
  computed: {
    actions: () => store.getters.getActions,
    loaders: () => store.getters.getLearnLoaders
  }
};
</script>
