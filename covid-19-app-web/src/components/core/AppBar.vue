<template>
  <v-container class="white">
    <v-app-bar
      app
      style="border-radius: 0 0 25px 0"
      class="white"
      flat
      v-bind:class="{ shadow: raise }"
    >
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown && navOption === '2'"
        @click.stop="drawer = !drawer"
      />
      <router-link class="d-flex align-center" to="/">
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
        <span class="text-capitalize"> {{ $t(link.text.toLowerCase()) }}</span>
      </v-btn>
      <v-divider class="mx-2" vertical light />
      <div class="justify-end pt-7" style="width: 50px">
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
    <v-container v-if="$vuetify.breakpoint.smAndDown">
      <v-navigation-drawer
        v-model="drawer"
        temporary
        app
        overflow
        v-if="curNavigation === '2'"
      >
        <v-img
          alt="Company Logo"
          class="shrink ml-2 d-block mt-4"
          src="/img/brand/blue.png"
          transition="scale-transition"
          max-width="150"
        />
        <v-list dense nav shaped>
          <v-list-item-group
            v-model="curRoute"
            justify="center"
            active-class="white--text primary lighten-1"
            class="mt-5"
          >
            <template v-for="(item, i) in links">
              <v-list-item :key="i" :to="item.to" @click="drawer = false">
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-bottom-navigation
        app
        grow
        color="primary"
        style="border-radius: 20px 20px 0 0"
        class="px-3 overflow-hidden"
        v-if="curNavigation === '1'"
      >
        <v-btn v-for="(item, i) in links" :to="item.to" :key="i">
          <span>{{ item.text }}</span>
          <v-icon> {{ item.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-container>
  </v-container>
</template>

<script>
  import store from "@/store/";
  import {mdiBookOpenVariant, mdiDotsVertical, mdiHome, mdiInformation, mdiMap, mdiNewspaper} from "@mdi/js";

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
        { text: "Home", icon: mdiHome, to: "/" },
        {
          text: "Learn",
          icon: mdiBookOpenVariant,
          to: "/information"
        },
        { text: "About", icon: mdiInformation, to: "/about" },
        { text: "News", icon: mdiNewspaper, to: "/news" },
        { text: "Map", icon: mdiMap, to: "/map" }
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
      store.dispatch("setLanguagePreference", {lang: this.$i18n.locale});
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
    },
    curNavigation() {
      return store.getters.getNavigationType;
    }
  }
};
</script>

<style scoped>
.border-bottom {
  border-bottom: #009ce5 solid 2px !important;
}

.v-btn--active.border-bottom::before {
  opacity: 0 !important;
}

.nav-btn {
  border-bottom: white solid 2px;
  transition: border-bottom-color 0.8s;
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
