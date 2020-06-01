<template>
  <div>
    <v-parallax
      class="shadow-in v-card--shaped"
      style="margin-top: -100px; margin-left: -12px; margin-right: -12px"
      height="275"
      src="https://images.pexels.com/photos/326311/pexels-photo-326311.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    />
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-list-item>
            <v-avatar
              class="shadow-sm ma-5 v-card--shaped"
              width="75"
              height="75"
            >
              <v-img
                cover
                src="https://images.pexels.com/photos/3894157/pexels-photo-3894157.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              />
            </v-avatar>
            <v-list-item-content>
              <h3 class="title mb-0" v-text="'@' + 'MarcusObrien'" />
              <p class="mb-4 mt-2">
                Age Group:
                <span class="grey--text font-italic" v-text="'12-14'" />
              </p>
              <v-list-item-subtitle v-text="'MALE'" />
            </v-list-item-content>
          </v-list-item>
          <div class="text-center">
            <v-btn depressed small color="primary" class="v-card--shaped ma-1">
              <v-icon class="mr-2" small v-text="mdiAccountEdit" />
              Edit Profile
            </v-btn>
            <br />
            <v-btn depressed small color="primary" class="v-card--shaped ma-1">
              <v-icon class="mr-2" small v-text="mdiKey" />
              Change Password
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="8">
          <v-divider v-show="$vuetify.breakpoint.mdAndUp" light vertical />
          this item
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mdiAccountEdit, mdiKey } from "@mdi/js";

export default {
  name: "Profile",
  data() {
    return {
      mdiAccountEdit,
      mdiKey
    };
  }
};
</script>
