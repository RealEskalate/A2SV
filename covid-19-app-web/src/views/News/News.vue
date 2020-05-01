<template>
  <v-container class="news">
    <section class="col-lg-6">
      <v-select
        v-model="scope"
        :items="items"
        :menu-props="{ top: false, offsetY: true }"
        label="Scope"
        @change="scopeChange"
      />

      <span v-if="scope === 'Local'" class="font-weight-medium">
        Country: {{ country }}</span
      >
    </section>
    <v-row no-gutters>
      <v-col :cols="7">
        <div>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>News</v-toolbar-title>

            <v-spacer />
          </v-toolbar>

          <v-list two-line>
            <v-list-item-group>
              <template v-for="(item, index) in news">
                <v-list-item
                  :key="item.title"
                  v-bind:href="item.reference_link"
                  target="blank"
                >
                  <v-list-item-content class="py-6">
                    <v-list-item-title
                      :elevation="24"
                      v-text="item.title"
                      class="text-wrap black--text font-weight-medium"
                    />
                    <v-list-item-subtitle
                      class="text-wrap"
                      v-html="item.description"
                    />

                    <v-list-item-subtitle v-text="item.source" />
                    <v-list-item-subtitle v-text="getTime(item.date)" />
                  </v-list-item-content>
                </v-list-item>

                <v-divider v-if="index + 1 < news.length" :key="index" />
              </template>
            </v-list-item-group>
          </v-list>
        </div>

        <v-pagination
          class="v-paggination"
          v-model="page"
          :length="10"
          @input="getNewsByPage(page)"
        />
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
                  />
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
      postDate = moment(String(postDate)).format("LLLL");
      return postDate;
    },
    getNewsByPage(page) {
      store.dispatch("setNews", {
        page: page,
        country: this.country,
        source: this.selectedSources
      });
    }
  },
  mounted() {
    this.getNewsByPage(this.page);
    store.dispatch("setCountry");
    store.dispatch("setSources");
  },
  getTime(postDate) {
    postDate = moment(String(postDate)).format("MM/DD/YYYY hh:mm");
    return postDate;
  },
  getNewsByPage(page) {
    store.dispatch("setNews", {
      page: page,
      country: this.country,
      source: this.selectedSources
    });
  },
  computed: {
    country() {
      return this.scope === "Global" ? "Global" : store.getters.getCountry;
    },
    sourceList() {
      return store.getters.getSources;
    },
    news() {
      return store.getters.getNews;
    },
    selectedSources() {
      return this.sources.length === 0 ? [] : [this.sources];
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

.shadow {
  box-shadow: 0 5px 15px 10px #eae6e6;
}

.headline {
  font-family: Nunito, Roboto, sans-serif;
}
</style>
