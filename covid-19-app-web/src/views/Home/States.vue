<template>
    <section class="states">
        <!--    TODO Replace code here-->
        <v-container>
            <v-row>
              <img-svg class="col-md-6"/>
            </v-row>
        </v-container>
    </section>
</template>

<script>
    import ImageSvg from "./ImageSvg";

    export default {
        components: {
            'img-svg': ImageSvg
        }
    }
</script>
