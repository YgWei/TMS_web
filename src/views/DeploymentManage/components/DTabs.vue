<template>
  <v-tabs
    vertical
    slider-color="#EFEFEF"
    background-color="#EFEFEF"
    :value="tabIndex"
  >
    <v-tab
      v-for="(item, index) in titles"
      :key="index"
      @click="changeTab(item, index)"
      >{{ $t(item) }}</v-tab
    >
    <v-tabs-items>
      <deployment-content
        :infoData="infoData"
        :title="title"
      ></deployment-content>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import DeploymentContent from "./DeploymentContent";
import { mapGetters } from "vuex";
export default {
  components: {
    DeploymentContent
  },
  props: {
    infoData: Object,
    tabIndex: Number,
    title: String
  },
  data() {
    return {
      titles: ["basicInfo", "projectInformation"]
    };
  },
  computed: {
    ...mapGetters({
      reviewUser: "getReviewUser"
    })
  },
  watch: {
    infoData: {
      immediate: true,
      async handler() {
        if (Object.keys(this.infoData).length !== 0) {
          if (Object.keys(this.infoData.review).length !== 0) {
            if (this.infoData.review.reviewUser.uuid === this.reviewUser.uuid) {
              this.titles = [
                "basicInfo",
                "projectInformation",
                "qualityInspectionInfo"
              ];
            } else {
              this.titles = ["basicInfo", "projectInformation"];
            }
          } else {
            this.titles = ["basicInfo", "projectInformation"];
          }
        }
      }
    }
  },
  methods: {
    changeTab(item, index) {
      this.$emit("changeTab", { title: item, index: index });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-tabs ::v-deep.v-slide-group {
  display: block !important;
}
.v-tabs {
  height: 100%;
}
.v-tabs ::v-deep.v-tabs-items {
  overflow-y: scroll;
}
</style>
