<template>
  <v-container class="align-content-center mt-md-6 mt-sm-3">
    <v-card shaped outlined>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="3"
          v-for="item in highLevelTitles"
          :key="item.title"
        >
          <p class="display-1 font-weight-light text-center pt-3">
            {{ getHighLevelStats[item.value] }}
          </p>
          <v-subheader
            class="text-center p-0 justify-center"
            v-text="item.title.toUpperCase()"
          />
        </v-col>
      </v-row>
    </v-card>
    <delete-modal :open="deleteDialog" @onConfirmation="deleteUser" />
    <v-card
      outlined
      shaped
      class="mb-10 pa-4 overflow-hidden mt-8 shadow"
      min-height="500px"
    >
      <UsersFilter
        :date_range="filters.date_range"
        @date-change="onDateChange"
        @set-search="searchPerson"
        @status-change="onStatusChange"
      />
      <v-data-table
        :headers="headers"
        :options.sync="options"
        :items="getUsers"
        :server-items-length="getUsersCount"
        :loading="getPeopleLoaders.allPeople"
        :footer-props="{ 'items-per-page-options': [5, 10, 25, 50] }"
        item-class="table-row"
      >
        <template v-slot:[`item.created_at`]="{ item }">
          <p>
            {{ formatDate(item) }}
          </p>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon small color="primary">
            <v-icon class="mr-2" @click="showDetail(item._id)">
              {{ mdiAccountDetails }}
            </v-icon>
          </v-btn>
          <v-icon color="#ff6767" @click="deleteDialog = true">
            {{ mdiDeleteForever }}
          </v-icon>
        </template>
      </v-data-table>
      <DetailSidebar
        v-if="this.$vuetify.breakpoint.mdAndUp"
        class="shadow-lg"
        :userId="userId"
        :sidebar="sidebar"
        v-on:close-sidebar="sidebar = false"
      />
      <DetailSidebarSmall
        class="shadow-lg"
        :id="userId"
        :sidebar="sidebar"
        :sheet="bottomsheet"
        v-else
      />
    </v-card>
  </v-container>
</template>

<script>
import UsersFilter from "./UsersFilter";
import { mdiAccountDetails, mdiDeleteForever, mdiFilterVariant } from "@mdi/js";
import moment from "moment";

import { mapActions, mapGetters } from "vuex";

export default {
  name: "Users",
  components: {
    UsersFilter,
    DetailSidebar: () => import("./ProfileDetails"),
    DetailSidebarSmall: () => import("./ProfileDetailsSmall"),
    DeleteModal: () => import("@/components/core/DeleteModal.vue")
  },
  data() {
    return {
      mdiFilterVariant,
      mdiAccountDetails,
      mdiDeleteForever,
      sidebar: false,
      userId: null,
      bottomsheet: false,
      deleteDialog: false,
      highLevelTitles: [
        { title: "Total Users", value: "allUsers" },
        { title: "Admin", value: "ephiUsers" },
        { title: "Healthcare workers", value: "healthcareWorkers" },
        { title: "New users, last 7 days", value: "thisWeekNewUsers" }
      ],
      headers: [
        { text: "User", value: "username", sortable: false },
        { text: "Country", value: "current_country", sortable: false },
        { text: "Gender", value: "gender", sortable: false },
        {
          text: "Creation Date",
          align: "start",
          value: "created_at",
          sortable: false
        },
        { text: "Account type", value: "role", sortable: false },
        { text: "Actions", value: "actions", sortable: false }
      ],
      options: { page: 1, itemsPerPage: 10 },
      filters: {
        status: "",
        username: "",
        date_range: [this.defaultDate(), this.defaultDate("end")]
      },
      awaitingSearch: false
    };
  },
  watch: {
    options: {
      handler() {
        this.fetch();
      },
      deep: true
    },
    "filters.username": {
      handler() {
        if (!this.awaitingSearch) {
          setTimeout(() => {
            this.fetch();
            this.awaitingSearch = false;
          }, 1000);
        }
        this.awaitingSearch = true;
      }
    }
  },
  methods: {
    ...mapActions(["fetchAllUsers", "fetchUserStats"]),
    deleteUser() {
      this.deleteDialog = false;
    },
    fetch() {
      this.fetchAllUsers({
        page: this.options.page,
        size: this.options.itemsPerPage,
        status: this.filters.status,
        username: this.filters.username,
        start_date: this.filters.date_range[0],
        end_date: this.filters.date_range[1]
      });
      this.fetchUserStats();
    },
    searchPerson(name) {
      this.filters.username = name;
    },
    onStatusChange(current_status) {
      this.filters.status = current_status.toUpperCase().replace(" ", "_");
      this.fetch();
    },
    onDateChange(dateRange) {
      this.filters.date_range = dateRange;
      this.fetch();
    },
    defaultDate(mode = "start") {
      if (mode === "start")
        return moment(new Date())
          .subtract(2, "week")
          .format("YYYY-MM-DD");
      else return moment(new Date()).format("YYYY-MM-DD");
    },
    showDetail(id) {
      this.userId = id;
      if (this.$vuetify.breakpoint.mdAndUp) {
        this.sidebar = true;
      } else {
        this.bottomsheet = true;
      }
    },
    formatDate(item) {
      return moment(item.created_at).format("ddd, MMMM Do YYYY");
    }
  },
  computed: {
    ...mapGetters([
      "getUsers",
      "getUsersCount",
      "getPeopleLoaders",
      "getHighLevelStats"
    ])
  },
  mounted() {
    this.fetch();
  }
};
</script>

<style scoped>
.display-1 {
  font-size: 2em !important;
  color: #303030 !important;
}
.shadow {
  background: transparent !important;
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05),
    0 15px 40px rgba(166, 173, 201, 0.2) !important;
  border-radius: 15px !important;
}
.shadow-lg {
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12) !important;
  border-radius: 5px !important;
}
</style>
