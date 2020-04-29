<template>
  <v-container class="news">
    <section class="col-lg-6">
      <v-row align="center">
        <v-col cols="6">
          <v-select
            v-model="scope"
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
        <div v-for="_news in news" :key="_news._id">
          <v-card max-width="500" class="">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="headline text-wrap">{{
                  _news.title
                }}</v-list-item-title>
                <v-list-item-subtitle
                  >by {{ _news.source }}
                  <v-spacer></v-spacer>
                  {{ getTime(_news.date) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-card-text v-html="_news.description" />
            <v-card-actions>
              <v-btn
                text
                color="deep-purple accent-4"
                v-bind:href="_news.reference_link"
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
                <div v-for="_news in news.slice(0, 5)" :key="_news._id">
                  <v-list-item
                    v-bind:href="_news.reference_link"
                    target="blank"
                  >
                    <v-card-text>{{ _news.title }}</v-card-text>
                  </v-list-item>

                  <hr class="recent-v-card-text" />
                </div>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat tile>
                <v-card-text>
                   <v-checkbox
                    v-for="(sourceItem, index) in sourceList"
                    :key="index"
                    v-model="sources"
                    :label="sourceItem"
                    :value="sourceItem"
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
  import moment from "moment";
  import store from "@/store/";

  export default {
  data: () => ({
    page: 1,
    perPage: 15,
    scope: "Global",
    items: ["Global", "Local"],
    sources: []
  }),
  methods: {
    async scopeChange() {
      this.getNewsByPage(this.page);
    },
    sourceChange() {
      this.getNewsByPage(this.page);
    },
    getTime(postDate) {
      postDate = moment(String(postDate)).format("MM/DD/YYYY hh:mm");
      return postDate;
    },
    getNewsByPage(page) {
      store.dispatch('setNews', {page: page, country: this.scope, source: this.selectedSources});
    },
  },
  mounted() {
    this.getNewsByPage(this.page);
    store.dispatch('setCountry');
    store.dispatch('setSources');
  },
  computed: {
    country() {
      return this.scope === 'Global' ? 'Global' : store.getters.getCountry;
    },
    sourceList() {
      return store.getters.getSources;
    },
    news() {
      return store.getters.getNews;
    },
    selectedSources() {
      return this.sources.length === 0 ? '' : this.sources[0];
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
