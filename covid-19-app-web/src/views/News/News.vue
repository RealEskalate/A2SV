<template>
  <v-container class="news">
    <section class="col-lg-4">
      <v-select
        v-model="scope"
        :items="items"
        :menu-props="{ top: false, offsetY: true }"
        label="Scope"
        @change="scopeChange"
      ></v-select>

      <span v-if="scope === 'Local'" class="font-weight-medium">
        Country: {{ country }}</span
      >
    </section>
    <v-row no-gutters>
      <v-col class="pr-md-12" md="8" sm="12">
        <div>
          <v-toolbar color="" flat>
            <v-toolbar-title>News</v-toolbar-title>

            <v-spacer></v-spacer>
          </v-toolbar>

          <v-list two-line>
            <v-list-item-group>
              <template v-for="(item, index) in news">
                <v-list-item
                  :key="item.title"
                  data-aos="fade-up"
                  data-aos-delay="50"
                  data-aos-duration="1000"
                  data-aos-easing="ease-in-out"
                  data-aos-anchor-placement="top-bottom"
                  data-aos-once="true"
                >
                  <v-list-item-content class="py-6">
                    <v-list-item-title
                      :elevation="24"
                      v-text="item.title"
                      class="text-wrap black--text font-weight-medium"
                    ></v-list-item-title>
                    <v-list-item-subtitle>
                      <v-btn
                        class="my-3"
                        v-bind:href="item.reference_link"
                        target="blank"
                        small
                        outlined
                        >read more</v-btn
                      >
                    </v-list-item-subtitle>

                    <div>
                      <v-list-item-subtitle
                        v-text="getTime(item.date)"
                        style="display:inline"
                      >
                      </v-list-item-subtitle>
                      <v-icon class="mx-1" size="20px"
                        >mdi-clock-outline</v-icon
                      >
                    </div>
                    <v-list-item-subtitle
                      >by {{ item.source }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>

                <v-divider
                  v-if="index + 1 < news.length"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </div>

        <v-pagination
          class="v-paggination"
          v-model="page"
          :length="10"
          @input="getNewsByPage(page)"
        ></v-pagination>
      </v-col>
      <v-spacer />
      <v-col class="pl-md-10 mt-sm-4" md="4" sm="12">
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
            ></v-checkbox>
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
      postDate = moment(String(postDate)).format("MM/DD/YYYY hh:mm");
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
</style>
