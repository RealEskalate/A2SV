<template>
    <v-card raised elevation="6" shaped>
        <v-card-title>
            <h2 class="text-center font-weight-medium mx-auto">Top News</h2>
        </v-card-title>
        <v-list dense>
            <v-list-item-group v-model="item" color="primary">
                <v-list-item
                        v-for="(item, i) in items"
                        :key="i"
                >
                    <v-list-item-content>
                        <v-list-item-title class="text--accent-1 font-weight-medium" v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                    <span>
                        <v-list-item-icon class="font-weight-light">
                            <small class="grey--text text--lighten-1">{{ item.numberOfViews }}</small>
                            <v-icon class="ml-2 grey--text text--lighten-1" >mdi-eye</v-icon>
                        </v-list-item-icon>
                    </span>
                </v-list-item>
            </v-list-item-group>
        </v-list>

    </v-card>
</template>

<script>
    export default {
        name: "TopNews",
        data: () => ({
            items: [
                {text: 'Trump to suspend all immigration into US over coronavirus.', icon: 'mdi-eye', numberOfViews: 120},
                {text: 'Three more cases in Ethiopia', icon: 'mdi-account', numberOfViews: 112},
                {text: 'A2SV team is combating corona', icon: 'mdi-flag',numberOfViews: 100},
            ],
        }),
    }
</script>

<style scoped>

</style>