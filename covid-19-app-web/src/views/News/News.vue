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
            @change="scopeChange"
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
          :length="10"
          @input="getNewsByPage(page)"
        ></v-pagination>
      </v-col>

      <v-col :cols="4">
        <v-card>
          <v-tabs centered grow>
            <v-tab>Recent</v-tab>
            <v-tab>Source</v-tab>
            <v-tab-item>
              <v-card flat tile>
                <div v-for="newsss in news.slice(0, 5)" :key="newsss._id">
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
                <v-card-text>
                  <p>{{ sources }}</p>
                  <v-checkbox
                    v-model="sources"
                    label="CNN"
                    value="CNN"
                    @change="sourceChange"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="sources"
                    label="NPR"
                    value="NPR"
                    @change="sourceChange"
                  ></v-checkbox>
                </v-card-text>
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
    perPage: 15,
    selected: "Global",
    items: ["Global", "Local"],
    sources: [],
    news: [],
    baseUrl: "http://sym-track.herokuapp.com/api/news?country=Global",
    country: ""
  }),
  mounted() {
    this.getNewsByPage(this.page);
  },
  methods: {
    async scopeChange() {
      if (this.selected == this.items[0]) {
        this.page = 1;
        this.baseUrl = "http://sym-track.herokuapp.com/api/news?country=Global";
        this.getNewsByPage(this.page);
      } else {
        if (this.country == "") {
          await axios.get("http://ip-api.com/json").then(response => {
            this.country = response.data.country;
            this.baseUrl =
              "http://sym-track.herokuapp.com/api/news?country=" + this.country;
            this.getNewsByPage(this.page);
          });
        } else {
          this.baseUrl =
            "http://sym-track.herokuapp.com/api/news?country=" + this.country;
          this.getNewsByPage(this.page);
        }
      }
    },
    sourceChange() {
      if (this.sources.length !== 0) {
        this.baseUrl += "&source=" + this.sources[0];
      } else {
        if (this.selected == "Global") {
          this.baseUrl =
            "http://sym-track.herokuapp.com/api/news?country=Global";
        } else {
          this.baseUrl =
            "http://sym-track.herokuapp.com/api/news?country=Ethiopia";
        }
      }
      this.getNewsByPage(this.page);
    },
    getTime(postDate) {
      postDate = moment(String(postDate)).format("MM/DD/YYYY hh:mm");
      return postDate;
    },
    getNewsByPage(page_num) {
      if (this.selected == "Global") {
        axios.get(this.baseUrl + "&page=" + page_num).then(response => {
          this.news = response.data;
          return this.news;
        });
      } else {
        axios.get(this.baseUrl + "&page=" + page_num).then(response => {
          this.news = response.data;
          return this.news;
        });
      }
    },
    async getCountry() {
      await axios.get("http://ip-api.com/json").then(response => {
        this.country = response.data.country;
      });
    }
  },
  computed: {}
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
