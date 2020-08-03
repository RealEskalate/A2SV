<template>
  <v-card flat color="transparent">
    <v-card-title class="primary--text text--darken-2" v-text="country.name" />
    <v-card-subtitle>
      <v-row>
        <v-col cols="10" class="my-0 py-0" v-text="$t('resourcesPer1K')" />
        <v-col cols="1" class="my-0 py-0">
          <v-icon
            class="justify-end"
            small
            color="primary darken-1"
            @click="dialog = true"
            v-text="mdiHelpCircleOutline"
          />
        </v-col>
      </v-row>
    </v-card-subtitle>
    <v-divider class="mx-4" />
    <v-list disabled dense color="transparent">
      <v-fade-transition hide-on-leave>
        <v-skeleton-loader
          v-if="graphLoaders.countryResources"
          ref="skeleton"
          type="list-item,list-item,list-item,list-item"
          class="mx-auto"
        />
        <v-card-subtitle
          v-else-if="!countryResources[country.slug]"
          v-text="$t('auth.foundNothing')"
        />
        <v-list-item-group v-else color="primary">
          <v-list-item
            v-for="(resource, i) in countryResources[country.slug]"
            :key="i"
          >
            <v-list-item-content>
              <span>
                <span v-text="resource.key" /> :
                <span class="grey--text" v-text="resource.value || $t('NA')" />
              </span>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-fade-transition>
    </v-list>
    <v-dialog v-model="dialog" width="500">
      <v-card class="px-2" shaped style="overflow: hidden">
        <v-icon
          style="position: absolute; right: 0; top: 0; z-index: 100"
          class="mt-3 mr-3"
          @click="dialog = false"
          v-text="mdiClose"
        />
        <v-fade-transition hide-on-leave>
          <div class="ma-2" v-if="graphLoaders.descriptions">
            <v-skeleton-loader ref="skeleton" type="article" class="mx-auto" />
          </div>
          <p
            class="text-muted text-center my-8"
            v-else-if="!description"
            v-text="$t('auth.foundNothing')"
          />
          <div v-else>
            <v-card-title
              class="headline mt-2"
              v-text="$t(description.title)"
            />
            <v-card-text v-text="description.description" />
            <v-card-text>
              <v-list dense>
                <h4 v-text="'Metrics'" />
                <v-list-item :key="i" v-for="(re, i) in description.fields">
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
          </div>
        </v-fade-transition>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import store from "@/store/index.js";
import { mdiClose, mdiHelpCircleOutline } from "@mdi/js";

export default {
  props: ["country"],
  data() {
    return {
      mdiClose,
      mdiHelpCircleOutline,
      dialog: false
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
    "$i18n.locale"(newValue) {
      store.dispatch("setCountryResources", {
        country: this.country.slug,
        lang: newValue
      });
    }
  },
  methods: {
    fetchCountryResources() {
      if (!this.countryResources[this.country.slug])
        store.dispatch("setCountryResources", {
          country: this.country.slug,
          lang: this.$i18n.locale
        });
    }
  },
  computed: {
    graphLoaders: () => store.getters.getGraphLoaders,
    countryResources: () => store.getters.getCountryResources,
    descriptions: () => store.getters.getGraphDescriptions,
    description() {
      if (this.descriptions) {
        return this.descriptions["Available Resources"];
      }
      return null;
    }
  }
};
</script>
