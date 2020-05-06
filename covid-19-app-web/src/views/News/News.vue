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
      <v-col class="pr-12" cols="8">
        <div>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>News</v-toolbar-title>

            <v-spacer />
          </v-toolbar>

          <v-list two-line>
            <v-list-item-group>
              <template v-for="(item, index) in news">
                <v-list-item :key="item.title">
                  <v-list-item-content class="py-6">
                    <v-list-item-subtitle
                      class="overline mb-2"
                      v-text="item.source"
                    />
                    <v-list-item-title
                      :elevation="24"
                      v-text="item.title"
                      class="text-wrap black--text font-weight-medium"
                    />
                    <v-list-item-subtitle class="mt-2">
                      <v-list-item-subtitle
                        class="d-inline-block"
                        v-text="getTime(item.date)"
                      />
                      <v-btn
                        class="float-right"
                        x-small
                        v-bind:href="item.reference_link"
                        target="blank"
                        outlined
                        >Read More</v-btn
                      >
                    </v-list-item-subtitle>
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
      <v-spacer />
      <v-col class="pl-10" cols="4">
        <v-card tile :elevation="10">
          <v-card-title>Source</v-card-title>
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
