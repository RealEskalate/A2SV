<template>
  <v-container>
    <h2 class="mx-auto text-center font-weight-thin">
      Let's Create Your Account
    </h2>
    <p class="text-center">Join the best COVID-19 software platform</p>
    <v-row
      class="align-center justify-center align-center align-content-center mx-auto form"
    >
      <v-col md="6">
        <v-text-field outlined label="Enter your email"></v-text-field>
      </v-col>
      <v-col md="6">
        <v-text-field outlined label="Confirm your email"></v-text-field>
      </v-col>
      <v-col md="6">
        <v-text-field outlined label="Enter your First Name"></v-text-field>
      </v-col>
      <v-col md="6">
        <v-text-field outlined label="Enter your Last Name"></v-text-field>
      </v-col>
      <v-col md="6">
        <v-text-field outlined label="Create password"></v-text-field>
      </v-col>
      <v-col md="6">
        <v-text-field outlined label="Confirm Password"></v-text-field>
      </v-col>
      <v-col md="6">
        <v-checkbox class="d-inline" id="c">
          <template v-slot:label>
            <div>
              I agree to
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <a
                    target="_blank"
                    href="https://tracksym.app/en/privacy-policy"
                    @click.stop
                    v-on="on"
                  >
                    Tracksym's terms, privacy policy
                  </a>
                </template>
                Opens in new window
              </v-tooltip>
              and E-sign consent.
            </div>
          </template>
        </v-checkbox>
      </v-col>
      <v-col>
        <v-btn color="primary" class="white--text">Continue</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "CreateAccount"
};
</script>

<style scoped>
p,
h2 {
  color: #455d7a !important;
}
p {
  font-size: 0.8em;
}
.form {
  max-width: 40rem;
}
</style>
