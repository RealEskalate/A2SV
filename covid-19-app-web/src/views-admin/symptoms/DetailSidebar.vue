<template>
  <v-navigation-drawer
    width="350"
    height="100%"
    v-model="sidebar"
    right
    absolute
    class="shadow-sm"
  >
    <v-list-item class="my-2 shadow-sm p-sticky">
      <v-list-item-action>
        <v-btn
          class="v-card--shaped"
          large
          @click="$emit('close-sidebar')"
          icon
        >
          <v-icon v-text="mdiForwardburger" />
        </v-btn>
      </v-list-item-action>
      <v-list-item-content>
        <div v-text="detail.name" />
      </v-list-item-content>
      <v-list-item-action>
        <v-chip
          class="float-right"
          small
          :color="relevanceColor(detail.risk) + ' darken-1'"
          text-color="white"
          v-text="`${detail.risk} RISK`"
        />
      </v-list-item-action>
    </v-list-item>

    <v-list>
      <v-subheader v-text="$t('map.details')" />
      <v-list-item
        :key="index"
        v-for="(feature, index) in detailSingleFeatures"
      >
        <v-list-item-avatar size="20">
          <v-icon v-text="feature.icon" />
        </v-list-item-avatar>

        <v-list-item-content>
          <span>
            {{ $t(feature.name) }}:
            <span
              v-if="['lastUpdate'].includes(feature.key)"
              class="grey--text"
              v-text="formatDate(detail[feature.key])"
            />
            <span v-else class="grey--text" v-text="detail[feature.key]" />
          </span>
        </v-list-item-content>
      </v-list-item>

      <template v-for="(feature, index) in detailListFeatures">
        <v-divider
          :class="`mt-${index === 0 ? 0 : 3} mb-2`"
          :key="'divider_' + index"
        />
        <v-list-item :key="'title_' + index">
          <v-list-item-avatar size="20">
            <v-icon v-text="feature.icon" />
          </v-list-item-avatar>
          <v-list-item-content v-text="$t(feature.name)" />
        </v-list-item>
        <div
          :key="feature.name + index"
          class="grey lighten-5 shadow-in v-card--shaped text-center pa-3 mx-5"
        >
          <v-subheader
            class="mx-auto my-2 justify-center"
            v-if="!detail[feature.key] || detail[feature.key].length === 0"
            v-text="$t('auth.foundNothing')"
          />
          <v-chip
            v-else
            small
            class="ma-1 v-card--shaped shadow-sm"
            :key="key"
            v-for="(value, key) in detail[feature.key]"
          >
            <span class="grey--text text--darken-2" v-text="value" />
          </v-chip>
        </div>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {
  mdiGenderMaleFemaleVariant,
  mdiCrosshairsGps,
  mdiForwardburger,
  mdiStateMachine,
  mdiWatch,
  mdiBandage
} from "@mdi/js";
import moment from "moment";

export default {
  name: "DetailSidebar",
  props: ["detail", "sidebar"],
  data() {
    return {
      mdiForwardburger
    };
  },
  methods: {
    formatDate(date) {
      return moment(date).format("MMM DD, YYYY");
    }
  },
  computed: {
    detailSingleFeatures() {
      return [
        { name: "Gender", key: "gender", icon: mdiGenderMaleFemaleVariant },
        { name: "Status", key: "status", icon: mdiStateMachine },
        { name: "Location", key: "location", icon: mdiCrosshairsGps },
        { name: "Last Update", key: "lastUpdate", icon: mdiWatch }
      ];
    },
    detailListFeatures() {
      return [{ name: "Symptoms", key: "allSymptoms", icon: mdiBandage }];
    }
  }
};
</script>

<style scoped>
.display-1 {
  font-size: 1.2em !important;
  color: #303030 !important;
}
.shadow {
  background: transparent !important;
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05),
    0 15px 40px rgba(166, 173, 201, 0.2) !important;
  border-radius: 15px !important;
}
</style>
