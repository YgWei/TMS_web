<template>
  <div>
    <t-content-template
      v-for="(item, key) in items"
      :title="key"
      :value="item"
      :key="key"
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
          releaseDate: this.infoData.releaseDate
        };
      } else if (this.title === "saleDataContent") {
        Obj = {
          testingCreateTime: this.infoData.createTime,
          testTime: this.infoData.testingTime
        };
      }
      return Obj;
    }
  }
};
</script>
