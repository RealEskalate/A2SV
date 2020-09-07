<template>
  <v-row>
    <v-col cols="12" sm="3">
      <DateRangePicker
        :date_range="date_range"
        v-on:onDateChange="onDateChange"
      />
    </v-col>
    <v-col cols="12" sm="3">
      <v-select
        class="v-card--shaped"
        :items="roles"
        v-model="role"
        @input="$emit('role-change', role)"
        label="Roles"
        outlined
        dense
        hide-details
      />
    </v-col>

    <v-col cols="12" sm="3">
      <v-text-field
        class="d-inline-flex v-card--shaped"
        v-model="region"
        label="Region"
        outlined
        dense
        @input="$emit('set-region', region)"
      />
    </v-col>
    <v-col cols="12" sm="3" style="border-left: #dedede solid 1px">
      <v-text-field
        class="v-card--shaped"
        v-model="search"
        outlined
        :prepend-inner-icon="mdiSearchWeb"
        dense
        label="Username"
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
  name: "SymptomFilter",
  components: {
    DateRangePicker
  },
  props: ["date_range"],
  data() {
    return {
      mdiSearchWeb,
      role: "",
      region: "",
      search: "",
      roles: [
        { text: "All users", value: "" },
        { text: "EPHI users", value: "ephi_user" },
        { text: "Health care workers", value: "healthCareWorkers" },
        { text: "Basic users", value: "basic" }
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
