<template>
  <v-card flat>
    <v-list disabled dense>
      <v-card-title
        class="primary--text text--darken-2"
        v-text="country.name"
      />
      <v-card-subtitle>
        Resources per 1K people
      </v-card-subtitle>
      <v-divider class="mx-4" />
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
  </v-card>
</template>

<script>
import store from "@/store/index.js";

export default {
  props: ["country"],
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
