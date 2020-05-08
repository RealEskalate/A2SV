<template>
  <v-container>
    <v-app-bar app class="white" flat v-bind:class="{ raised: raise }">
      <router-link class="d-flex align-center no-decoration" to="/">
        <v-img
          alt="Vuetify Logo"
          class="shrink ml-md-3"
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
      <v-app-bar-nav-icon
        class="primary--text"
        v-if="$vuetify.breakpoint.smAndDown"
        @click.stop="drawer = !drawer"
      />
    </v-app-bar>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="drawer"
      temporary
      app
      overflow
      right
    >
      <v-list dense nav shaped>
        <v-list-item-group v-model="curRoute" justify="center" class="mt-5">
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
  </v-container>
</template>

<script>
// import router from "../../router";
export default {
  data: () => {
    return {
      drawer: false,
      locationY: 0,
      curRoute: 0,
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
