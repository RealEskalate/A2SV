<template>
  <section class="map pb-5">
    <v-container>
      <!--      <h3 class="display-1 font-weight-thin mb-5">-->
      <!--        &lt;!&ndash;            {{ $t("navbar.map") }}&ndash;&gt;-->
      <!--        Reported Symptom Tracking-->
      <!--      </h3>-->
      <v-row class="my-5">
        <v-col cols="12">
          <h3
            class="display-1 font-weight-thin mb-5"
            v-text="$t('titles.symptomStatisticsTitle')"
          />

          <v-card class="overflow-hidden" outlined shaped>
            <v-row>
              <v-col
                sm="3"
                cols="6"
                class="border-right"
                :key="item.key"
                v-for="item in aggregates"
              >
                <!--              <v-img :src="item.icon" class="small-icon mx-auto my-3" />-->
                <p class="text-center" v-text="item.key" />
                <h1
                  class="display-1 text-center mb-2 primary--text"
                  v-text="numberWithCommas(item.value)"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card style="height: 65vh" outlined shaped class="overflow-hidden">
            <v-btn
              fab
              color="white"
              depressed
              v-show="!sidebar"
              @click="sidebar = true"
              class="shadow-sm v-card--outlined v-card--shaped"
              style="position: absolute; left: 0; top: 0; z-index: 2"
            >
              <v-icon v-text="mdiForwardburger" />
            </v-btn>
            <v-navigation-drawer
              width="350"
              v-model="sidebar"
              class="shadow-sm pb-9"
              style="z-index: 3; position: absolute;"
            >
              <v-list-item class="my-2 shadow-sm p-sticky">
                <v-list-item-content>
                  <v-autocomplete
                    dense
                    outlined
                    class="v-card--shaped"
                    append-icon=""
                    v-model="selectedCity"
                    :items="loadedCities"
                    :loading="symTrackLoaders.cities"
                    :search-input.sync="keyword"
                    :no-data-text="$t('auth.foundNothing')"
                    hide-no-data
                    hide-selected
                    hide-details
                    :item-text="autoCompleteValue"
                    :item-value="autoCompleteValue"
                    :label="$t('map.searchCity')"
                    :placeholder="$t('map.startTyping')"
                    return-object
                  />
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    class="v-card--shaped"
                    large
                    @click="sidebar = false"
                    icon
                  >
                    <v-icon v-text="mdiBackburger" />
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <v-progress-linear
                height="2px"
                style="margin-top: -8px"
                indeterminate
                v-if="symTrackLoaders.userSymptoms"
              />
              <v-subheader
                class="my-5 justify-center"
                v-else-if="!selectedInfo"
                v-text="$t('map.nothingSelected')"
              />
              <v-list v-else>
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
                        v-if="feature.key === 'location'"
                        class="grey--text"
                        v-text="
                          `[ ${selectedInfo.location.coordinates[1].toFixed(3)},
                  ${selectedInfo.location.coordinates[0].toFixed(3)}]`
                        "
                      />
                      <span
                        v-else-if="feature.key === 'probability'"
                        class="grey--text"
                        v-text="
                          (selectedInfo.probability * 100).toFixed(2) + ' %'
                        "
                      />
                      <span
                        v-else
                        class="grey--text"
                        v-text="selectedInfo[feature.key]"
                      />
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
                      v-if="
                        !selectedInfo[feature.key] ||
                          selectedInfo[feature.key].length === 0
                      "
                      v-text="$t('auth.foundNothing')"
                    />
                    <v-chip
                      v-else
                      small
                      class="ma-1 v-card--shaped shadow-sm"
                      :key="key"
                      v-for="(value, key) in selectedInfo[feature.key]"
                    >
                      <span v-if="!selectedInfo.user_id" v-text="key + ' : '" />
                      <span class="grey--text text--darken-2" v-text="value" />
                    </v-chip>
                  </div>
                </template>
              </v-list>
            </v-navigation-drawer>

            <v-progress-linear
              style="position: absolute; z-index: 1"
              v-if="symTrackLoaders.map"
              height="2"
              striped
              indeterminate
              color="primary"
            />
            <sym-track
              :selected-city="selectedCity"
              @updateSelectedInfo="updateSelectedInfo"
            />
          </v-card>

          <!--          <v-tabs show-arrows="mobile" fixed-tabs centered>-->
          <!--            <v-tab>-->
          <!--              {{ $t("map.globalStatistics") }}-->
          <!--            </v-tab>-->
          <!--            <v-tab>-->
          <!--              {{ $t("map.symptomTracker") }}-->
          <!--            </v-tab>-->
          <!--            <v-tab-item>-->
          <!--              <v-responsive-->
          <!--                :aspect-ratio="-->
          <!--                  $vuetify.breakpoint.smAndDown ? 12 / 14 : 16 / 12-->
          <!--                "-->
          <!--              >-->
          <!--                <iframe-->
          <!--                  src="https://public.domo.com/cards/dG1jy"-->
          <!--                  width="100%"-->
          <!--                  height="100%"-->
          <!--                  marginheight="0"-->
          <!--                  marginwidth="0"-->
          <!--                  frameborder="0"-->
          <!--                ></iframe>-->
          <!--              </v-responsive>-->
          <!--            </v-tab-item>-->
          <!--            <v-tab-item>-->
          <!--              <v-responsive-->
          <!--                :aspect-ratio="-->
          <!--                  $vuetify.breakpoint.smAndDown ? 12 / 18 : 18 / 12-->
          <!--                "-->
          <!--              >-->
          <!--                <sym-track class="mt-5 mx-1" style="height: 95%" />-->
          <!--              </v-responsive>-->
          <!--            </v-tab-item>-->
          <!--          </v-tabs>-->
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script>
import store from "@/store";
import SymTrack from "./Maps/SymTrack";
import {
  mdiBabyCarriage,
  mdiBackburger,
  mdiBandage,
  mdiCrosshairsGps,
  mdiForwardburger,
  mdiGenderMaleFemaleVariant,
  mdiInformation,
  mdiPercent
} from "@mdi/js";

