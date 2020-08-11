<template>
  <section class="map pb-5">
    <v-container>
      <!--      <h3 class="display-1 font-weight-thin mb-5">-->
      <!--        &lt;!&ndash;            {{ $t("navbar.map") }}&ndash;&gt;-->
      <!--        Reported Symptom Tracking-->
      <!--      </h3>-->

      <v-row class="my-5">
        <v-col cols="12">
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
                <p class="text-center" v-text="$t(item.key)" />
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
          <sym-track class="mt-5 mx-1" style="height: 65vh" />

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
import SymTrack from "./Maps/SymTrack";
import { mdiInformation } from "@mdi/js";

export default {
  components: {
    SymTrack
  },
  data() {
    return {
      mdiInformation,
      aggregates: [
        { key: "Total Symptom Reports", value: 3506 },
        { key: "Symptom Reports Yesterday", value: 0 },
        { key: "Symptom Reports to COVID Cases", value: 0.8 },
        { key: "Most Reported Symptom", value: "Dry Cough" }
      ]
    };
  }
};
</script>

<style scoped>
.border-right {
  border-right: solid rgba(0, 0, 0, 0.1) 1px;
}
</style>
