<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-textarea
        class="contentPadding"
        :text="'note'"
        v-model="deploymentBody.note"
      ></t-textarea>
    </v-form>
  </div>
</template>
<script>
export default {
  model: {
    prop: "deploymentBody",
    event: "emit"
  },
  props: {
    deploymentBody: {
      type: Object
    },
    tabIndex: {
      type: Number
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      valid: true
    };
  }
};
</script>
<style lang="scss" scoped>
.contentPadding {
  padding: 5px 90px 0px 15px;
}
</style>
