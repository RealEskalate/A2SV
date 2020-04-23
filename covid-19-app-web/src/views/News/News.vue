<template>
  <v-container class="news">
    <section class="col-lg-6">
      <v-row align="center">
        <v-col cols="6">
          <v-select
            :items="items"
            :menu-props="{ top: false, offsetY: true }"
            label="Scope"
          ></v-select>
        </v-col>
      </v-row>
    </section>
    <v-row no-gutters>
      <v-col :cols="8">
        <v-card max-width="500" class="">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Our Changing Planet</v-list-item-title
              >
              <v-list-item-subtitle>by Kurt Wagner</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/mountain.jpg"
            height="194"
          ></v-img>

          <v-card-text>
            Visit ten places on our planet that are undergoing the biggest
            changes today.
          </v-card-text>

          <v-card-actions>
            <v-btn text color="deep-purple accent-4">
              Read
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        <br>
         <v-card max-width="500" class="">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >Our Changing Planet</v-list-item-title
              >
              <v-list-item-subtitle>by Kurt Wagner</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/mountain.jpg"
            height="194"
          ></v-img>

          <v-card-text>
            Visit ten places on our planet that are undergoing the biggest
            changes today.
          </v-card-text>

          <v-card-actions>
            <v-btn text color="deep-purple accent-4">
              Read
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col :cols="4">
        <v-card>


        <v-tabs centered grow>
          <v-tab>Recent</v-tab>
          <v-tab>Most view</v-tab>
          <v-tab-item>
            <v-card flat tile>
              <v-card-text>asdfsdafa</v-card-text>
            </v-card>
          </v-tab-item>
             <v-tab-item>
            <v-card flat tile>
              <v-card-text>olllll</v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    items: ["Global", "Local"]
  })
};
</script>
