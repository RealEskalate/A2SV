<template>
  <section class="statistics pb-10">
    <v-container>
      <v-row>
        <v-col>
          <h3
            class="display-1 font-weight-thin mb-5"
            v-text="'Covid-19 Statistics'"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat class="overflow-hidden">
            <v-tabs fixed-tabs value="this" v-model="selectedGraph">
              <v-tab>
                <v-icon left>{{ mdiNumeric }}</v-icon>
                Total Counts
                <v-spacer />
                <v-icon small color="primary darken-1" @click="dialog = true">
                  {{ mdiHelpCircleOutline }}
                </v-icon>
              </v-tab>
              <v-tab>
                <v-icon left>{{ mdiWeatherSunny }}</v-icon>
                Daily Counts
                <v-spacer />
                <v-icon small color="primary darken-1" @click="dialog = true"
                  >{{ mdiHelpCircleOutline }}
                </v-icon>
              </v-tab>
              <v-tab>
                <v-icon left>{{ mdiPercentOutline }}</v-icon>
                View Rates
                <v-spacer />
                <v-icon small color="primary darken-1" @click="dialog = true">
                  {{ mdiHelpCircleOutline }}
                </v-icon>
              </v-tab>
              <v-tab>
                <v-icon left>{{ mdiMapMarker }}</v-icon>
                Compare Countries
                <v-spacer />
                <v-icon small color="primary darken-1" @click="dialog = true">
                  {{ mdiHelpCircleOutline }}
                </v-icon>
              </v-tab>
              <v-tab>
                <v-icon left>{{ mdiVirusOutline }}</v-icon>
                Compare Similar Diseases
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
                  :short_description="
                    graphDescriptions[graphNames[selectedGraph]].description
                  "
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <daily-display
                  y_label="People"
                  :tab_index="selectedGraph"
                  :short_description="
                    graphDescriptions[graphNames[selectedGraph]].description
                  "
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <display
                  mode="rates"
                  y_label="Percent"
                  :tab_index="selectedGraph"
                  :short_description="
                    graphDescriptions[graphNames[selectedGraph]].description
                  "
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <country-compare
                  x_axis_type="category"
                  :tab_index="selectedGraph"
                  :short_description="
                    graphDescriptions[graphNames[selectedGraph]].description
                  "
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <disease-compare
                  :tab_index="selectedGraph"
                  :short_description="
                    graphDescriptions[graphNames[selectedGraph]].description
                  "
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
        <v-card class="px-2" shaped style="overflow: hidden">
          <v-icon
            style="position: absolute; right: 0; top: 0"
            class="mt-3 mr-3"
            @click="dialog = false"
          >
            {{ mdiClose }}
          </v-icon>
          <v-card-title
            class="headline mt-2"
            v-text="graphDescriptions[graphNames[selectedGraph]].title"
          />
          <v-card-text
            v-text="graphDescriptions[graphNames[selectedGraph]].description"
          />
          <v-card-text
            v-if="
              graphDescriptions[graphNames[selectedGraph]].fields.length > 0 ||
                graphDescriptions[graphNames[selectedGraph]].criteria.length > 0
            "
          >
            <v-list dense>
              <h4 v-text="'Fields'" />
              <v-list-item
                :key="i"
                v-for="(field, i) in graphDescriptions[
                  graphNames[selectedGraph]
                ].fields"
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
            <v-list dense>
              <h4 v-text="'Metrics'" />
              <v-list-item
                :key="i"
                v-for="(cr, i) in graphDescriptions[graphNames[selectedGraph]]
                  .criteria"
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
  mdiVirusOutline,
  mdiWeatherSunny,
  mdiPercentOutline
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
        "Total Counts",
        "Daily Counts",
        "View Rates",
        "Compare Countries",
        "Compare Similar Diseases"
      ]
    };
  },
  computed: {
    graphDescriptions: () => store.getters.getGraphDescriptions
  }
};
</script>
