<template>
  <v-container>
    <v-row>
      <h3
        class="display-1 font-weight-thin mb-10"
        v-text="'States of Transition'"
      />
    </v-row>
    <v-card shaped style="overflow: hidden">
      <v-row>
        <v-col cols="12" md="7" class="grey lighten-3">
          <img-svg class="col-md-12" />
        </v-col>
        <v-col cols="12" md="5" class="px-12 py-6">
          <h3 class="mb-5" v-text="'Description of the states here maybe'" />
          <p>
            Description of the states here maybe
          </p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import ImageSvg from "./ImageSvg";

export default {
  components: {
    "img-svg": ImageSvg
  }
};
</script>
