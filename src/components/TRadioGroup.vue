<template>
  <v-col>
    <p>{{ $t(text) }}</p>
    <v-radio-group
      row
      hide-details
      style="margin:5px"
      :rules="rules"
      @change="$emit('change', $event)"
    >
      <slot name="items"></slot>
    </v-radio-group>
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
    prop: "selected",
    event: "change"
  },
  props: {
    text: {
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
