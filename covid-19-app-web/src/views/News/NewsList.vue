<template>
    <v-container>
        <v-list three-line>
            <template v-for="(item, index) in items">
                <v-subheader
                        v-if="item.header"
                        :key="item.header"
                        v-text="item.header"
                ></v-subheader>

                <v-divider
                        v-else-if="item.divider"
                        :key="index"
                        :inset="item.inset"
                ></v-divider>

                <v-list-item
                        v-else
                        :key="item.title"
                >

                    <v-list-item-content>
                        <v-list-item-title v-html="item.title"></v-list-item-title>
                        <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-list>
        <template>
            <div class="text-center">
                <v-pagination
                        v-model="page"
                        :length="4"
                        prev-icon="mdi-menu-left"
                        next-icon="mdi-menu-right"
                ></v-pagination>
            </div>
        </template>
    </v-container>
</template>

<script>
    export default {
        data: () => ({
            page: 1,
            items: [
                { header: 'Latest News' },
                {
                    avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
                    title: 'The coronavirus pandemic is a threat to populist strongmen',
                    subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
                },
                { divider: true, inset: true },
                {
                    avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
                    title: 'France\'s COVID-19 failures are the result of decades of austerity',
                    subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.",
                },
                { divider: true, inset: true },
                {
                    avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
                    title: 'Oui oui',
                    subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?",
                },
            ],
        }),
    }
</script>
<style scoped>

</style>