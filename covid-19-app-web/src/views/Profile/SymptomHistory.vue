<template>
  <div>
    <h3
      class="display-1 font-weight-thin mt-12 mb-8"
      v-text="'Symptoms History'"
    />
    <v-sheet shaped outlined class="overflow-hidden">
      <v-progress-linear
        v-if="loaders.symptomHistory"
        style="margin-bottom: -2px"
        height="2"
        indeterminate
        color="primary"
      />
      <v-sheet
        tile
        height="54"
        color="grey lighten-5"
        class="d-flex align-center"
      >
        <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
          <v-icon v-text="mdiChevronLeft" />
        </v-btn>
        <v-spacer />
        <span class="primary--text" v-text="currentMonth" />
        <v-spacer />
        <v-btn icon class="ma-2" @click="$refs.calendar.next()">
          <v-icon v-text="mdiChevronRight" />
        </v-btn>
      </v-sheet>
      <v-calendar
        ref="calendar"
        :event-timed="
          () => {
            return true;
          }
        "
        v-model="current"
        :events="symptomHistory"
        :event-color="
          event => {
            return `${event.color} darken-2`;
          }
        "
        color="primary"
      />
    </v-sheet>
  </div>
</template>

<script>
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import moment from "moment";
import store from "@/store";

export default {
  props: ["relevanceColor"],
  data() {
    return {
      mdiChevronLeft,
      mdiChevronRight,
      current: new Date()
    };
  },
  created() {
    store.dispatch("setSymptomHistory", {
      userId: this.loggedInUser._id,
      lang: this.$i18n.locale
    });
  },
  computed: {
    loaders: () => store.getters.getSymTrackLoaders,
    symptomHistory() {
      let events = store.getters.getSymptomHistory;
      let result = [];
      let self = this;
      events.forEach(function(event) {
        result.push({
          name: event.name,
          start: moment(event.start).format("YYYY-MM-DD hh:mm"),
          end: moment(event.end).format("YYYY-MM-DD hh:mm"),
          color: self.relevanceColor(event.color)
        });
      });
      return result;
    },
    currentMonth() {
      return moment(this.current).format("MMMM YYYY");
    }
  }
};
</script>

<style>
.v-event {
  text-align: center;
  opacity: 0.75;
}
</style>
