<template>
  <v-footer class="shadow-lg v-sheet v-sheet--tile theme--light primary">
    <v-container class="my-5">
      <v-layout row wrap>
        <v-flex xs3 md3>
          <img src="/img/footer/logo.png" style="width: 170px;" />
        </v-flex>
        <v-flex xs4 md3>
          <v-list-item-group color="primary">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Single-line item</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Single-line item</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Single-line item</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-flex>
        <v-flex xs4 md3>
          <v-list-item-group color="primary">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Single-line item</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Single-line item</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Single-line item</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-flex>
        <v-flex xs4 md3>
          <v-col class="text-center">
        <v-btn v-for="icon in icons" :key="icon" class="mx-2 white--text" icon>
          <v-icon size="24px">{{ icon }}</v-icon>
        </v-btn>
      </v-col>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row wrap>
        <v-col class="text-center white--text">
        Copyright &copy; <strong>A2SV</strong> {{ new Date().getFullYear() }}
      </v-col>
      </v-layout>
    </v-container>
  </v-footer>
</template>

<script>

/***
 * <v-row>
      <v-col class="col-lg-3">
        <img src="/img/footer/logo.png" style="width: 170px;" />
      </v-col>
      <v-col class="col-lg-3">
        <v-list>
          <v-list-item-content>
            <v-list-item-title text="anndf"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-content>
            <v-list-item-title text="anndf"></v-list-item-title>
          </v-list-item-content>
        </v-list>
      </v-col>
      <v-col class="col-lg-3">ll</v-col>
      <v-col class="col-lg-3">ll</v-col>
    </v-row>

    <v-row>
      <v-col class="col-lg-3 white--text">
        Copyright &copy; <strong>A2SV</strong> {{ new Date().getFullYear() }}
      </v-col>
      <v-col class="col-lg-6 text-center">
        <v-btn v-for="icon in icons" :key="icon" class="mx-2 white--text" icon>
          <v-icon size="24px">{{ icon }}</v-icon>
        </v-btn>
      </v-col>
      <v-col class="col-lg-3"> </v-col>
    </v-row>
 */
export default {
  data: () => ({
    icons: ["mdi-youtube", "mdi-telegram", "mdi-web"]
  })
};
</script>
