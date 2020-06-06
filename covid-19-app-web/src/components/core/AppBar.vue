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
        :to="{ name: link.to }"
        text
        v-for="link in links"
        active-class="border-bottom"
        class="hidden-sm-and-down v-card--shaped nav-btn"
        exact
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
      <v-divider class="mr-2" vertical light />
      <v-btn
        small
        dark
        color="primary"
        v-if="!loggedInUser"
        class="v-card--shaped mx-1"
        depressed
        to="login"
        v-text="'Login'"
      />
      <v-menu offset-y v-else>
        <template v-slot:activator="{ on }">
          <v-btn fab text small color="primary" v-on="on">
            <v-icon small v-text="mdiAccountCog" />
          </v-btn>
        </template>
        <v-list class="py-0">
          <template v-for="(item, index) in more_links">
            <v-divider v-if="index !== 0" :key="index" />
            <v-list-item
              link
              :key="index"
              :to="item.to"
              active-class="white--text primary"
            >
              <v-icon small class="mr-2" v-text="item.icon" />
              <v-list-item-content>
                <small v-text="$t(item.text)" />
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-divider />
          <v-list-item link active-class="white--text primary" @click="logout">
            <v-icon small class="mr-2" v-text="mdiLogoutVariant" />
            <v-list-item-content>
              <small v-text="'Logout'" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
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
import router from "@/router/";
import {
  mdiAccountCog,
  mdiAccountEdit,
  mdiBookOpenVariant,
  mdiHome,
  mdiInformation,
  mdiLogoutVariant,
  mdiMap,
  mdiNewspaper
} from "@mdi/js";
import { languages } from "../../plugins/i18n";

export default {
  data: () => {
    return {
      mdiAccountCog,
      mdiLogoutVariant,
      drawer: false,
      navType: store.getters.getNavigationType,
      locationY: 0,
      curRoute: 0,
      activeBtn: 0,
      languages,
      langText: {
        en: "EN",
        am: "አማ",
        ao: "AO"
      },
      links: [
        { text: "navbar.home", icon: mdiHome, to: "Home" },
        {
          text: "navbar.learn",
          icon: mdiBookOpenVariant,
          to: "Learn"
        },
        { text: "navbar.about", icon: mdiInformation, to: "About" },
        { text: "navbar.news", icon: mdiNewspaper, to: "News" },
        { text: "navbar.map", icon: mdiMap, to: "Map" }
      ],
      more_links: [
        { text: "navbar.profile", icon: mdiAccountEdit, to: "profile" }
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
      router.replace({ params: { lang: this.$i18n.locale } }).catch(() => {});
    },
    logout() {
      store.dispatch("setToken", { token: null });
      store.dispatch("setUser", { user: null });
      router.replace("/");
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
.v-select-list {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
