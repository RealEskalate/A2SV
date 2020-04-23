<template>
  <section class="actions">
    <v-tabs vertical continuous hide-slider>
      <v-tab class="tabtitle">
        <v-icon left>mdi-checkbox-blank-circle-outline</v-icon>
        <strong class="v-tab-title">Why wash hand?</strong>
      </v-tab>

      <v-tab class="tabtitle">
        <v-icon left>mdi-checkbox-blank-circle-outline</v-icon>
        <strong class="v-tab-title">Why cover your cough?</strong>
      </v-tab>

      <v-tab class="tabtitle">
        <hr />
        <v-icon left>mdi-checkbox-blank-circle-outline</v-icon>
        <strong class="v-tab-title">Why social distance?</strong>
      </v-tab>

      <v-tab-item class="tab-item-content">
        <v-card flat>
          <v-img
            width="25em"
            src="https://us.123rf.com/450wm/makc76/makc761709/makc76170900024/85396084-stock-vector-please-wash-your-hands-vector-illustration-icon-health-care.jpg?ver=6"
          >
          </v-img>
          <br>
          <span class="v-tab-item-span">
            Respiratory viruses spread when mucus or droplets containing the virus get into your body through your eyes, nose or throat. Most often, this happens through your hands.
          </span>
        </v-card>
      </v-tab-item>
      <v-tab-item class="tab-item-content">
        <v-card flat>
          <v-img
             width="25em"
            src="https://www.unicef.org/uganda/sites/unicef.org.uganda/files/styles/crop_thumbnail/public/UNI305949.jpg?itok=z4ddBQw0"
          >
          </v-img>
          <br>
          <span class="v-tab-item-span">
            The viruse spread when mucus or droplets containing the virus get out of effected people.
          </span>
        </v-card>
      </v-tab-item>
      <v-tab-item class="tab-item-content">
        <v-card flat>
          <v-img
            width="25em"
            height="25em"
            src="https://www.su.edu/wp-content/uploads/2020/03/Screen-Shot-2020-03-16-at-3.21.31-PM-1.png"
          >
          </v-img>
          <br>
          <span class="v-tab-item-span">
            When people cough there cough cannot reach 10ft.
          </span>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </section>
</template>
<style>
.v-tab-title {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 19px;
  font-weight: bold;
  color: #373f4e;

  text-transform: none;
}
.tabtitle {
  justify-content: flex-start;
  border-bottom: 1px solid #eae6e6;
  padding: 2.2em 6em 2.2em 1em;
}
.tab-item-content {
  margin-left: 4em;
}
.v-tab-item-span{
  color: #616161;
}
</style>
<script></script>
