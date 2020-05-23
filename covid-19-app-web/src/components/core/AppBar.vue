<template>
  <v-container>
    <v-app-bar app class="white" flat v-bind:class="{ raised: raise }">
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
          style="transition: width 0.3s"
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
        <span class="text-capitalize"> {{ link.text }}</span>
      </v-btn>
      <v-menu left bottom v-if="$vuetify.breakpoint.smAndDown">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>{{ mdiDotsVertical }}</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item-group v-model="navType" @change="onNavigationTypeChange">
            <v-list-item value="1">
              <v-list-item-title>Bottom Navigation</v-list-item-title>
            </v-list-item>
            <v-list-item value="2">
              <v-list-item-title>Navigation Drawer</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
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
        class="px-3"
        v-if="curNavigation === '1'"
        active-class="active-bottom v-card--raised"
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
    // alert(screen.height);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.locationY = window.scrollY;
    },
    onNavigationTypeChange() {
      store.dispatch("setNavState", { type: this.navType });
    }
  },
  computed: {
    raise() {
      return this.locationY > 50;
    },
    brandWidth() {
      return this.locationY > 50 ? 130 : 140;
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

.bg-transparent {
  opacity: 0.95;
}

.no-decoration {
  text-decoration: none !important;
}

.raised {
  box-shadow: 5px 0 15px 5px #ddd;
  z-index: 997;
}

.active-bottom .v-icon {
  transform: scale(1.3) !important;
  -webkit-transform: scale(1.3) !important;
  -moz-transform: scale(1.3) !important;
  -o-transform: scale(1.3) !important;
}
</style>
