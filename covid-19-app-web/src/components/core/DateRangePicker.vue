<template>
  <v-menu
    :close-on-content-click="false"
    transition="scale-transition"
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        class="v-card--shaped"
        outlined
        dense
        v-model="dateRangeText"
        :label="$t('dateRange')"
        :prepend-inner-icon="mdiCalendar"
        readonly
        v-on="on"
        hide-details
      />
    </template>
    <v-date-picker
      color="primary"
      :min="newDateRange.length === 1 ? newDateRange[0] : null"
      :max="maxDate"
      range
      no-title
      v-model="newDateRange"
      @input="
        () => {
          if (newDateRange.length === 2 && newDateRange[0] && newDateRange[1])
            this.$emit('onDateChange', newDateRange);
        }
      "
    />
  </v-menu>
</template>

<script>
import moment from "moment";
import { mdiCalendar } from "@mdi/js";

export default {
  name: "DateRangePicker",
  props: ["date_range"],
  computed: {
    maxDate: () => moment(new Date()).format("YYYY-MM-DD"),
    dateRangeText() {
      return this.rangeToText(this.newDateRange[0], this.newDateRange[1]);
    }
  },
  data() {
    return {
      mdiCalendar,
      newDateRange: this.date_range //not to modify "date_range" prop
    };
  },
  methods: {
    rangeToText(start, end) {
      let arrow = "\u2192";
      return `  ${moment(start || "").format(
        "MMM DD, YYYY"
      )}    ${arrow}    ${moment(end || "").format("MMM DD, YYYY")}  `;
    }
  }
};
</script>
<style scoped></style>
