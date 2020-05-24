<template>
  <v-footer padless class="white pb-md-0 pb-5">
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
        {{ $t("aboutSectionDescription") }}
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
                  @change="changeLang"
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
  import {mdiTelegram, mdiWeb, mdiYoutube} from "@mdi/js";
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
      this.$i18n.locale =
          store.getters.getLanguagePreference === null
              ? "en"
              : store.getters.getLanguagePreference;
    },
    methods: {
      changeLang() {
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
