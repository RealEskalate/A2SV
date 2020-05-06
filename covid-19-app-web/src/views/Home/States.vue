<template>
  <section class="states shadow">
    <h1 class="display-1 text-center font-weight-thin mb-6">
      The States of Transition for Covid-19
    </h1>
    <v-container>
      <v-row>
        <img-svg />
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

<style scoped>
.shadow {
  box-shadow: 0 0 15px 0 #eae6e6;
}
</style>
