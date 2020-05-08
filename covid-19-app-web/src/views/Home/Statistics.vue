<template>
  <section class="statistics py-10">
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
                <display mode="counts" y_label="People" />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <daily-display y_label="People" />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <display mode="rates" y_label="Percent" />
              </v-tab-item>
              <v-tab-item style="min-height: 700px">
                <country-compare x_axis_type="category" />
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
      <v-dialog v-model="dialog" width="400">
        <v-card class="px-2" shaped style="overflow: hidden">
          <v-card-title
            class="headline mt-2"
            v-text="graphs[selectedGraph].title"
          />
          <v-card-text v-text="graphs[selectedGraph].description" />
          <v-divider />
          <v-card-text v-if="graphs[selectedGraph].fields.length > 0">
            <v-list two-line dense>
              <v-list-item-subtitle v-text="'Fields'" />
              <v-list-item
                :key="i"
                v-for="(field, i) in graphs[selectedGraph].fields"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="field.name" />
                  <v-list-item-subtitle v-text="field.explanation" />
                </v-list-item-content>
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
            "this is the description for total countsthis is the description for total countsthis is the description for total countsthis is the description for total countsthis is the description for total counts",
          fields: [
            {
              name: "Country",
              explanation: "This is the explanation of the field"
            },
            {
              name: "Date Range",
              explanation: "This is the explanation of the field"
            }
          ]
        },
        {
          title: "Daily Counts",
          description: "this is the description for the counts",
          fields: [
            {
              name: "Country",
              explanation: "This is the explanation of the field"
            },
            {
              name: "Date Range",
              explanation: "This is the explanation of the field"
            },
            {
              name: "Criteria",
              explanation: "This is the explanation of the field"
            }
          ]
        },
        {
          title: "View Rates",
          description: "this is the description for the rates",
          fields: [
            {
              name: "Country",
              explanation: "This is the explanation of the field"
            },
            {
              name: "Date Range",
              explanation: "This is the explanation of the field"
            }
          ]
        },
        {
          title: "Compare Countries",
          description: "this is the description for the country comparison",
          fields: [
            {
              name: "Country 1 & 2",
              explanation: "This is the explanation of the field"
            },
            {
              name: "Date Range 1 & 2",
              explanation: "This is the explanation of the field"
            },
            {
              name: "Criteria",
              explanation: "This is the explanation of the field"
            }
          ]
        },
        {
          title: "Compare Similar Diseases",
          description: "this is the description for the disease comparison",
          fields: []
        }
      ]
    };
  }
};
</script>
