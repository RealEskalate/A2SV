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
      />
      <v-select
        style="width: 120px"
        class="d-inline-flex v-card--shaped ml-5"
        :items="risk"
        label="Risk"
        outlined
        dense
        disabled
      />
    </v-col>

    <v-divider class="mx-6" vertical />
    <v-col cols="12" sm="4">
      <v-text-field
        v-model="search"
        dense
        label="Search Person"
        @input="$emit('set-search', search)"
        :append-icon="mdiGoogleLens"
        single-line
        hide-details
      />
    </v-col>
  </v-row>
</template>

<script>
import DateRangePicker from "@/components/core/DateRangePicker.vue";
import { mdiGoogleLens } from "@mdi/js";

export default {
  name: "SymptomFilter",
  components: {
    DateRangePicker
  },
  props: ["date_range"],
  data() {
    return {
      mdiGoogleLens,
      current_status: null,
      search: "",
      risk: ["", "Low", "Medium", "High"],
      status: ["", "Symptom Submitted", "Symptom Updated"]
    };
  },
  methods: {
    onDateChange(dateRange) {
      this.$emit("date-change", dateRange);
    }
  }
};
</script>
