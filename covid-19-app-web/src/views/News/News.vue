<template>
  <v-container class="news">
    <section class="col-lg-6">
      <v-row align="center">
        <v-col cols="6">
          <v-select
            :items="items"
            :menu-props="{ top: false, offsetY: true }"
            label="Scope"
          ></v-select>
        </v-col>
      </v-row>
    </section>
    <v-row no-gutters>
      <v-col :cols="8">
        <div v-for="newss in news" :key="newss._id">
          <v-card max-width="500" class="">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="headline text-wrap">{{
                  newss.title
                }}</v-list-item-title>
                <v-list-item-subtitle
                  >by {{ newss.source }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>

            <v-card-text v-html="newss.description"/>
            <v-card-actions>
              <v-btn
                text
                color="deep-purple accent-4"
                v-bind:href="newss.reference_link"
                target="blank"
              >
                Read
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
          <br />
          <br />
        </div>
      </v-col>

      <v-col :cols="4">
        <v-card>
          <v-tabs centered grow>
            <v-tab>Recent</v-tab>
            <v-tab>Most view</v-tab>
            <v-tab-item>
              <v-card flat tile>
                <div v-for="newsss in news" :key="newsss._id">
                <v-card-text>{{ newsss.title }}</v-card-text>
                <hr class="recent-v-card-text">
                </div>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat tile>
                <v-card-text>olllll</v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    items: ["Global", "Local"],
    news: []
  }),
  mounted() {
    axios
      .get("http://sym-track.herokuapp.com/api/news")
      .then(response => {
        this.news = response.data;
      })
      .catch(error => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.loading = false));
  }
};
</script>

<style scoped>
.wrap-text {
  -webkit-line-clamp: unset !important;
}
.recent-v-card-text{
  color: darkgray;
}
</style>
