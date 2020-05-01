<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        @click.stop="drawer = !drawer"
      />
      <router-link class="d-flex align-center" to="/">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
        <div>
          <h3 class="white--text font-weight-light">Covid-19</h3>
          <h3 class="white--text font-weight-light">SymTrack</h3>
        </div>
      </router-link>

      <v-spacer />

      <v-btn
        :key="link.to"
        :to="link.to"
        text
        v-for="link in links"
        class="hidden-sm-and-down"
      >
        <span v-text="link.text" />
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
      links: [
        { text: "HOME", icon: "mdi-home", to: "/" },
        { text: "ABOUT", icon: "mdi-information", to: "/about" },
        { text: "NEWS", icon: "mdi-newspaper", to: "/news" },
        { text: "MAP", icon: "mdi-map", to: "/map" }
      ]
    };
  }
};
</script>
