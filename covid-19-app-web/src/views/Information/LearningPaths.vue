<!--suppress ALL -->
<template>
  <v-container>
    <v-row>
      <h3
        class="display-1 font-weight-thin mb-10"
        v-text="$t('titles.learningPath')"
      />
    </v-row>
    <v-row>
      <v-col cols="12" md="9" class="pr-md-12">
        <p>
          {{ $t("learnEvenMoreDescription") }}
        </p>
      </v-col>
      <v-col cols="12" md="3" class="pl-md-12">
        <v-select
          outlined
          dense
          :items="age_groups"
          class="v-card--shaped"
          label="Learning Path for"
          v-model="selected_age"
          @input="fetchLearningPaths"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="overflow-auto">
        <v-fade-transition hide-on-leave>
          <v-skeleton-loader
            v-if="loaders.learningPaths"
            ref="skeleton"
            type="table"
            class="mx-mb-12"
          />
          <v-simple-table v-else fixed-header style="min-width: 800px">
            <template v-slot:default>
              <thead>
                <tr>
                  <th
                    class="text-left primary--text text--darken-1"
                    v-if="$vuetify.breakpoint.mdAndUp"
                  />
                  <th class="text-left primary--text text--darken-1" :key="i" v-for="(header, i) in headers">
                    {{ $t('learningPathHeaders.' + header) }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr :key="i" v-for="(path, i) in learningPaths[selected_age]">
                  <td
                    class="text-left py-2 primary--text text--darken-1"
                    v-if="$vuetify.breakpoint.mdAndUp"
                    width="3%"
                  >
                    {{ i + 1 }}
                  </td>
                  <td class="text-left py-2" width="14%">{{ path.name }}</td>
                  <td class="text-left py-2" width="31%">{{ path.what }}</td>
                  <td class="text-left py-2" width="31%">{{ path.why }}</td>
                  <td class="text-left py-2" width="9%">{{ path.time }}</td>
                  <td width="12%">
                    <v-btn
                      rounded
                      class="v-card--shaped"
                      style="width: 100%"
                      small
                      color="primary"
                      v-text="path.action || 'View'"
                      :href="path.how"
                      target="_blank"
                    />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from "@/store";

export default {
  data: () => {
    return {
      selected_age: "Adults",
      age_groups: ["Kids", "Teens", "Adults", "Seniors"],
      headers: ['taskName', 'what', 'why', 'duration', 'how']
    };
  },
  methods: {
    fetchLearningPaths() {
      if (!this.learningPaths || !this.learningPaths[this.selected_age]) {
        store.dispatch("setLearningPaths", { age_group: this.selected_age, lang: this.$i18n.locale });
      }
    }
  },
  created() {
    this.fetchLearningPaths();
  },
  computed: {
    learningPaths: () => store.getters.getLearningPaths,
    loaders: () => store.getters.getLearnLoaders
  }
};
</script>
