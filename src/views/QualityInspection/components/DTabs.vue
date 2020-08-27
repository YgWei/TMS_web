<template>
  <v-tabs
    vertical
    slider-color="#EFEFEF"
    background-color="#EFEFEF"
    v-model="tabs"
  >
    <v-tab
      v-for="(item, index) in titles"
      :key="index"
      @click="changeTab(item)"
      >{{ $t(item) }}</v-tab
    >
    <v-tabs-items v-model="tabs">
      <quality-content :infoData="infoData" :title="title"></quality-content>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import QualityContent from "./QualityContent";
export default {
  components: {
    QualityContent
  },
  props: {
    infoData: Object
  },
  data() {
    return {
      title: "basicInfo",
      tabs: 0,
      titles: ["basicInfo", "QualityInspection"]
    };
  },
  watch: {
    infoData: {
      immediate: true,
      async handler() {
        this.tabs = 0;
        this.$emit("changeTab", "basicInfo");
        this.title = "basicInfo";
      }
    }
  },
  methods: {
    changeTab(item) {
      this.$emit("changeTab", item);
      this.title = item;
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
