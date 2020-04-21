<template>
    <v-container class="news">
        <v-row>
            <v-col cols="8">
                <featured-news/>
                <news-list/>
            </v-col>
            <v-col cols="4">
                <top-news/>
            </v-col>
        </v-row>
        <!--    TODO Replace code here-->
    </v-container>
</template>
<script>
    import TopNews from "./TopNews";
    import NewsList from "./NewsList";
    import FeaturedNews from "./FeaturedNews";

    export default {
        components: {
            TopNews,
            NewsList,
            FeaturedNews
        }
    }
</script>

<style>
    .news {
        font-family: "Roboto", sans-serif;
    }
</style>
