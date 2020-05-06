<template>
  <v-card class="shadow">
    <h1 class="display-1 text-center font-weight-thin mb-6">
      The States of Transition for Covid-19
    </h1>
    <img-svg class="col-md-12" />
  </v-card>
</template>

<script>
import ImageSvg from "./ImageSvg";

export default {
  components: {
    "img-svg": ImageSvg
  }
};
</script>

<style>
.shadow {
  box-shadow: 5px 15px 15px 5px #eae6e6;
}
</style>
