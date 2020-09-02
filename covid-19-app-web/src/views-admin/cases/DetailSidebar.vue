<template>
  <v-navigation-drawer
    width="350"
    height="100%"
    v-model="sidebar"
    right
    absolute
    class="shadow-sm"
  >
    <v-list-item class="my-2 shadow-sm p-sticky">
      <v-list-item-action>
        <v-btn
          class="v-card--shaped"
          large
          @click="$emit('close-sidebar')"
          icon
        >
          <v-icon v-text="mdiForwardburger" />
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
  </v-navigation-drawer>
</template>

<script>
import {
  mdiGenderMaleFemaleVariant,
  mdiForwardburger,
  mdiStateMachine,
  mdiWatch,
  mdiBabyCarriage,
  mdiDoctor,
  mdiIdCard
} from "@mdi/js";

export default {
  name: "DetailSidebar",
  props: ["detail", "sidebar"],
  data() {
    return {
      mdiForwardburger
    };
  },
  methods: {},
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

<style scoped>
.display-1 {
  font-size: 1.2em !important;
  color: #303030 !important;
}
.shadow {
  background: transparent !important;
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05),
    0 15px 40px rgba(166, 173, 201, 0.2) !important;
  border-radius: 15px !important;
}
</style>
