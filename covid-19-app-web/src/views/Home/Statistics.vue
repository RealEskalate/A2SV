<template>
  <section class="statistics pb-10">
    <v-container>
      <v-row>
        <v-col>
          <h3
            class="display-1 font-weight-thin mb-5"
            v-text="$t('titles.globalStatisticsTitle')"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat class="overflow-hidden">
            <v-tabs fixed-tabs value="this" v-model="selectedGraph">
              <v-tab>
                <v-icon left>{{ mdiNumeric }}</v-icon>
                {{ $t(graphNames[0]) }}
                <v-spacer />
                <v-icon small color="primary darken-1" @click="dialog = true">
                  {{ mdiHelpCircleOutline }}
                </v-icon>
              </v-tab>
              <v-tab>
                <v-icon left>{{ mdiWeatherSunny }}</v-icon>
                {{ $t(graphNames[1]) }}
                <v-spacer />
                <v-icon small color="primary darken-1" @click="dialog = true"
                  >{{ mdiHelpCircleOutline }}
                </v-icon>
              </v-tab>
              <v-tab>
                <v-icon left>{{ mdiPercentOutline }}</v-icon>
                {{ $t(graphNames[2]) }}
                <v-spacer />
                <v-icon small color="primary darken-1" @click="dialog = true">
                  {{ mdiHelpCircleOutline }}
                </v-icon>
              </v-tab>
              <v-tab>
                <v-icon left>{{ mdiMapMarker }}</v-icon>
                {{ $t(graphNames[3]) }}
                <v-spacer />
                <v-icon small color="primary darken-1" @click="dialog = true">
                  {{ mdiHelpCircleOutline }}
                </v-icon>
              </v-tab>
              <v-tab>
                <v-icon left>{{ mdiVirusOutline }}</v-icon>
                {{ $t(graphNames[4]) }}
                <v-spacer />
                <v-icon small color="primary" @click="dialog = true">
                  {{ mdiHelpCircleOutline }}
                </v-icon>
              </v-tab>

              <v-tab-item style="min-height: 700px">
                <display
                  mode="counts"
                  y_label="People"
                  :tab_index="selectedGraph"
                  :short_description="selectedDescription.description"
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <daily-display
                  y_label="People"
                  :tab_index="selectedGraph"
                  :short_description="selectedDescription.description"
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <display
                  mode="rates"
                  y_label="Percent"
                  :tab_index="selectedGraph"
                  :short_description="selectedDescription.description"
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <country-compare
                  x_axis_type="category"
                  :tab_index="selectedGraph"
                  :short_description="selectedDescription.description"
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <disease-compare
                  :tab_index="selectedGraph"
                  :short_description="selectedDescription.description"
                  y_label="Logarithmic Value"
                  y_axis_type="logarithmic"
                  x_axis_type="category"
                />
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" width="500">
        <v-card class="px-3" shaped style="overflow: hidden">
          <v-icon
            style="position: absolute; right: 0; top: 0; z-index: 100"
            class="mt-3 mr-3"
            @click="dialog = false"
            v-text="mdiClose"
          />
          <v-fade-transition hide-on-leave>
            <div class="ma-2" v-if="graphLoaders.descriptions">
              <v-skeleton-loader
                ref="skeleton"
                type="article"
                class="mx-auto"
              />
            </div>
            <p
              class="text-muted text-center my-8"
              v-else-if="!selectedDescription"
              v-text="'Found Nothing'"
            />
            <div v-else>
              <v-card-title
                class="headline mt-2"
                v-text="selectedDescription.title"
              />
              <v-card-text v-text="selectedDescription.description" />
              <v-card-text>
                <v-list
                  dense
                  v-if="
                    selectedDescription.fields &&
                      selectedDescription.fields.length > 0
                  "
                >
                  <h4 v-text="'Fields'" />
                  <v-list-item
                    :key="i"
                    v-for="(field, i) in selectedDescription.fields"
                  >
                    <p>
                      <span v-text="field.name + ':  '" />
                      <span
                        class="grey--text text--darken-1 font-italic"
                        v-text="field.explanation"
                      />
                    </p>
                  </v-list-item>
                </v-list>
                <v-list
                  dense
                  v-if="
                    selectedDescription.criteria &&
                      selectedDescription.criteria.length > 0
                  "
                >
                  <h4 v-text="'Metrics'" />
                  <v-list-item
                    :key="i"
                    v-for="(cr, i) in selectedDescription.criteria"
                  >
                    <p>
                      <span v-text="cr.name + ':  '" />
                      <span
                        class="grey--text text--darken-1 font-italic"
                        v-text="cr.explanation"
                      />
                    </p>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </div>
          </v-fade-transition>
        </v-card>
      </v-dialog>
    </v-container>
  </section>
</template>

<script>
import Display from "./Charts/Display.vue";
import DailyDisplay from "./Charts/DailyDisplay.vue";
import CountryCompare from "./Charts/CountryCompare.vue";
import DiseaseCompare from "./Charts/DiseaseCompare.vue";
import store from "@/store";
import {
  mdiClose,
  mdiHelpCircleOutline,
  mdiMapMarker,
  mdiNumeric,
  mdiPercentOutline,
  mdiVirusOutline,
  mdiWeatherSunny
} from "@mdi/js";

export default {
  components: {
    Display,
    DailyDisplay,
    CountryCompare,
    DiseaseCompare
  },
  data: () => {
    return {
      mdiHelpCircleOutline,
      mdiClose,
      mdiNumeric,
      mdiWeatherSunny,
      mdiVirusOutline,
      mdiMapMarker,
      mdiPercentOutline,
      dialog: false,
      selectedGraph: 0,
      graphNames: [
        "graphNames.totalCounts",
        "graphNames.dailyCounts",
        "graphNames.viewRates",
        "graphNames.compareCountries",
        "graphNames.compareDiseases"
      ]
    };
  },
  created() {
    if (!this.graphDescriptions) {
      store.dispatch("setGraphDescriptions", { lang: this.$i18n.locale });
    }
  },
  computed: {
    graphLoaders: () => store.getters.getGraphLoaders,
    graphDescriptions: () => store.getters.getGraphDescriptions,
    selectedDescription() {
      if (this.graphDescriptions) {
        const res = this.graphDescriptions[
          this.$t(this.graphNames[this.selectedGraph])
        ];
        if (res) {
          return res;
        }
      }
      return {
        title: "",
        description: "",
        fields: [],
        criteria: []
      };
    }
  }
};
</script>
