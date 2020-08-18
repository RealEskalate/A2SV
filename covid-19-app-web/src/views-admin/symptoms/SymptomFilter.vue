<template>
  <v-row>
    <v-col cols="12" sm="2">
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field v-model="date" label="Date" readonly v-bind="attrs" v-on="on"></v-text-field>
        </template>
        <v-date-picker v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="12" sm="2">
      <v-select class="d-flex" :items="status" label="Status" outlined></v-select>
    </v-col>
    <v-col cols="12" sm="2">
      <v-select class="d-flex" :items="risk" label="Risk" outlined></v-select>
    </v-col>
    <v-divider class="mx-6" vertical></v-divider>
    <v-col cols="12" sm="5">
      <v-text-field v-model="search" label="Search" @change="$emit('set-search', this.search)" single-line hide-details></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "SymptomFilter",
  data() {
      return {
          search: ""
      };
  }
};
</script>