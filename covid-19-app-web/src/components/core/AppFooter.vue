<template>
  <v-footer class="primary">
    <div class="col-lg-12 text-center">
      <v-row class="py-4 text-center">
        <v-col class="col-lg-2 mx-4">
          <v-list-item two-line>
            <v-icon>mdi-youtube</v-icon>
            <v-list-item-content>
              <v-list-item-title>Two-line item</v-list-item-title>
              <v-list-item-subtitle>Secondary text</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col class="col-lg-2 mx-4">
          <v-list-item two-line>
            <v-icon>mdi-youtube</v-icon>
            <v-list-item-content>
              <v-list-item-title>Two-line item</v-list-item-title>
              <v-list-item-subtitle>Secondary text</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>

      <v-divider></v-divider>
    </div>
    <v-row>
      <v-col class="col-lg-3 white--text">
        Copyright  <strong>A2SV</strong> {{ new Date().getFullYear() }}
      </v-col>
      <v-col class="col-lg-6 text-center">
        <v-btn v-for="icon in icons" :key="icon" class="mx-2 white--text" icon>
          <v-icon size="24px">{{ icon }}</v-icon>
        </v-btn>
      </v-col>
      <v-col class="col-lg-3">
        <span>asdf</span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: ["mdi-youtube", "mdi-telegram", "mdi-linkedin"]
  })
};
</script>
