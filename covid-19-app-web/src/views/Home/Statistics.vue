<template>
  <section class="statistics py-10">
    <v-row class="my-3 ml-1">
      <v-dialog v-model="dialog" width="900px">
        <template v-slot:activator="{ on }">
          <v-btn color="orange" icon v-on="on"
            ><v-icon>mdi-information</v-icon></v-btn
          >
        </template>
        <template>
          <v-card class="">
            <v-card-title class="headline my-2 mx-1"
              >Graph Display Info
              </v-card-title>
            <v-list>
              <v-list-group
                v-for="item in items"
                :key="item.title"
                v-model="item.active"
                no-action
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item v-for="subItem in item.items" :key="subItem.title">
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="subItem.title"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-card>
        </template>
      </v-dialog>
    </v-row>
    <v-card elevation="2">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Statistics</v-toolbar-title>
      </v-toolbar>

      <v-tabs centered fixed-tabs dark background-color="primary">
        <v-tab class="justify-start">
          <v-icon left>mdi-numeric</v-icon>
          Display Counts
        </v-tab>
        <v-tab class="justify-start">
          <v-icon left>mdi-percent-outline</v-icon>
          Display Rates
        </v-tab>
        <v-tab class="justify-start">
          <v-icon left>mdi-map-marker</v-icon>
          Compare Countries
        </v-tab>
        <v-tab class="justify-start">
          <v-icon left>mdi-virus-outline</v-icon>
          Compare Similar Diseases
        </v-tab>

        <v-tab-item style="min-height: 700px">
          <display mode="counts" y_label="People" />
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
  </section>
</template>

<script>
import Display from "./Charts/Display.vue";
import CountryCompare from "./Charts/CountryCompare.vue";
import DiseaseCompare from "./Charts/DiseaseCompare.vue";

export default {
  data() {
    return {
      items: [
        {
          action: "local_activity",
          title: "Display Counts",
          items: [{ title: "List Item" }]
        },
        {
          action: "local_activity",
          title: "Display Rates",
          items: [{ title: "List Item" }]
        },
        {
          action: "local_activity",
          title: "Compare Countries",
          items: [{ title: "List Item" }]
        },

        {
          action: "local_activity",
          title: "Compare Similar Diseases",
          items: [{ title: "List Item" }]
        }
      ]
    };
  },
  components: {
    Display,
    CountryCompare,
    DiseaseCompare
  }
};
</script>
