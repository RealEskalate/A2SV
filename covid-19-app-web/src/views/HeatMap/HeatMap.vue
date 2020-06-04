<template>
  <section class="map pb-10">
    <v-container>
      <v-row>
        <v-col>
          <h3 class="display-1 font-weight-thin mb-5" v-text="'Heat Map'" />
          <v-tabs fixed-tabs centered>
            <v-tab>
              Symptom Tracker
            </v-tab>
            <v-tab>
              Global Statistics
            </v-tab>
            <v-tab-item>
              <v-responsive
                :aspect-ratio="
                  $vuetify.breakpoint.smAndDown ? 12 / 13 : 16 / 10
                "
              >
                <sym-track class="mx-md-5 my-5" style="height: 100%" />
              </v-responsive>
            </v-tab-item>
            <v-tab-item>
              <v-responsive
                :aspect-ratio="
                  $vuetify.breakpoint.smAndDown ? 12 / 16 : 16 / 13
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
                <!--            <iframe-->
                <!--              src="https://public.domo.com/cards/bWxVg"-->
                <!--              width="100%"-->
                <!--              height="100%"-->
                <!--              marginheight="0"-->
                <!--              marginwidth="0"-->
                <!--              frameborder="0"-->
                <!--            />-->
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
