<template>
  <v-card flat>
    <v-card-title class="primary--text text--darken-2" v-text="country.name" />
    <v-card-subtitle>
      <v-row>
        <v-col cols="10" class="my-0 py-0">
          Resources per 1K people
        </v-col>
        <v-col cols="1" class="my-0 py-0">
          <v-icon
                  class="justify-end"
                  small
                  color="primary darken-1"
                  @click="dialog = true">
            {{ mdiHelpCircleOutline }}
          </v-icon>
        </v-col>
      </v-row>
    </v-card-subtitle>
    <v-divider class="mx-4" />
    <v-list disabled dense>
      <v-card-subtitle
        v-if="!countryResources[country.name]"
        v-text="'Found Nothing'"
      />
      <v-list-item-group v-else color="primary">
        <v-list-item
          v-for="(resource, i) in countryResources[country.name]"
          :key="i"
        >
          <v-list-item-content>
            <span>
              <span v-text="resource.key" /> :
              <span class="grey--text" v-text="resource.value || 'N/A'" />
            </span>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-dialog v-model="dialog" width="400">
      <v-card class="px-2" shaped style="overflow: hidden">
        <v-icon
          style="position: absolute; right: 0; top: 0"
          class="mt-3 mr-3"
          @click="dialog = false"
        > {{ mdiClose }}
        </v-icon>
        <v-card-title class="headline mt-2" v-text="description.title" />
        <v-card-text v-text="description.content" />
        <v-card-text>
          <v-list dense>
            <h4 v-text="'Metrics'" />
            <v-list-item :key="i" v-for="(re, i) in description.resources">
              <p>
                <span v-text="re.name + ':  '" />
                <span
                  class="grey--text text--darken-1 font-italic"
                  v-text="re.explanation"
                />
              </p>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import store from "@/store/index.js";
  import {mdiClose, mdiHelpCircleOutline} from "@mdi/js";

  export default {
  props: ["country"],
  data() {
    return {
      mdiClose, mdiHelpCircleOutline,
      dialog: false,
      description: {
        title: "Available Resources - " + this.country.name,
        content: "describing what they are doing",
        resources: [
          { name: "Hospital Beds", explanation: "this explanation" },
          { name: "this other resource", explanation: "this other explanation" }
        ]
      }
    };
  },
  mounted() {
    this.fetchCountryResources();
  },
  watch: {
    country: {
      handler() {
        this.fetchCountryResources();
      }
    },
    countryResources: {
      deep: true,
      handler() {
        this.fetchCountryResources();
      }
    }
  },
  computed: {
    countryResources: () => store.getters.getCountryResources
  },
  methods: {
    fetchCountryResources() {
      if (!this.countryResources[this.country.name])
        store.dispatch("setCountryResources", { country: this.country.name });
    }
  }
};
</script>
