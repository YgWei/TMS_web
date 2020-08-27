<template>
  <div>
    <v-btn fab small icon @click="$emit('confirm')">
      <v-icon>mdi-check</v-icon>
    </v-btn>
    <v-btn fab small icon @click="$emit('close')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.v-btn:focus::before {
  display: none;
}
.v-btn:hover::before {
  display: none;
}
</style>
