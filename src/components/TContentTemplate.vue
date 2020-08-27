<template>
  <v-row>
    <div class="titleBlock">
      <p>{{ $t(title) }}</p>
    </div>
    <div>
      <p class="lineBreak">{{ value }}</p>
    </div>
  </v-row>
</template>
<script>
export default {
  props: {
    value: {
      type: String
    },
    title: {
      type: String
    }
  }
};
</script>
<style lang="scss" scoped>
p {
  margin: 0px 0px 8px 0px;
  font-size: 14px;
  padding: 5px 0px 0px 25px;
  color: #8e8e93;
  font-weight: 500;
}
.titleBlock {
  min-height: 10px;
  width: 120px;
}
.lineBreak {
  white-space: pre;
}
</style>
