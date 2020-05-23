<template>
  <v-footer padless>
    <v-card flat tile class="lighten-1 text-center">
      <v-divider />
      <v-card-text>
        <v-btn
          v-for="(icon, i) in icons"
          class="mx-2 pa-3"
          :href="icon.link"
          target="_blank"
          :key="i"
          icon
        >
          <v-icon size="23px" v-text="icon.icon" />
        </v-btn>
      </v-card-text>

      <v-card-text class="pt-0 px-12 shrink">
        TrackSym is a non-commercial app that uses crowd-sourcing to collect and
        visualize the density of the relevant symptoms. Registration only asks
        about age and gender to be used for data science purposes. Users can
        anonymously report symptoms and choose a location to see the density of
        symptoms in a map view. The data is aggregated by places, therefore, the
        app can help people avoid visiting a grocery store or a gas station that
        is heavily used by symptomatic people.
      </v-card-text>

      <v-card-text>
        <select v-model="$i18n.locale" @change="changeLang">
          <option
                  v-for="(lang, i) in languageArray"
                  :key="`lang${i}`"
                  :value="lang"
          >
            {{ lang }}
          </option>
        </select>
        <v-btn text small v-text="'Resources'" href="/" /> |
        <v-btn text small v-text="'Terms of Privacy'" href="/" /> |
        <span class="pa-3">
          {{ new Date().getFullYear() }} — <strong>TrackSym</strong>
        </span>
      </v-card-text>
    </v-card>
  </v-footer>
  <!--  <v-footer class="v-card&#45;&#45;raised">-->
  <!--    <v-container class="my-2">-->
  <!--      <v-layout row wrap>-->
  <!--        <v-flex xs12 md3 class="mx-2 sm12">-->
  <!--          <p class="font-weight-bold ml-3">Get our App</p>-->
  <!--          <v-divider class="mx-1" />-->
  <!--          <v-row>-->
  <!--            <v-col cols="6">-->
  <!--              <router-link to="/" target="_blank">-->
  <!--                <v-img-->
  <!--                  class="v-card"-->
  <!--                  src="/img/footer/app-store.svg"-->
  <!--                  max-width="10.5em"-->
  <!--                />-->
  <!--              </router-link>-->
  <!--            </v-col>-->
  <!--            <v-col cols="6">-->
  <!--              <router-link to="/" target="_blank">-->
  <!--                <v-img-->
  <!--                  class="v-card"-->
  <!--                  src="/img/footer/google-play.svg"-->
  <!--                  max-width="10.5em"-->
  <!--                />-->
  <!--              </router-link>-->
  <!--            </v-col>-->
  <!--          </v-row>-->
  <!--        </v-flex>-->
  <!--        <v-flex xs12 md6 class="mx-4">-->
  <!--          <p class="font-weight-bold text-center">About</p>-->
  <!--          <v-divider class="mx-4" />-->
  <!--          <v-col>-->
  <!--            <span class="text-justify">-->
  <!--              Our App is a non-commercial app that uses crowd-sourcing to-->
  <!--              collect and visualize the density of the relevant Covid-19-->
  <!--              symptoms.-->
  <!--              <br />-->
  <!--              In addition it provide Play-ground for the Data and News related-->
  <!--              to Covid-19 by country.-->
  <!--            </span>-->
  <!--          </v-col>-->
  <!--        </v-flex>-->

  <!--        <v-flex xs12 md2 class="mx-2">-->
  <!--          <p class="font-weight-bold text-center">More info</p>-->
  <!--          <v-divider class="mx-4" />-->
  <!--          <v-col class="text-center">-->
  <!--            <v-btn-->
  <!--              v-for="icon in icons"-->
  <!--              :key="icon[0]"-->
  <!--              class="mx-2 black&#45;&#45;text"-->
  <!--              icon-->
  <!--              v-bind:href="icon[1]"-->
  <!--              target="blank"-->
  <!--            >-->
  <!--              <v-icon size="24px">{{ icon[0] }}</v-icon>-->
  <!--            </v-btn>-->
  <!--          </v-col>-->
  <!--          <router-link class="text-center d-block mx-auto" to="about#input-204"-->
  <!--            >Contact us</router-link-->
  <!--          >-->
  <!--        </v-flex>-->
  <!--      </v-layout>-->
  <!--      <div class="text-center black&#45;&#45;text mb-12 mb-md-0">-->
  <!--        Copyright &copy; <strong>A2SV</strong>-->
  <!--        {{ new Date().getFullYear() }}-->
  <!--      </div>-->
  <!--    </v-container>-->
  <!--  </v-footer>-->
</template>

<script>
  import {mdiTelegram, mdiWeb, mdiYoutube} from "@mdi/js";
  import store from "@/store/";

  export default {
  data: () => ({
    languageArray: ['en', 'am'],
    languages: [
      {name: "English", value: "en"},
      {name: "Amharic", value: "am"}
    ],
    icons: [
      { link: "http://a2sv.org/", icon: mdiWeb },
      { link: "http://www.youtube.com/", icon: mdiYoutube },
      { link: "http://www.youtube.com/", icon: mdiTelegram }
    ]
    //https://www.ctech.co.ke/wp-content/uploads/2019/09/Home-Page_Layer-Slider-BG-1024x426.png
    //https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png
    //https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png
    //https://www.designbolts.com/wp-content/uploads/2012/12/Triangle-White-Seamless-Patterns.jpg
  }),
    mounted() {
      console.log(store.getters.getLanguagePreference);
      this.$i18n.locale = store.getters.getLanguagePreference !== undefined ? store.getters.getLanguagePreference : "en";
    },
    methods: {
      changeLang() {
        console.log(this.$i18n.locale);
        store.dispatch("setLanguagePreference", {lang: this.$i18n.locale});
      }
    }
};
</script>

<style scoped>
.list {
  background: none;
}
</style>
