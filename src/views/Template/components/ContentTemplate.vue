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
    keyValue: {
      type: Object
    }
  },
  computed: {
    items() {
      let obj = {
        company: this.keyValue.company,
        product: this.keyValue.production,
        templateName: this.keyValue.name,
        templateType: this.keyValue.type,
        ProjecteName: this.keyValue.repository,
        entryPoint: this.keyValue.entryPoint,
        description: this.keyValue.description
      };

      return obj;
    }
  }
};
</script>
