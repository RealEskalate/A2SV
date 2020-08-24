<template>
  <v-container class="white">
    <v-app-bar
      app
      flat
      class="white py-1"
      style="border-radius: 0 0 25px 0; height: auto"
      :class="{ shadow: raise }"
    >
      <v-btn
        fab
        text
        v-if="$vuetify.breakpoint.mdAndUp"
        @click.stop="drawer = !drawer"
      >
        <v-icon large v-text="mdiForwardburger" />
      </v-btn>
      <!--      <v-app-bar-nav-icon-->
      <!--        v-if="$vuetify.breakpoint.mdAndUp"-->
      <!--        @click.stop="drawer = !drawer"-->
      <!--      />-->
      <v-btn
        text
        data-v-step="0"
        class="d-flex align-center pa-3"
        @click="$router.push({ name: 'Home' })"
      >
        <v-img
          alt="TrackSym"
          class="shrink"
          contain
          src="/img/brand/blue.png"
          style="transition: width 0.2s ease"
          :width="brandWidth"
        />
      </v-btn>

      <v-spacer />
      <!--      <v-btn-->
      <!--        :key="link.to"-->
      <!--        :to="{ name: link.to }"-->
      <!--        text-->
      <!--        v-for="link in links"-->
      <!--        active-class="border-bottom"-->
      <!--        class="hidden-sm-and-down v-card&#45;&#45;shaped nav-btn"-->
      <!--        exact-->
      <!--      >-->
      <!--        <span class="text-capitalize"> {{ $t(link.text) }}</span>-->
      <!--      </v-btn>-->
      <!--      <v-divider class="mx-2" vertical light />-->
      <!--      <div class="justify-end pt-7" style="width: 50px" data-v-step="4">-->
      <!--        <v-select-->
      <!--          solo-->
      <!--          flat-->
      <!--          dense-->
      <!--          v-model="$i18n.locale"-->
      <!--          :items="languages"-->
      <!--          @change="changeLang"-->
      <!--        >-->
      <!--          <template v-slot:append>-->
      <!--            <small />-->
      <!--          </template>-->
      <!--          <template v-slot:append>-->
      <!--            <small />-->
      <!--          </template>-->
      <!--          <template v-slot:selection="{ item }">-->
      <!--            <small class="primary&#45;&#45;text" v-text="langText[item]" />-->
      <!--          </template>-->
      <!--          <template v-slot:item="{ item }">-->
      <!--            <small v-text="langText[item]" />-->
      <!--          </template>-->
      <!--        </v-select>-->
      <!--      </div>-->
      <v-divider class="mr-2" vertical light />
      <v-btn
        dark
        color="primary"
        v-if="!loggedInUser"
        class="v-card--shaped mx-1"
        depressed
        :to="{ name: 'Login' }"
        v-text="$t('auth.login')"
      />
      <v-menu offset-y v-else>
        <template v-slot:activator="{ on }">
          <v-btn fab text color="primary" v-on="on">
            <v-icon v-text="mdiAccountCog" />
          </v-btn>
        </template>
        <v-list class="py-0">
          <template v-for="(item, index) in more_links">
            <v-divider v-if="index !== 0" :key="index" />
            <v-list-item
              link
              :key="index"
              :to="{ name: 'Profile' }"
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
              <small v-text="$t('auth.logOut')" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      v-if="$vuetify.breakpoint.mdAndUp"
      v-model="drawer"
      fixed
      temporary
    >
      <v-img
        alt="TrackSym"
        class="shrink my-5 mx-auto"
        contain
        :width="135"
        src="/img/brand/blue.png"
      />

      <v-list shaped>
        <v-list-item-group color="primary">
          <template v-for="(link, i) in links">
            <v-list-item
              exact
              :key="i"
              :to="{ name: link.to }"
              v-if="
                (!loggedInUser && link.roles.includes('none')) ||
                  (loggedInUser &&
                    link.roles.includes(loggedInUser.role.toLowerCase()))
              "
            >
              <v-list-item-icon>
                <v-icon v-text="link.icon" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="$t(link.text)" />
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-divider />
          <v-list-item inactive>
            <v-list-item-icon>
              <v-icon v-text="mdiTranslate" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'Language'" />
            </v-list-item-content>
            <v-list-item-action>
              <div class="justify-end" style="width: 50px" data-v-step="4">
                <v-select
                  solo
                  flat
                  dense
                  hide-details
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
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-bottom-navigation
      v-if="$vuetify.breakpoint.smAndDown"
      app
      grow
      color="primary"
      style="border-radius: 20px 0 0 0"
      class="px-3 overflow-hidden"
    >
      <template v-for="(link, i) in links">
        <v-btn
          :to="{ name: link.to }"
          :key="i"
          exact
          v-if="
            (!loggedInUser && link.roles.includes('none')) ||
              (loggedInUser &&
                link.roles.includes(loggedInUser.role.toLowerCase()))
          "
        >
          <span>{{ $t(link.text) }}</span>
          <v-icon> {{ link.icon }}</v-icon>
        </v-btn>
      </template>
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
  mdiForwardburger,
  mdiHome,
  mdiInformation,
  mdiLogoutVariant,
  mdiNewspaper,
  mdiTranslate,
  mdiEmailSend,
  mdiViewDashboard,
  mdiVirus
} from "@mdi/js";
import { languages } from "../../plugins/i18n";

export default {
  data: () => {
    return {
      mdiTranslate,
      mdiAccountCog,
      mdiForwardburger,
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
        ao: "AO",
        tr: "TR"
      },
      links: [
        {
          text: "navbar.home",
          icon: mdiHome,
          to: "Home",
          roles: ["basic", "none"]
        },
        {
          text: "navbar.learn",
          icon: mdiBookOpenVariant,
          to: "Learn",
          roles: ["basic", "none"]
        },
        {
          text: "navbar.about",
          icon: mdiInformation,
          to: "About",
          roles: ["basic", "none"]
        },
        {
          text: "navbar.news",
          icon: mdiNewspaper,
          to: "News",
          roles: ["basic", "none"]
        },
        // admins
        {
          text: "navbar.dashboard",
          icon: mdiViewDashboard,
          to: "Dashboard",
          roles: ["ephi_user"]
        },
        {
          text: "map.symptoms",
          icon: mdiVirus,
          to: "Symptoms",
          roles: ["ephi_user"]
        },
        {
          text: "navbar.inviteAdmins",
          icon: mdiEmailSend,
          to: "InviteAdmin",
          roles: ["ephi_user"]
        }
        // { text: "navbar.map", icon: mdiMap, to: "Map" }
      ],
      more_links: [
        { text: "navbar.profile", icon: mdiAccountEdit, to: "Profile" }
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
      router.push({ name: "Home" });
    }
  },
  computed: {
    raise() {
      return this.locationY > 50;
    },
    brandWidth() {
      return this.locationY > 50 ? 150 : 160;
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
