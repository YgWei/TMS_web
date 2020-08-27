<template>
  <v-col>
    <p>{{ $t(text) }}</p>
    <v-text-field
      outlined
      hide-details
      :disabled="disabled"
      dense
      @input="$emit('input', $event)"
      :placeholder="$t(placeholder)"
      :prefix="prefix"
      :value="inputed"
      :rules="otherRules || rules"
      :append-icon="icon"
      :error="error"
    ></v-text-field>
  </v-col>
</template>
<script>
export default {
  data() {
    return {
      rules: [value => !!value || "Required."]
    };
  },
  model: {
    prop: "inputed",
    event: "input"
  },
  props: {
    inputed: String,
    error: Boolean,
    disabled: Boolean,
    text: {
      type: String
    },
    placeholder: {
      type: String
    },
    otherRules: {
      type: Array
    },
    icon: {
      type: String
    },
    prefix: {
      type: String
    }
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
