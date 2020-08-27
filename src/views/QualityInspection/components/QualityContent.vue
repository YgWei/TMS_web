<template>
  <div>
    <t-content-template
      v-for="(item, key, index) in items"
      :title="key"
      :value="item"
      :key="index"
    ></t-content-template>
  </div>
</template>
<script>
export default {
  props: {
    infoData: Object,
    title: String
  },
  computed: {
    items() {
      if (Object.keys(this.infoData).length === 0) return {};
      let Obj = {};
      if (this.title === "basicInfo") {
        Obj = {
          company: this.infoData.company,
          product: this.infoData.production,
          templateName: this.infoData.template,
          templateVersion: this.infoData.version,
          qualityDate: `${this.infoData.startTime} ~ ${this.infoData.endTime}`
        };
      } else if (this.title === "QualityInspection") {
        Obj = {
          isPass: this.$t(this.infoData.reviewState),
          suggest: this.infoData.reviewMessage
        };
      }
      return Obj;
    }
  }
};
</script>
