<template>
  <v-card
    outlined
    class="align-content-center align-center mx-auto container py-5"
  >
    <h2 class="text-center font-weight-thin">
      Additional verification required
    </h2>
    <p class="text-center">Enter your verification code sent to your email</p>
    <v-text-field label="Code" class="col-md-8 mx-auto"></v-text-field>
    <v-btn class="primary col-md-4 mx-auto d-flex ">Verify</v-btn>
  </v-card>
</template>

<script>
export default {
  name: "Verify"
};
</script>

<style scoped>
.container {
  max-width: 30rem;
}
.container {
  color: #455d7a;
}
</style>
