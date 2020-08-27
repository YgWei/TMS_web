<template>
  <div>
    <v-breadcrumbs :items="historys">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          exact
          :to="item.to"
          :disabled="item.to === $route.path"
          >{{ $t(item.text) }}</v-breadcrumbs-item
        >
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
export default {
  props: {
    historys: {
      type: Array
    }
  }
};
</script>
<style lang="scss" scoped>
.v-breadcrumbs {
  padding: 12px;
}
</style>
