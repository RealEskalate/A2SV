<template>
  <div class="pb-5">
    <v-bottom-sheet v-model="sheet" :scrollable="true">
      <div class="white pb-5">
        <v-list-item class="my-2 shadow-sm p-sticky">
          <v-list-item-action>
            <v-btn class="v-card--shaped" large @click="sheet = !sheet" icon>
              <v-icon v-text="mdiClose" />
            </v-btn>
          </v-list-item-action>
          <v-list-item-content>
            <div v-text="detail.person" />
          </v-list-item-content>
        </v-list-item>

        <v-list>
          <v-subheader v-text="$t('map.details')" />
          <v-list-item
            :key="index"
            v-for="(feature, index) in detailSingleFeatures"
          >
            <v-list-item-avatar size="20">
              <v-icon v-text="feature.icon" />
            </v-list-item-avatar>

            <v-list-item-content>
              <span>
                {{ $t(feature.name) }}:
                <span class="grey--text" v-text="detail[feature.key]" />
              </span>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-bottom-sheet>
  </div>
</template>

<script>
import {
  mdiGenderMaleFemaleVariant,
  mdiStateMachine,
  mdiWatch,
  mdiBabyCarriage,
  mdiDoctor,
  mdiIdCard,
  mdiClose
} from "@mdi/js";

export default {
  props: ["sheet", "detail", "sidebar"],
  data() {
    return {
      mdiClose
    };
  },
  computed: {
    detailSingleFeatures() {
      return [
        { name: "Gender", key: "gender", icon: mdiGenderMaleFemaleVariant },
        { name: "Age Group", key: "ageGroup", icon: mdiBabyCarriage },
        { name: "Case ID", key: "caseId", icon: mdiIdCard },
        { name: "Status", key: "status", icon: mdiStateMachine },
        {
          name: "Healthcare Official",
          key: "healthcareOfficial",
          icon: mdiDoctor
        },
        {
          name: "Case Creation Date",
          key: "caseSubmissionDate",
          icon: mdiWatch
        },
        { name: "Last Case Update", key: "caseUpdateDate", icon: mdiWatch }
      ];
    }
  }
};
</script>
