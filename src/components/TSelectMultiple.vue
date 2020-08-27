<template>
  <v-col>
    <p>{{ $t(text) }}</p>
    <v-select
      outlined
      hide-details
      dense
      multiple
      :items="items"
      small-chips
      item-text="name"
      :value="selected"
      :disabled="disabled"
      return-object
      :rules="rules"
      :hide-selected="hideSelected"
      @change="$emit('change', $event)"
    ></v-select>
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
    disabled: Boolean,
    selected: {},
    items: {
      type: Array
    },
    text: {
      type: String
    },
    clear: {
      type: Boolean
    },
    hideSelected: {
      type: Boolean
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
