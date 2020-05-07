<template>
  <v-footer
    class="shadow-lg v-sheet v-sheet--tile theme--light"
    style="background: url('https://lh5.googleusercontent.com/proxy/nAm2UTt8kjupZFGWD4iPSIYLhJ7ZyhjHTSkzi-4kEzNBhI0NNx1RvJYSh89lgahLNWnp2Wii51RyzYTuxvHibai7tlpBI68_RLauPSwuSyl_abO2bNSfSkQeopmtBKiaMNlifi9aTkiC')"
  >
    <v-container class="my-2">
      <v-layout row wrap>
        <v-flex xs3 md3>
          <img
            src="/img/footer/logo.png"
            class="center"
            style="width: 170px;"
          />
          <p class="font-weight-bold ml-10">App Name</p>
        </v-flex>
        <v-flex xs4 md3 class="mx-2">
          <p class="font-weight-bold text-center">Get our App</p>
          <v-divider class="mx-4"></v-divider>
          <v-list class="list">
            <v-list-item-group color="primary">
              <v-list-item
                href="https://www.apple.com/ios/app-store/"
                target="blank"
              >
                <v-list-item-icon>
                  <v-icon size="40px">mdi-apple</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle> App Store</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-bold">
                    Apple</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item href="https://play.google.com/store" target="blank">
                <v-list-item-icon>
                  <v-icon size="40px">mdi-google-play</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>play Store</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-bold">
                    Google
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-flex>
        <v-flex xs4 md3 class="mx-4">
          <p class="font-weight-bold text-center">About</p>
          <v-divider class="mx-4"></v-divider>
          <v-col>
            <span class="">
              Our App is a non-commercial app that uses crowd-sourcing to
              collect and visualize the density of the relevant Covid-19
              symptoms.
              <br />
              In addition it provide Play-ground for the Data and News related
              to Covid-19 by country.
            </span>
          </v-col>
        </v-flex>

        <v-flex xs4 md2 class="mx-2">
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
          <v-col class="text-center black--text">
            Copyright &copy; <strong>A2SV</strong>
            {{ new Date().getFullYear() }}
          </v-col>
        </v-flex>
      </v-layout>
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
