<template>
  <v-footer padless class="white">
    <v-card flat tile class="lighten-1 text-center" shaped outlined>
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
        <v-btn text small v-text="'Resources'" href="/" /> |
        <v-btn text small v-text="'Terms of Privacy'" href="/" /> |
        <span class="pa-3">
          {{ new Date().getFullYear() }} — <strong>TrackSym</strong>
        </span>
        |
        <div class="d-inline-block justify-end" style="width: 50px">
          <v-select
            solo
            flat
            dense
            v-model="$i18n.locale"
            :items="languages"
            label="Lang"
          >
            <template v-slot:append>
              <small />
            </template>
            <template v-slot:selection="{ item }">
              <small class="primary--text" v-text="langText[item]" />
            </template>
            <template v-slot:item="{ item }">
              <small v-text="langText[item]" />
            </template>
          </v-select>
        </div>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
import { mdiTelegram, mdiWeb, mdiYoutube } from "@mdi/js";
import store from "@/store/";

export default {
  data: () => ({
    languages: ["en", "am"],
    langText: {
      en: "EN",
      am: "አማ"
    },
    icons: [
      { link: "http://a2sv.org/", icon: mdiWeb },
      { link: "http://www.youtube.com/", icon: mdiYoutube },
      { link: "http://www.youtube.com/", icon: mdiTelegram }
    ]
  }),
  mounted() {
    console.log(store.getters.getLanguagePreference);
    this.$i18n.locale =
      store.getters.getLanguagePreference !== null
        ? store.getters.getLanguagePreference
        : "en";
  },
  methods: {
    changeLang() {
      console.log(this.$i18n.locale);
      store.dispatch("setLanguagePreference", { lang: this.$i18n.locale });
    }
  }
};
</script>

<style scoped>
.list {
  background: none;
}
</style>
