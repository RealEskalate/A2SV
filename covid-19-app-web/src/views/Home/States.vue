<template>
  <section class="states my-12 pt-12">
    <h1 class="display-1 text-center font-weight-thin mt-10 mb-6">The States of Transition for Covid-19</h1>
    <v-container>
      <v-row>
        <img-svg class="col-md-8" />
      </v-row>
    </v-container>
  </section>
</template>

<script>
import ImageSvg from "./ImageSvg";

export default {
  components: {
    "img-svg": ImageSvg
  }
};
</script>
