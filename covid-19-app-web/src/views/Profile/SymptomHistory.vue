<template>
  <div>
    <h3
      class="display-1 font-weight-thin mt-12 mb-8"
      v-text="'Symptoms History'"
    />
    <v-sheet shaped outlined class="overflow-hidden">
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
        v-model="current"
        :events="events"
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

export default {
  props: ["relevanceColor"],
  data() {
    return {
      mdiChevronLeft,
      mdiChevronRight,
      current: new Date(),
      events: [
        {
          name: "Fatigue",
          start: "2020-06-07 09:00",
          end: "2020-06-08 10:00",
          color: this.relevanceColor("low")
        },
        {
          name: "Repeated Shaking",
          start: "2020-06-10",
          color: this.relevanceColor("medium")
        },
        {
          name: "High-grade Fever",
          start: "2020-06-08 12:30",
          end: "2020-06-09 15:30",
          color: this.relevanceColor("high")
        }
      ]
    };
  },
  computed: {
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
