<template>
  <v-container class="white">
    <v-app-bar
      app
      flat
      class="white"
      style="border-radius: 0 0 25px 0"
      :class="{ shadow: raise }"
    >
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown && navOption === '2'"
        @click.stop="drawer = !drawer"
      />
      <router-link data-v-step="0" class="d-flex align-center" to="/">
        <v-img
          alt="Company Logo"
          class="shrink ml-3"
          contain
          src="/img/brand/blue.png"
          style="transition: width 0.2s ease"
          :width="brandWidth"
        />
      </router-link>

      <v-spacer />
      <v-btn
        :key="link.to"
        :to="link.to"
        text
        v-for="link in links"
        active-class="border-bottom"
        class="hidden-sm-and-down v-card--shaped nav-btn"
      >
        <span class="text-capitalize"> {{ $t(link.text) }}</span>
      </v-btn>
      <v-divider class="mx-2" vertical light />
      <div class="justify-end pt-7" style="width: 50px" data-v-step="4">
        <v-select
          solo
          flat
          dense
          v-model="$i18n.locale"
          :items="languages"
          @change="changeLang"
        >
          <template v-slot:append>
            <small />
          </template>
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
    </v-app-bar>
    <v-bottom-navigation
      v-if="$vuetify.breakpoint.smAndDown"
      app
      grow
      color="primary"
      style="border-radius: 20px 0 0 0"
      class="px-3 overflow-hidden"
    >
      <v-btn v-for="(item, i) in links" :to="item.to" :key="i">
        <span>{{ $t(item.text) }}</span>
        <v-icon> {{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
import store from "@/store/";
import {
  mdiBookOpenVariant,
  mdiDotsVertical,
  mdiHome,
  mdiInformation,
  mdiMap,
  mdiNewspaper
} from "@mdi/js";

export default {
  data: () => {
    return {
      mdiDotsVertical,
      drawer: false,
      navType: store.getters.getNavigationType,
      locationY: 0,
      curRoute: 0,
      activeBtn: 0,
      languages: ["en", "am"],
      langText: {
        en: "EN",
        am: "አማ"
      },
      links: [
        { text: "navbar.home", icon: mdiHome, to: "/" },
        {
          text: "navbar.learn",
          icon: mdiBookOpenVariant,
          to: "/information"
        },
        { text: "navbar.about", icon: mdiInformation, to: "/about" },
        { text: "navbar.news", icon: mdiNewspaper, to: "/news" },
        { text: "navbar.map", icon: mdiMap, to: "/map" }
      ]
    };
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.locationY = window.scrollY;
    },
    changeLang() {
      store.dispatch("setLanguagePreference", { lang: this.$i18n.locale });
    }
  },
  computed: {
    raise() {
      return this.locationY > 50;
    },
    brandWidth() {
      return this.locationY > 50 ? 125 : 135;
    },
    navOption() {
      return this.navType;
    }
  }
};
</script>

<style scoped>
.border-bottom {
  border-bottom: #009ce5 solid 3px !important;
}

.v-btn--active.border-bottom::before {
  opacity: 0 !important;
}

.nav-btn {
  border-bottom: white solid 2px;
  transition: border-bottom-color 1s;
}

.nav-item span {
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  color: #47536e !important;
}

.active-bottom .v-icon {
  transform: scale(1.3) !important;
  -webkit-transform: scale(1.3) !important;
  -moz-transform: scale(1.3) !important;
  -o-transform: scale(1.3) !important;
}
</style>
