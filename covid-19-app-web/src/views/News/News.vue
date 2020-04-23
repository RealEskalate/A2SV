<template>
  <v-container class="news">
    <section class="col-lg-6">
      <v-row align="center">
        <v-col cols="6">
          <v-select
            v-model="selected"
            :items="items"
            :menu-props="{ top: false, offsetY: true }"
            label="Scope"
          ></v-select>
        </v-col>
      </v-row>
    </section>
    <v-row no-gutters>
      <v-col :cols="8">
        <div v-if="selected == 'Global'">
          <div v-for="newss in visiblePages" :key="newss._id">
            <v-card max-width="500" class="">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="headline text-wrap">{{
                    newss.title
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    >by {{ newss.source }}
                    <v-spacer></v-spacer>
                    {{ getTime(newss.date) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-card-text v-html="newss.description" />
              <v-card-actions>
                <v-btn
                  text
                  color="deep-purple accent-4"
                  v-bind:href="newss.reference_link"
                  target="blank"
                >
                  Read
                </v-btn>
               </v-card-actions>
            </v-card>
            <br />
          </div>
          <v-pagination
            class="v-paggination"
            v-model="page"
            :length="Math.ceil(news.length / perPage)"
          ></v-pagination>
        </div>
        <div v-else>
          <div v-for="newss in visiblePages.slice(0, 3)" :key="newss._id">
            <v-card max-width="500" class="">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="headline text-wrap">{{
                    newss.title
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    >by {{ newss.source }}
                    <v-spacer></v-spacer>
                    {{ getTime(newss.date) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-card-text v-html="newss.description" />
              <v-card-actions>
                <v-btn
                  text
                  color="deep-purple accent-4"
                  v-bind:href="newss.reference_link"
                  target="blank"
                >
                  Read
                </v-btn>
              </v-card-actions>
            </v-card>
            <br />
          </div>
          <v-pagination
            class="v-paggination"
            v-model="page"
            :length="Math.ceil(news.length / perPage)"
          ></v-pagination>
        </div>
      </v-col>

      <v-col :cols="4">
        <v-card>
          <v-tabs centered grow>
            <v-tab>Recent</v-tab>
            <v-tab>Most view</v-tab>
            <v-tab-item>
              <v-card flat tile>
                <div
                  v-for="newsss in visiblePages.slice(0, 6)"
                  :key="newsss._id"
                >
                  <v-list-item
                    v-bind:href="newsss.reference_link"
                    target="blank"
                  >
                    <v-card-text>{{ newsss.title }}</v-card-text>
                  </v-list-item>

                  <hr class="recent-v-card-text" />
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
import moment from "moment";
export default {
  data: () => ({
    page: 1,
    perPage: 10,
    selected: "Global",
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
  },
  methods: {
    getTime(postDate) {
      postDate = moment(String(postDate)).format("MM/DD/YYYY hh:mm");
      return postDate;
    }
  },
  computed: {
    visiblePages() {
      return this.news.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage
      );
    }
  }
};
</script>

<style scoped>
.wrap-text {
  -webkit-line-clamp: unset !important;
  font-size: 1.15rem !important;
  line-height: 1.5rem;
}
.recent-v-card-text {
  color: darkgray;
}
.v-paggination {
  justify-content: start;
}
</style>
