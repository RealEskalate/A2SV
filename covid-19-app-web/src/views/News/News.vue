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
            <v-col md="8" sm="12">
                <div v-for="_news in news" :key="_news._id">
                    <v-card max-width="650" class="shadow">
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="headline">
                                    {{ _news.title }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-card-subtitle>
                            <v-icon class="mr-2 v-size--small">mdi-clock-outline</v-icon>
                            <small>
                                {{ getTime(_news.date) }}
                            </small>
                        </v-card-subtitle>
                        <v-card-text v-html="_news.description"/>
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
                    <br/>
                </div>
                <v-pagination
                        class="v-paggination"
                        v-model="page"
                        :length="10"
                        @input="getNewsByPage(page)"
                ></v-pagination>
            </v-col>

            <v-col md="4" sm="12" class="mt-sm-5">
                <v-card class="shadow">
                    <v-tabs centered grow>
                        <v-tab>Recent</v-tab>
                        <v-tab>Source</v-tab>
                        <v-tab-item>
                            <v-card flat tile class="">
                                <v-list v-for="_news in news.slice(0, 5)" :key="_news._id">
                                    <v-list-item
                                            v-bind:href="_news.reference_link"
                                            target="blank"
                                    >
                                        <v-card-text>{{ _news.title }}</v-card-text>
                                    </v-list-item>
                                    <v-divider/>
                                </v-list>
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
        postDate = moment(String(postDate)).format('LLLL');
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
