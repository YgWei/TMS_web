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
      <test-content :infoData="infoData" :title="title"> </test-content>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import TestContent from "./TestContent";
export default {
  components: {
    TestContent
  },
  props: {
    infoData: Object
  },
  data() {
    return {
      title: "basicInfo",
      tabs: null,
      titles: ["basicInfo", "saleDataContent"]
    };
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
</style>
