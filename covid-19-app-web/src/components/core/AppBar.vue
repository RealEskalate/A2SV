<template>
  <v-container>
    <v-app-bar app class="white" flat v-bind:class="{ raised: raise }">
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown && navOption === '2'"
        @click.stop="drawer = !drawer"
      />
      <router-link class="d-flex align-center no-decoration" to="/">
        <v-img
          alt="Company Logo"
          class="shrink ml-3"
          contain
          src="/img/brand/blue.png"
          transition="scale-transition"
          width="130"
        />
      </router-link>

      <v-spacer />

      <v-btn
        :key="link.to"
        :to="link.to"
        text
        v-for="link in links"
        class="nav-item hidden-sm-and-down"
      >
        <span class="text-capitalize"> {{ link.text }}</span>
      </v-btn>
      <v-menu left bottom v-if="$vuetify.breakpoint.smAndDown">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
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
        :value="activeBtn"
        grow
        color="primary"
        class="px-3"
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

export default {
  data: () => {
    return {
      drawer: false,
      navType: store.getters.getNavigationType,
      locationY: 0,
      curRoute: 0,
      activeBtn: 0,
      links: [
        { text: "Home", icon: "mdi-home", to: "/" },
        {
          text: "Learn",
          icon: "mdi-book-open-page-variant",
          to: "/information"
        },
        { text: "About", icon: "mdi-information", to: "/about" },
        { text: "News", icon: "mdi-newspaper", to: "/news" },
        { text: "Map", icon: "mdi-map", to: "/map" }
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
</style>
