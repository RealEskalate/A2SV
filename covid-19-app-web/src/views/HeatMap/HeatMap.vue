<template>
  <section class="map pb-5">
    <v-container>
      <v-row>
        <v-col>
          <h3 class="display-1 font-weight-thin mb-5" v-text="'Heat Map'" />
          <v-tabs show-arrows fixed-tabs centered>
            <v-tab v-if="loggedInUser">
              Symptom Tracker
            </v-tab>
            <v-tab>
              Global Statistics
            </v-tab>
            <v-tab-item v-if="loggedInUser">
              <v-responsive
                :aspect-ratio="
                  $vuetify.breakpoint.smAndDown ? 12 / 18 : 18 / 12
                "
              >
                <sym-track class="mt-5" style="height: 95%" />
              </v-responsive>
            </v-tab-item>
            <v-tab-item>
              <v-responsive
                :aspect-ratio="
                  $vuetify.breakpoint.smAndDown ? 12 / 14 : 16 / 12
                "
              >
                <iframe
                  src="https://public.domo.com/cards/dG1jy"
                  width="100%"
                  height="100%"
                  marginheight="0"
                  marginwidth="0"
                  frameborder="0"
                ></iframe>
              </v-responsive>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script>
import SymTrack from "./Maps/SymTrack";

export default {
  components: {
    SymTrack
  }
};
</script>