export default {
  components: {
    SymTrack
  },
  data() {
    return {
      mdiBackburger,
      mdiForwardburger,
      mdiInformation,
      aggregates: [
        { key: "Total Symptom Reports", value: 3506 },
        { key: "Symptom Reports Yesterday", value: 0 },
        { key: "Symptom Reports to COVID Cases", value: "80%" },
        { key: "Most Reported Symptom", value: "Dry Cough" }
      ],
      sidebar: false,
      keyword: null,
      selectedCity: null,
      selectedInfo: null
    };
  },
  watch: {
    keyword(newValue) {
      if (newValue && newValue.length >= 2) {
        store.dispatch("setCities", { keyword: newValue, limit: 10 });
      }
    }
  },
  methods: {
    autoCompleteValue: item => item.city + ", " + item.country,
    updateSelectedInfo(newValue) {
      this.sidebar = true;
      this.selectedInfo = newValue;
    }
  },
  computed: {
    loadedCities: () => store.getters.getCities,
    symTrackLoaders: () => store.getters.getSymTrackLoaders,
    detailSingleFeatures() {
      if (!this.selectedInfo) return [];
      let gridDetailFeatures = [
        { name: "map.location", key: "location", icon: mdiCrosshairsGps }
      ];
      let userDetailFeatures = [
        { name: "map.location", key: "location", icon: mdiCrosshairsGps },
        {
          name: "auth.gender",
          key: "gender",
          icon: mdiGenderMaleFemaleVariant
        },
        { name: "auth.ageGroup", key: "age_group", icon: mdiBabyCarriage },
        {
          name: "auth.sicknessProbability",
          key: "probability",
          icon: mdiPercent
        }
      ];

      return this.selectedInfo.user_id
        ? userDetailFeatures
        : gridDetailFeatures;
    },
    detailListFeatures() {
      if (!this.selectedInfo) return [];
      let gridDetailFeatures = [
        {
          name: "auth.gender",
          key: "genders",
          icon: mdiGenderMaleFemaleVariant
        },
        { name: "auth.ageGroup", key: "ages", icon: mdiBabyCarriage },
        { name: "map.symptoms", key: "value", icon: mdiBandage }
      ];
      let userDetailFeatures = [
        { name: "map.symptoms", key: "value", icon: mdiBandage }
      ];

      return this.selectedInfo.user_id
        ? userDetailFeatures
        : gridDetailFeatures;
    }
  }
};
</script>

<style scoped>
.border-right {
  border-right: solid rgba(0, 0, 0, 0.1) 1px;
}
</style>
