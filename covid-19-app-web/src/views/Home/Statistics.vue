<template>
  <section class="statistics">
    <h1 class="text-center font-weight-thin">
      Statistics Graph Goes here
    </h1>

    <display />
    <country-compare />
    <disease-compare />
  </section>
</template>

<script>
import Display from "./Charts/Display.vue";
import CountryCompare from "./Charts/CountryCompare.vue";
import DiseaseCompare from "./Charts/DiseaseCompare.vue";

export default {
  components: {
    Display,
    CountryCompare,
    DiseaseCompare
  }
};
</script>
