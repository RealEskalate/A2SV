<template>
  <v-card shaped outlined>
    <v-subheader v-text="'Today'" />
    <v-list dense disabled>
      <template v-for="(item, index) in items">
        <v-list-item :key="item.title">
          <template>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" class="text-wrap" />
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-action-text
                class="font-weight-bold"
                v-text="item.totalNum"
              />
              <!--                      <p>{{ item.totalNum }}</p>-->
              <v-list-item-subtitle
                :class="item.increaseRate > 0 ? 'red--text' : 'green--text'"
              >
                <v-icon
                  small
                  v-if="item.increaseRate > 0"
                  class="red--text"
                  v-text="mdiArrowUp"
                />
                <v-icon
                  small
                  v-else
                  class="green--text font-weight-bold"
                  v-text="mdiArrowDown"
                />
                {{ item.increaseRate + "%" }}
              </v-list-item-subtitle>
            </v-list-item-action>
          </template>
        </v-list-item>

        <v-divider v-if="index + 1 < items.length" :key="index" />
      </template>
    </v-list>
  </v-card>
</template>

<script>
import { mdiArrowDown, mdiArrowUp } from "@mdi/js";

export default {
  name: "TodayStatistics",
  data() {
    return {
      mdiArrowUp,
      mdiArrowDown,
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
