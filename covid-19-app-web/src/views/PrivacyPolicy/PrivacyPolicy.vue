<template>
  <v-container v-html="privacyPolicy[0].description"> </v-container>
</template>

<script>
import store from "@/store/";

export default {
  name: "PrivacyPolicy",
  mounted() {
    store.dispatch("setPrivacyPolicy", { lang: this.$i18n.locale });
  },
  computed: {
    privacyPolicy: () => store.getters.getPrivacyPolicy
  }
};
</script>

