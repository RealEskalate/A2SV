<template>
  <v-footer padless class="white pb-md-0 pb-5">
    <v-card
      flat
      tile
      class="lighten-1 text-center"
      style="width: 100%"
      shaped
      outlined
    >
      <v-card-text>
        <v-btn
          v-for="(icon, i) in icons"
          :href="icon.link"
          target="_blank"
          class="mx-2"
          :key="i"
          depressed
          small
          fab
        >
          <v-icon size="23px" v-text="icon.icon" />
        </v-btn>
      </v-card-text>

      <v-card-text class="pt-0 px-12 shrink">
        {{ $t("aboutSectionDescription") }}
      </v-card-text>

      <v-card-text>
        <v-btn text small v-text="$t('references')" to="references" />
        |
        <v-btn text small v-text="$t('privacy')" to="privacy-policy" />
        |
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
import { mdiWeb } from "@mdi/js";

export default {
  data: () => ({
    languages: ["en", "am"],
    langText: {
      en: "EN",
      am: "አማ"
    },
    icons: [{ link: "http://a2sv.org/", icon: mdiWeb }]
  })
};
</script>

<style scoped>
.list {
  background: none;
}
</style>
