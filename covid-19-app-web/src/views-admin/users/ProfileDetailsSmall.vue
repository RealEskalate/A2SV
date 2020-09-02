<template>
  <div class="pb-5">
    <v-bottom-sheet v-model="sidebar" :scrollable="true">
      <div class="white pb-5">
        <v-list-item class="my-2 shadow-sm p-sticky">
          <v-list-item-action>
            <v-btn class="v-card--shaped" large @click="sheet = !sheet" icon>
              <v-icon v-text="mdiClose" />
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
                <span class="grey--text" v-text="detail[feature.key]" />
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
      </div>
    </v-bottom-sheet>
  </div>
</template>

<script>
import {
  mdiBandage,
  mdiCrosshairsGps,
  mdiGenderMaleFemaleVariant,
  mdiStateMachine,
  mdiWatch,
  mdiClose
} from "@mdi/js";

export default {
  props: ["sheet", "detail", "sidebar"],
  data() {
    return {
      mdiClose
    };
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
