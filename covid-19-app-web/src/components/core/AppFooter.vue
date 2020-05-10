<template>
  <v-footer
          class="shadow-lg v-sheet v-sheet--tile theme--light"
          style="background: url('https://lh5.googleusercontent.com/proxy/nAm2UTt8kjupZFGWD4iPSIYLhJ7ZyhjHTSkzi-4kEzNBhI0NNx1RvJYSh89lgahLNWnp2Wii51RyzYTuxvHibai7tlpBI68_RLauPSwuSyl_abO2bNSfSkQeopmtBKiaMNlifi9aTkiC');"
  >
    <v-container class="my-2">
      <v-layout row wrap>
        <v-flex xs12 md3 class="mx-2 sm12">
          <p class="font-weight-bold ml-3">Get our App</p>
          <v-divider class="mx-1"></v-divider>
          <v-row>
            <v-col cols="6">
              <router-link to="/" target="blank">
                <v-img class="v-card--raised" src="/img/footer/app-store.svg" max-width="10.5em"></v-img>
              </router-link>
            </v-col>
            <v-col cols="6">
              <router-link to="/" target="blank">
                <v-img class="v-card--raised" src="/img/footer/google-play.svg" max-width="10.5em"></v-img>
              </router-link>
            </v-col>
          </v-row>
        </v-flex>
        <v-flex xs12 md6 class="mx-4">
          <p class="font-weight-bold text-center">About</p>
          <v-divider class="mx-4"></v-divider>
          <v-col>
            <span class="text-justify">
              Our App is a non-commercial app that uses crowd-sourcing to
              collect and visualize the density of the relevant Covid-19
              symptoms.
              <br/>
              In addition it provide Play-ground for the Data and News related
              to Covid-19 by country.
            </span>
          </v-col>
        </v-flex>

        <v-flex xs12 md2 class="mx-2">
          <p class="font-weight-bold text-center">More info</p>
          <v-divider class="mx-4"></v-divider>
          <v-col class="text-center">
            <v-btn
                    v-for="icon in icons"
                    :key="icon"
                    class="mx-2 black--text"
                    icon
                    v-bind:href="icon[1]"
                    target="blank"
            >
              <v-icon size="24px">{{ icon[0] }}</v-icon>
            </v-btn>
          </v-col>
          <router-link class="text-center d-block mx-auto" to="about#input-204">Contact us</router-link>
        </v-flex>
      </v-layout>
      <div class="text-center black--text mb-12 mb-md-0">
        Copyright &copy; <strong>A2SV</strong>
        {{ new Date().getFullYear() }}
      </div>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      icons: [
        ["mdi-youtube", "/youtube"],
        ["mdi-telegram", "/telegram"],
        ["mdi-web", "https://a2sv.org"]
      ]
      //https://www.ctech.co.ke/wp-content/uploads/2019/09/Home-Page_Layer-Slider-BG-1024x426.png
      //https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png
      //https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png
      //https://www.designbolts.com/wp-content/uploads/2012/12/Triangle-White-Seamless-Patterns.jpg
    })
  };
</script>

<style scoped>
  .list {
    background: none;
  }
</style>
