<template>
  <v-row>
    <v-col cols="12" sm="4">
      <DateRangePicker
        :date_range="date_range"
        v-on:onDateChange="onDateChange"
      />
    </v-col>
    <v-col cols="12" sm="3">
      <v-select
        style="width: 120px"
        class="d-inline-flex v-card--shaped"
        :items="status"
        v-model="current_status"
        @input="$emit('status-change', current_status)"
        label="Status"
        outlined
        dense
      ></v-select>
    </v-col>

    <v-divider class="mx-6" vertical></v-divider>
    <v-col cols="12" sm="4">
      <v-text-field
        v-model="search"
        dense
        label="Search Person"
        @input="$emit('set-search', search)"
        single-line
        hide-details
        disabled
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import DateRangePicker from "@/components/core/DateRangePicker.vue";

export default {
  name: "CaseFilter",
  components: {
    DateRangePicker
  },
  props: ["date_range"],
  data() {
    return {
      current_status: null,
      search: "",
      status: ["", "New", "Negative", "Positive", "Recovered"]
    };
  },
  methods: {
    onDateChange(dateRange) {
      this.$emit("date-change", dateRange);
    }
  }
};
</script>
