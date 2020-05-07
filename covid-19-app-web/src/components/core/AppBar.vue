<template>
  <div>
    <v-app-bar
      app
      class="white"
      flat
      v-bind:class="{ raised: raise }"
    >
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        @click.stop="drawer = !drawer"
      />
      <router-link class="d-flex align-center no-decoration" to="/">
        <v-img
          alt="Vuetify Logo"
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
    </v-app-bar>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="drawer"
      absolute
      temporary
    >
      <v-list dense nav>
        <v-list-item-group
          justify="center"
          active-class="primary--text"
          class="mt-5"
        >
          <template v-for="item in links">
            <v-list-item
              :key="item.text"
              :href="item.to"
              @click="drawer = false"
              :class="
                currentPage === item.to
                  ? 'primary--text v-list-item--active'
                  : ''
              "
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      drawer: false,
      locationY: 0,
      links: [
        { text: "Home", icon: "mdi-home", to: "/" },
        { text: "Learn", icon: "mdi-search", to: "/information" },
        { text: "About", icon: "mdi-information", to: "/about" },
        { text: "News", icon: "mdi-newspaper", to: "/news" },
        { text: "Map", icon: "mdi-map", to: "/map" }
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
      // Any code to be executed when the window is scrolled
      this.locationY = window.scrollY;
    }
  },
  computed: {
    raise() {
      return this.locationY > 50;
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
