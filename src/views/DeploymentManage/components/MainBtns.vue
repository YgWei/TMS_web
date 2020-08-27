<template>
  <div v-show="deployment.uuid && footerShow">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          small
          icon
          v-on="on"
          v-show="deployment.state == 'init' && title == 'basicInfo'"
          @click="$emit('startDeploy')"
        >
          <v-icon>mdi-application</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("initiateDeploy") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          small
          icon
          v-on="on"
          @click="$emit('startInspection')"
          v-show="
            deployment.state == 'deploy_success' &&
              review === false &&
              title == 'basicInfo'
          "
        >
          <v-icon>mdi-clipboard-text-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("initiateQuality") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          small
          icon
          v-on="on"
          v-show="
            deployment.state != 'init' &&
              deployment.state != 'deploy' &&
              deployment.state != 'deploy_fail' &&
              deployment.state != 'deploy_pending' &&
              title == 'basicInfo'
          "
          @click="$emit('dataPreview')"
        >
          <v-icon>mdi-eye-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("preview") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          @click="$emit('confirmReview')"
          fab
          small
          icon
          v-on="on"
          v-show="
            deployment.uuid &&
              title == 'qualityInspectionInfo' &&
              review === true &&
              deployment.state === 'review'
          "
        >
          <v-icon>mdi-thumb-up</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("checkResult") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          small
          icon
          v-on="on"
          v-show="
            deployment.state != 'init' &&
              title == 'qualityInspectionInfo' &&
              review === true
          "
          @click="$emit('reviewPreview')"
        >
          <v-icon>mdi-eye-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("previewReview") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          @click="$emit('edit')"
          fab
          small
          icon
          v-on="on"
          v-show="deployment.uuid && title == 'basicInfo'"
        >
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("edit") }}</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          @click="$emit('editReview')"
          fab
          small
          icon
          v-on="on"
          v-show="
            deployment.uuid &&
              title == 'qualityInspectionInfo' &&
              review === true &&
              deployment.state === 'review'
          "
        >
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("addInspector") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          small
          icon
          v-on="on"
          v-show="title == 'basicInfoo'"
          @click="$emit('delete')"
        >
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("deleteDeployment") }}</span>
    </v-tooltip>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    infoData: {
      type: Object
    },
    title: {
      type: String
    }
  },
  computed: {
    deployment() {
      if (Object.keys(this.infoData).length === 0) {
        return false;
      }
      return this.infoData.deployment;
    },
    review() {
      if (Object.keys(this.infoData.review).length === 0) {
        return false;
      }
      return true;
    },

    ...mapGetters({ footerShow: "getFooterShow" })
  }
};
</script>
<style lang="scss" scoped>
.v-btn:focus::before {
  display: none;
}
.v-btn:hover::before {
  display: none;
}
</style>
