<template>
  <v-row>
    <v-col cols="12" sm="4">
      <DateRangePicker
        :date_range="date_range"
        v-on:onDateChange="onDateChange"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <v-select
        class="v-card--shaped"
        :items="status"
        v-model="current_status"
        @input="$emit('status-change', current_status)"
        label="Status"
        outlined
        dense
        hide-details
      />
    </v-col>
    <v-col cols="12" sm="4" style="border-left: #dedede solid 1px">
      <v-text-field
        class="v-card--shaped"
        v-model="search"
        outlined
        :prepend-inner-icon="mdiSearchWeb"
        dense
        label="Search Person"
        @input="$emit('set-search', search)"
        hide-details
      />
    </v-col>
  </v-row>
</template>

<script>
import DateRangePicker from "@/components/core/DateRangePicker.vue";
import { mdiSearchWeb } from "@mdi/js";

export default {
  name: "CaseFilter",
  components: {
    DateRangePicker
  },
  props: ["date_range"],
  data() {
    return {
      mdiSearchWeb,
      current_status: "",
      current_risk: "",
      search: "",
      status: [
        { text: "All", value: "" },
        "New",
        "Negative",
        "Positive",
        "Recovered"
      ]
    };
  },
  methods: {
    onDateChange(dateRange) {
      this.$emit("date-change", dateRange);
    }
  }
};
</script>
