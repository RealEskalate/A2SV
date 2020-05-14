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
            <v-tabs fixed-tabs v-model="selectedGraph">
              <v-tab>
                <v-icon left>{{mdiNumeric}}</v-icon>
                Total Counts
                <v-spacer />
                <v-icon
                        small
                        color="primary darken-1"
                        @click="dialog = true">
                  {{mdiHelpCircleOutline}}
                </v-icon>
              </v-tab>
              <v-tab>
                <v-icon left>{{mdiWeatherSunny}}</v-icon>
                Daily Counts
                <v-spacer />
                <v-icon
                        small
                        color="primary darken-1"
                        @click="dialog = true">{{mdiHelpCircleOutline}}
                </v-icon>
              </v-tab>
              <v-tab>
                <v-icon left>{{mdiPercentOutline}}</v-icon>
                View Rates
                <v-spacer />
                <v-icon
                        small
                        color="primary darken-1"
                        @click="dialog = true"> {{mdiHelpCircleOutline}}
                </v-icon>
              </v-tab>
              <v-tab>
                <v-icon left>{{mdiMapMarker}}</v-icon>
                Compare Countries
                <v-spacer />
                <v-icon
                        small
                        color="primary darken-1"
                        @click="dialog = true"> {{mdiHelpCircleOutline}}
                </v-icon>
              </v-tab>
              <v-tab>
                <v-icon left>{{mdiVirusOutline}}</v-icon>
                Compare Similar Diseases
                <v-spacer />
                <v-icon
                        small
                        color="primary"
                        @click="dialog = true">
                  {{mdiHelpCircleOutline}}
                </v-icon>
              </v-tab>

              <v-tab-item style="min-height: 700px">
                <display
                  mode="counts"
                  y_label="People"
                  :tab_index="selectedGraph"
                  :short_description="graphs[selectedGraph].description"
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <daily-display
                  y_label="People"
                  :tab_index="selectedGraph"
                  :short_description="graphs[selectedGraph].description"
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <display
                  mode="rates"
                  y_label="Percent"
                  :tab_index="selectedGraph"
                  :short_description="graphs[selectedGraph].description"
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <country-compare
                  x_axis_type="category"
                  :tab_index="selectedGraph"
                  :short_description="graphs[selectedGraph].description"
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <disease-compare
                  :tab_index="selectedGraph"
                  :short_description="graphs[selectedGraph].description"
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
                  @click="dialog = false">
            {{mdiClose}}
          </v-icon>
          <v-card-title
            class="headline mt-2"
            v-text="graphs[selectedGraph].title"
          />
          <v-card-text v-text="graphs[selectedGraph].description" />
          <v-card-text
            v-if="
              graphs[selectedGraph].fields.length > 0 ||
                graphs[selectedGraph].criteria.length > 0
            "
          >
            <v-list dense>
              <h4 v-text="'Fields'" />
              <v-list-item
                :key="i"
                v-for="(field, i) in graphs[selectedGraph].fields"
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
                v-for="(cr, i) in graphs[selectedGraph].criteria"
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
  import {mdiClose, mdiHelpCircleOutline, mdiMapMarker, mdiNumeric, mdiVirusOutline, mdiWeatherSunny} from "@mdi/js";

  export default {
  components: {
    Display,
    DailyDisplay,
    CountryCompare,
    DiseaseCompare
  },
  data: () => {
    return {
      mdiHelpCircleOutline, mdiClose, mdiNumeric, mdiWeatherSunny, mdiVirusOutline, mdiMapMarker,
      dialog: false,
      selectedGraph: 0,
      graphs: [
        {
          title: "Total Counts",
          description:
            "This graph represents the number of daily confirmed cases of the latest pandemic, COVID-19. The vertical line (y-axis) represents the daily confirmed cases and the horizontal line (x-axis) represents the date. The line represents the criteria selected.",
          fields: [
            {
              name: "Country",
              explanation: "Searchable list of countries"
            },
            {
              name: "Date Range",
              explanation:
                "Specific start date and finish date for calculating the counts"
            }
          ],
          criteria: [
            {
              name: "Test Count",
              explanation:
                "The total  number of tests conducted for each day in the selected range"
            },
            {
              name: "Confirmed Cases",
              explanation:
                "The total number of confirmed cases  for each day in the selected range"
            },
            {
              name: "Death Count ",
              explanation:
                "The total number of death cases  for each day in the selected range"
            },
            {
              name: "Recovery Count",
              explanation:
                "The total number of reported recoveries  for each day in the selected range"
            },
            {
              name: "Active Cases",
              explanation:
                "The number of cases still active on the day for each day in the selected range"
            }
          ]
        },
        {
          title: "Daily Counts",
          description:
            "This graph represents the number of daily confirmed cases of the latest pandemic, COVID-19. The vertical line (y-axis) represents the daily confirmed cases and the horizontal line (x-axis) represents the date. The line represents the criteria selected.",
          fields: [
            {
              name: "Country",
              explanation: "Searchable list of countries"
            },
            {
              name: "Date Range",
              explanation:
                "specific start to finish date for calculating the counts"
            },
            {
              name: "Criteria",
              explanation: " List of metrics to view "
            }
          ],
          criteria: [
            {
              name: "Daily Test",
              explanation:
                "The number of tested people for each day in the selected rangey"
            },
            {
              name: "Daily Confirmed Cases",
              explanation:
                "The number of confirmed cases for each day in the selected range"
            },
            {
              name: "Daily Death ",
              explanation:
                "The number of death cases for each day in the selected range"
            },
            {
              name: "Daily Recovery",
              explanation:
                "the number of recovered patients for each day in the selected range"
            }
          ]
        },
        {
          title: "View Rates",
          description:
            "This graph represents the recovery rate, active rate, and death rate of the latest pandemic, COVID-19 of either any selected country or of the entire world. The vertical line (y-axis) represents the rate of increase and the horizontal line (x-axis) represents the date. The line represents the criteria selected.",
          fields: [
            {
              name: "Country",
              explanation: "Searchable list of countries"
            },
            {
              name: "Date Range",
              explanation:
                "Specific start to finish date for calculating the counts"
            }
          ],
          criteria: [
            {
              name: "Positive Rate ",
              explanation:
                "The percentage of positive counts from the test counts of all days in the selected range"
            },
            {
              name: "Recovery Rate",
              explanation:
                "The percentage of recovered counts from the confirmed test counts of all days in the selected range"
            },
            {
              name: "Active Rate",
              explanation:
                "The percentage of active patient counts from the confirmed test counts of all days in the selected range"
            },
            {
              name: "Death Rate",
              explanation:
                "The percentage of  death counts from the test counts of all days in the selected range"
            }
          ]
        },
        {
          title: "Compare Countries",
          description:
            "This graph represents the comparison of two selected countries regarding the latest pandemic, COVID-19 of either any selected country or of the entire world based on factors including test counts, confirmed cases, death counts, recovery counts, active cases, and others. The vertical line (y-axis) represents the rate of increase and the horizontal line (x-axis) represents the date. The two lines represent the criteria selected.",
          fields: [
            {
              name: "Country 1 & 2",
              explanation: " An option to select two countries to compare"
            },
            {
              name: "Date Range 1 & 2",
              explanation:
                "Specific start to finish date in which we see the data for the respective country"
            },
            {
              name: "Common Criteria",
              explanation: "Mutual criteria to compare the chosen countries"
            }
          ],
          criteria: [
            {
              name: "Test Count",
              explanation:
                "The total  number of tests conducted  for each day in the selected range"
            },
            {
              name: "Recovery Count",
              explanation:
                "The total number of reported recoveries  for each day in the selected range"
            },
            {
              name: "Confirmed Cases",
              explanation:
                "The total number of confirmed cases  for each day in the selected range"
            },
            {
              name: "Death Count ",
              explanation:
                "The total number of death cases  for each day in the selected range"
            },
            {
              name: "Active Cases",
              explanation:
                "The number of cases still active on the day for each day in the selected range"
            },
            {
              name: "Positive Rate ",
              explanation:
                "The percentage of positive counts from the test counts of all days in the selected range"
            },
            {
              name: "Recovery Rate",
              explanation:
                "The percentage of recovered counts from the confirmed test counts of all days in the selected range"
            },
            {
              name: "Active Rate",
              explanation:
                "The percentage of active patient counts from the confirmed test counts of all days in the selected range"
            },
            {
              name: "Death Rate",
              explanation:
                "The percentage of death counts from the test counts of all days in the selected range"
            }
          ]
        },
        {
          title: "Compare Similar Diseases",
          description:
            "This graph represents the comparison of the latest pandemic, COVID-19 with other similar epidemics of the entire world based on factors including confirmed cases, death counts, recovery counts, active cases, and others. The vertical line (y-axis) represents the rate of increase and the horizontal line (x-axis) represents the date. The two lines represent the criteria selected.",
          fields: [],
          criteria: [
            {
              name: "Confirmed  Cases",
              explanation: "The overall number of confirmed cases "
            },
            {
              name: "Death Count",
              explanation: "The overall number of death cases"
            },
            {
              name: "Recovery Count",
              explanation: "The overall number of recovery cases"
            },
            {
              name: "Affected Countries",
              explanation: "The overall number of countries affected"
            }
          ]
        }
      ]
    };
  }
};
</script>

<style></style>
