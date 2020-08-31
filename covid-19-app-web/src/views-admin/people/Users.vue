<template>
  <v-container class="align-content-center">
    <delete-modal :open="deleteDialog" @onConfirmation="deleteUser" />
    <v-expansion-panels popout focusable>
      <v-expansion-panel class="shadow">
        <v-expansion-panel-header>
          <v-row>
            <v-icon md class="ma-1 mr-3">{{ mdiFilterVariant }}</v-icon>
            <h3 class="align-center font-weight-thin d-inline-flex  left">
              Filter
            </h3>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="mt-5">
          <UsersFilter
            :date_range="date_range"
            v-on:date-change="onDateChange"
            v-on:set-search="searchPerson"
            v-on:status-change="onStatusChange"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <HighLevelStatistics class="my-8" />
    <DetailSidebar
      v-if="this.$vuetify.breakpoint.mdAndUp"
      class="shadow-lg"
      :id="userId"
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
    <v-data-table
      :headers="headers"
      :options.sync="options"
      :items="getUsers"
      :server-items-length="getUsersCount"
      :loading="getSymptomStatLoaders.peopleList"
      :footer-props="{ 'items-per-page-options': [5, 10, 25, 50] }"
      class="elevation-1 shadow"
      item-class="table-row"
    >
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
  </v-container>
</template>

<script>
import HighLevelStatistics from "./HighLevelStatistics";
import UsersFilter from "./UsersFilter";
import { mdiFilterVariant, mdiAccountDetails, mdiDeleteForever } from "@mdi/js";
import moment from "moment";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "Symptoms",
  components: {
    HighLevelStatistics,
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
      headers: [
        { text: "User", value: "username", sortable: false },
        { text: "Country", value: "current_country", sortable: false },
        {
          text: "Creation Date",
          align: "start",
          value: "date",
          sortable: false
        },
        { text: "Account type", value: "role", sortable: false },
        // { text: "Covid Case Status", value: "symptoms", sortable: false },
        { text: "Actions", value: "actions", sortable: false }
      ],
      options: { page: 1, itemsPerPage: 10 },
      filters: { status: "", username: "" },
      date_range: [this.defaultDate(), this.defaultDate("end")],
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
    ...mapActions(["fetchAllUsers"]),
    deleteUser() {
      this.deleteDialog = false;
    },
    fetch() {
      this.fetchAllUsers({
        page: this.options.page,
        size: this.options.itemsPerPage,
        status: this.filters.status,
        username: this.filters.username,
        start_date: this.date_range[0],
        end_date: this.date_range[1]
      });
    },
    searchPerson(name) {
      this.filters.username = name;
    },
    onStatusChange(current_status) {
      this.filters.status = current_status.toUpperCase().replace(" ", "_");
      this.fetch();
    },
    onDateChange(dateRange) {
      this.date_range = dateRange;
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
      console.log(id);
      if (this.$vuetify.breakpoint.mdAndUp) {
        this.sidebar = true;
      } else {
        this.bottomsheet = true;
      }
    }
  },
  computed: {
    ...mapGetters(["getUsers", "getUsersCount", "getSymptomStatLoaders"])
  },
  mounted() {
    this.fetch();
  }
};
</script>

<style scoped>
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
