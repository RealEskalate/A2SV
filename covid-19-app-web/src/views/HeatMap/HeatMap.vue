<template>
  <section class="map pb-10">
    <v-container>
      <v-row>
        <v-col>
          <v-responsive
            :aspect-ratio="$vuetify.breakpoint.smAndDown ? 12 / 16 : 16 / 12"
          >
            <iframe
              src="https://public.domo.com/cards/dG1jy"
              width="100%"
              height="100%"
              marginheight="0"
              marginwidth="0"
              frameborder="0"
            ></iframe>
            <!--            <iframe-->
            <!--              src="https://public.domo.com/cards/bWxVg"-->
            <!--              width="100%"-->
            <!--              height="100%"-->
            <!--              marginheight="0"-->
            <!--              marginwidth="0"-->
            <!--              frameborder="0"-->
            <!--            />-->
          </v-responsive>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script>
export default {};
</script>
