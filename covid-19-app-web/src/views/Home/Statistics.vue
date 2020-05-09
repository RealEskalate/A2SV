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
          <v-card flat>
            <v-tabs fixed-tabs v-model="selectedGraph">
              <v-tab>
                <v-icon left>mdi-numeric</v-icon>
                Total Counts
                <v-spacer />
                <v-icon
                  small
                  color="primary darken-1"
                  @click="dialog = true"
                  v-text="'mdi-help-circle-outline'"
                />
              </v-tab>
              <v-tab>
                <v-icon left>mdi-weather-sunny</v-icon>
                Daily Counts
                <v-spacer />
                <v-icon
                  small
                  color="primary darken-1"
                  @click="dialog = true"
                  v-text="'mdi-help-circle-outline'"
                />
              </v-tab>
              <v-tab>
                <v-icon left>mdi-percent-outline</v-icon>
                View Rates
                <v-spacer />
                <v-icon
                  small
                  color="primary darken-1"
                  @click="dialog = true"
                  v-text="'mdi-help-circle-outline'"
                />
              </v-tab>
              <v-tab>
                <v-icon left>mdi-map-marker</v-icon>
                Compare Countries
                <v-spacer />
                <v-icon
                  small
                  color="primary darken-1"
                  @click="dialog = true"
                  v-text="'mdi-help-circle-outline'"
                />
              </v-tab>
              <v-tab>
                <v-icon left>mdi-virus-outline</v-icon>
                Compare Similar Diseases
                <v-spacer />
                <v-icon
                  small
                  color="primary"
                  @click="dialog = true"
                  v-text="'mdi-help-circle-outline'"
                />
              </v-tab>

              <v-tab-item style="min-height: 700px">
                <display
                  mode="counts"
                  y_label="People"
                  :tab_index="selectedGraph"
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <daily-display y_label="People" :tab_index="selectedGraph" />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <display
                  mode="rates"
                  y_label="Percent"
                  :tab_index="selectedGraph"
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <country-compare
                  x_axis_type="category"
                  :tab_index="selectedGraph"
                />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <disease-compare
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
          <v-card-title
            class="headline mt-2"
            v-text="graphs[selectedGraph].title"
          />
          <v-card-text v-text="graphs[selectedGraph].description" />
          <v-divider />
          <v-card-text
            v-if="
              graphs[selectedGraph].fields.length > 0 ||
                graphs[selectedGraph].criteria.length > 0
            "
          >
            <v-list dense>
              <v-list-item-subtitle v-text="'Fields'" />
              <v-list-item
                :key="i"
                v-for="(field, i) in graphs[selectedGraph].fields"
              >
                <p>
                  {{ field.name }}:
                  <span
                    class="grey--text darken-3"
                    v-text="field.explanation"
                  />
                </p>
              </v-list-item>
            </v-list>
            <v-list dense>
              <v-list-item-subtitle v-text="'Criteria'" />
              <v-list-item
                :key="i"
                v-for="(cr, i) in graphs[selectedGraph].criteria"
              >
                <p>
                  {{ cr.name }}:
                  <span class="grey--text darken-3" v-text="cr.explanation" />
                </p>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="dialog = false">
              Close
            </v-btn>
          </v-card-actions>
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

export default {
  components: {
    Display,
    DailyDisplay,
    CountryCompare,
    DiseaseCompare
  },
  data: () => {
    return {
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
              explanation: " List of countries"
            },
            {
              name: "Date Range",
              explanation:
                "Number of all dates from specific start to finish date"
            }
          ],
          criteria: [
            {
              name: "Test Count",
              explanation:
                "The total  number of tested people on a particular day"
            },
            {
              name: "Confirmed Cases",
              explanation:
                "The total number of confirmed cases on a particular day"
            },
            {
              name: "Death Count ",
              explanation: "The total number of death cases on a particular day"
            },
            {
              name: "Recovery Count",
              explanation:
                " the total number of recovered patients on a particular day"
            },
            {
              name: "Active Cases",
              explanation:
                "the total  number of active cases on a particular day"
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
              explanation: "List of countries"
            },
            {
              name: "Date Range",
              explanation:
                "Number of all dates from specific start to finish date"
            },
            {
              name: "Criteria",
              explanation: " List of metrics to view "
            }
          ],
          criteria: [
            {
              name: "Daily Test",
              explanation: "the number of tested people on a particular day"
            },
            {
              name: "Daily Confirmed Cases",
              explanation: "The number of confirmed cases on a particular day"
            },
            {
              name: "Daily Death ",
              explanation: "The number of death cases on a particular day"
            },
            {
              name: "Daily Recovery",
              explanation:
                "The number of recovered patients on a particular day"
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
              explanation: "List of countries"
            },
            {
              name: "Date Range",
              explanation:
                "Number of all dates from specific start to finish date"
            }
          ],
          criteria: [
            {
              name: "Positive Rate ",
              explanation: "The ratio of positive count to test counts per day"
            },
            {
              name: "Recovery Rate",
              explanation: "The ratio of recovered cases per day"
            },
            {
              name: "Active Rate",
              explanation: "The ratio of active count to total count per day"
            },
            {
              name: "Death Rate",
              explanation: "The ratio of death cases to total count per day"
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
              explanation: "List of countries"
            },
            {
              name: "Date Range 1 & 2",
              explanation:
                "Number of all dates from specific start to finish date"
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
                "The total  number of tested people on a particular day"
            },
            {
              name: "Recovery Count",
              explanation:
                " the total number of recovered patients on a particular day"
            },
            {
              name: "Confirmed Cases",
              explanation:
                "The total number of confirmed cases on a particular day"
            },
            {
              name: "Death Count ",
              explanation: "The total number of death cases on a particular day"
            },
            {
              name: "Active Cases",
              explanation:
                "the total  number of active cases on a particular day"
            },
            {
              name: "Positive Rate ",
              explanation: "The ratio of positive count to test counts per day"
            },
            {
              name: "Recovery Rate",
              explanation: "The ratio of recovered cases per day"
            },
            {
              name: "Active Rate",
              explanation: "The ratio of active count to total count per day"
            },
            {
              name: "Death Rate",
              explanation: "The ratio of death cases to total count per day"
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
              explanation: "The overall number of  confirmed cases "
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
