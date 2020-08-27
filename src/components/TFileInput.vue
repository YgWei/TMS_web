<template>
  <v-col>
    <p>{{ $t(text) }}</p>
    <v-file-input
      outlined
      dense
      hide-details
      prepend-icon
      :placeholder="$t(placeholder)"
      @change="$emit('change', $event)"
      accept=".xml, .json"
      :rules="rules"
    ></v-file-input>
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
    prop: "file",
    event: "change"
  },
  props: {
    file: {},
    text: {
      type: String
    },
    placeholder: {
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
