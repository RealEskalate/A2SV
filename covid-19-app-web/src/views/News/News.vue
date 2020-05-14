<template>
  <v-container class="news">
    <v-row no-gutters>
      <v-col class="pr-md-12" md="8" sm="12">
        <v-row>
          <v-col cols="12" md="8">
            <h3 class="display-1 font-weight-thin mb-10" v-text="'News'" />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="country"
              :items="countries"
              label="Country"
              item-text="name"
              item-value="name"
              outlined
              dense
              @input="resetPage"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-fade-transition hide-on-leave>
              <v-skeleton-loader
                ref="skeleton"
                type="list-item-avatar-three-line,divider"
                class="mx-auto mb-2"
                v-if="loaders.list"
              />
              <p
                v-else-if="news && news.length === 0"
                class="text-center grey--text text--darken-1"
                v-text="'Found Nothing'"
              />
              <v-list v-else three-line>
                <template v-for="item in news">
                  <v-list-item :key="item.title">
                    <v-list-item-avatar height="50" width="50">
                      <v-img
                        contain
                        :src="clearBitLogo(item.reference_link)"
                        lazy-src="/img/news/avatar.png"
                      />
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <span class="overline" v-text="item.source" />
                      <h4 class="font-weight-medium" v-html="item.title" />
                      <div class="my-1">
                        <v-list-item-subtitle
                          v-text="getTime(item.date)"
                          style="display:inline"
                        />
                        <v-btn
                          tile
                          x-small
                          outlined
                          class="float-right"
                          :href="item.reference_link"
                          v-text="'Read More'"
                          target="blank"
                        />
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider :key="item.id" />
                </template>
              </v-list>
            </v-fade-transition>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="2">
            <v-select
              v-model="size"
              :items="sizes"
              label="Show"
              outlined
              dense
              @input="resetPage"
            />
          </v-col>
          <v-col cols="12" md="10">
            <v-pagination
              class="justify-end"
              v-model="page"
              total-visible="7"
              :length="Math.floor((totalCount || 0) / size)"
              @input="fetchNews"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col class="pl-md-10 mt-sm-4" md="4" sm="12">
        <v-card shaped outlined>
          <v-list>
            <v-subheader v-text="'Sources'" />
            <v-fade-transition hide-on-leave>
              <v-skeleton-loader
                ref="skeleton"
                type="list-item-avatar,list-item-avatar,list-item-avatar,list-item-avatar,list-item-avatar,list-item-avatar,list-item-avatar"
                class="mx-auto"
                v-if="loaders.sources"
              />
              <p
                class="text-muted text-center mt-3"
                v-else-if="sourceList.length === 0"
                v-text="'Found Nothing'"
              />
              <v-list-item-group
                @change="resetPage"
                v-else
                color="primary"
                multiple
                v-model="sources"
              >
                <v-list-item
                  :key="i"
                  class="px-5"
                  v-for="(source, i) in sourceList"
                  :value="source"
                >
                  <template v-slot:default="{ active, toggle }">
                    <v-list-item-avatar>
                      <v-img
                        :src="imageUrl(source)"
                        :lazy-src="imageUrl(source)"
                      />
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title v-text="source" />
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-checkbox
                        :input-value="active"
                        :true-value="source"
                        @click="toggle"
                      />
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-fade-transition>
          </v-list>
        </v-card>
        <v-btn
          text
          small
          target="_blank"
          href="https://clearbit.com"
          v-text="'Logos provided by Clearbit'"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment/src/moment";
import store from "@/store/";

export default {
  data() {
    return {
      page: 1,
      size: 10,
      sizes: [5, 10, 25, 50, 100],
      country: "World",
      sources: []
    };
  },
  methods: {
    resetPage() {
      this.page = 1;
      this.fetchNews();
    },
    fetchNews() {
      store.dispatch("setNews", {
        page: this.page,
        size: this.size,
        country: this.country,
        sources: this.sources
      });
    },
    clearBitLogo(link) {
      return `https://logo.clearbit.com/${this.getPageUrl(link)}`;
    },
    getPageUrl(link) {
      let domain = link.split("/")[2] || "";
      domain = domain.split(".");
      if (domain.length >= 3) domain.shift();
      return domain.join(".");
    },
    getTime(postDate) {
      return moment(String(postDate || "")).format("hh:mm A - MMM DD, YYYY");
    },
    imageUrl(source) {
      const newsImgPath = "/img/news";
      switch (source) {
        case "CDC Newsroom":
          return `${newsImgPath}/cdc.png`;
        case "CNN":
          return `${newsImgPath}/cnn.png`;
        case "BBC News":
          return `${newsImgPath}/bbc.png`;
        case "NPR":
          return `${newsImgPath}/npr.png`;
        case "World Health Organization":
          return `${newsImgPath}/who.png`;
        case "The Guardian":
          return `${newsImgPath}/guardian.png`;
        case "Global News":
          return `${newsImgPath}/global-news.png`;
        default:
          return `${newsImgPath}/avatar.png`;
      }
    }
  },
  watch: {
    localCountry(newValue) {
      this.country = newValue;
      this.resetPage();
    }
  },
  mounted() {
    store.dispatch("setSources");
    store.dispatch("setCurrentCountry");
  },
  computed: {
    news: () => store.getters.getNews,
    countries: () => store.getters.getAllCountries,
    localCountry: () => store.getters.getCurrentCountry,
    totalCount: () => store.getters.getTotalCount,
    sourceList: () => store.getters.getSources,
    loaders: () => store.getters.getNewsLoaders
  }
};
</script>
