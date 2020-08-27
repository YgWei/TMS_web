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
    infoData: {
      type: Object
    }
  },
  computed: {
    items() {
      if (Object.keys(this.infoData).length === 0) return {};
      let obj = {
        templateName: this.infoData.template,
        noticeTime: this.infoData.createTime,
        updateExpiration: this.infoData.startTime,
        responsible: this.infoData.productOwner.name,
        responsibleNumber: this.infoData.productOwner.phone,
        responsibleEmail: this.infoData.productOwner.email,
        workCenter: this.infoData.workCenter,
        note: this.infoData.note
      };

      return obj;
    }
  }
};
</script>
