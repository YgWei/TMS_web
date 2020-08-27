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
        workCenterName: this.keyValue.name,
        location: this.keyValue.region
      };

      return obj;
    }
  }
};
</script>
