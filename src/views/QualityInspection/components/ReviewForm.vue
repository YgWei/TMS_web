<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-radio-group :text="'isPass'" v-model="reviewResult.result">
        <template v-slot:items>
          <v-radio :label="$t('pass')" value="pass"></v-radio>
          <v-radio :label="$t('unpass')" value="unpass"></v-radio>
        </template>
      </t-radio-group>
      <t-textarea
        class="contentPadding"
        :text="'suggest'"
        v-model="reviewResult.message"
      ></t-textarea>
    </v-form>
  </div>
</template>
<script>
export default {
  model: {
    prop: "reviewResult",
    event: "emit"
  },
  props: {
    reviewResult: {
      type: Object
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
