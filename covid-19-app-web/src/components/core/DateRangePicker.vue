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
      />
    </template>
    <v-date-picker
            color="primary"
            :min="date_range.length === 1 ? date_range[0] : null"
            :max="maxDate"
            range
            no-title
            v-model="date_range"
            @input="
        () => {
          if (date_range.length === 2 && date_range[0] && date_range[1])
            this.$emit('onDateChange', date_range);
        }
      "
    />
  </v-menu>
</template>

<script>
  import moment from "moment";
  import {mdiCalendar} from "@mdi/js";

  export default {
    name: "DateRangePicker",
    props: ["date_range"],
    computed: {
      maxDate: () => moment(new Date()).format("YYYY-MM-DD"),
      dateRangeText() {
        return this.rangeToText(this.date_range[0], this.date_range[1]);
      },
    },
    data() {
      return {
        mdiCalendar
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
