<template>
  <v-col>
    <p>{{ $t(text) }}</p>
    <v-textarea
      outlined
      :counter="500"
      :rules="rules"
      dense
      :value="inputed"
      :disabled="disabled"
      @input="$emit('input', $event)"
      maxlength="500"
    ></v-textarea>
  </v-col>
</template>
<script>
export default {
  model: {
    prop: "inputed"
  },
  props: {
    inputed: String,
    disabled: Boolean,
    text: {
      type: String
    }
  },
  data() {
    return {
      rules: [value => !!value || "請輸入內容"]
    };
  }
};
</script>
<style lang="scss" scoped>
@import "@/design";

p {
  @extend %p-comp-style;
}

.col {
  @extend %col-comp-style;
}
</style>
