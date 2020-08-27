<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-input
        class="contentPadding"
        text="workCenterName"
        v-model="workcenter.name"
      ></t-input>
      <t-input
        class="contentPadding"
        text="location"
        v-model="workcenter.region"
      ></t-input>
    </v-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      valid: true
    };
  },
  model: {
    prop: "workcenter",
    event: "emit"
  },
  props: {
    workcenter: {
      type: Object
    }
  }
};
</script>
<style lang="scss" scoped>
.contentPadding {
  padding: 5px 90px 0px 15px;
}
</style>
