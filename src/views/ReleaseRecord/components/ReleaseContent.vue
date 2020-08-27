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
      let obj = {};
      if (this.infoData.type === "deployment") {
        obj = {
          company: this.infoData.company.name,
          product: this.infoData.production.name,
          templateName: this.infoData.template.name,
          templateVersion: this.infoData.template.tag,
          state: this.infoData.state,
          note: this.infoData.note
        };
      } else {
        obj = {
          businessData: this.infoData.name,
          dataUuid: this.infoData.cloudStorageUuid,
          creationDay: this.infoData.createTime,
          founder: this.infoData.createUser,
          description: this.infoData.description
        };
      }

      return obj;
    }
  }
};
</script>
