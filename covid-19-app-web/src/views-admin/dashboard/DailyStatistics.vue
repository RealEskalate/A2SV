<template>
  <v-card class="effect1">
    <v-card-title><h2 class="mx-auto">Today</h2></v-card-title>
    <v-list>
      <v-list-item-group multiple active-class="pink--text">
        <template v-for="(item, index) in items">
          <v-list-item :key="item.title">
            <template>
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.title"
                  class="text-wrap"
                ></v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text
                  class="font-weight-bold"
                  v-text="item.totalNum"
                ></v-list-item-action-text>
                <!--                      <p>{{ item.totalNum }}</p>-->
                <v-list-item-subtitle
                  :class="item.increaseRate > 0 ? 'red--text' : 'green--text'"
                >
                  <v-icon v-if="item.increaseRate > 0" class="red--text">
                    {{ mdiArrowUpThick }}
                  </v-icon>
                  <v-icon v-else class="green--text font-weight-bold">
                    {{ mdiArrowDownThick }}
                  </v-icon>
                  {{ item.increaseRate + "%" }}
                </v-list-item-subtitle>
              </v-list-item-action>
            </template>
          </v-list-item>

          <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import { mdiArrowDownThick, mdiArrowUpThick } from "@mdi/js";

export default {
  name: "TodayStatistics",
  data() {
    return {
      mdiArrowUpThick,
      mdiArrowDownThick,
      items: [
        {
          title: "New confirmed COVID-19 cases",
          totalNum: "123, 456",
          increaseRate: -4
        },
        {
          title: "New citizens with symptoms",
          totalNum: "123, 456",
          increaseRate: 9
        },
        {
          title: "COVID related deaths",
          totalNum: "56",
          increaseRate: -1
        },

        {
          title: "Tests administered",
          totalNum: "1,456",
          increaseRate: 1
        }
      ]
    };
  }
};
</script>

<style scoped>
.v-list-item__action-text {
  font-size: 1em;
}

.card-title {
  font-size: small;
}
</style>
