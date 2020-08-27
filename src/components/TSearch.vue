<template>
  <div>
    <v-col cols="4">
      <v-select
        :items="companies"
        v-model="company"
        dense
        hide-details
        :label="labelOne"
        background-color="#E5E5EA"
        solo
        class="label"
      ></v-select>
    </v-col>
    <v-col cols="4">
      <v-select
        :items="types"
        v-model="type"
        solo
        dense
        hide-details
        :label="labelTwo"
        background-color="#E5E5EA"
        class="label"
      ></v-select>
    </v-col>
    <v-col cols="4">
      <v-btn
        height="40px"
        width="100%"
        color="#4A90E2"
        depressed
        hide-details
        dark
        >{{ $t("search") }}</v-btn
      >
    </v-col>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: null,
      company: null,
      companies: ["公司1", "公司2"],
      types: ["險種1", "險種2"]
    };
  },
  props: {
    labelOne: {
      type: String
    },
    labelTwo: {
      type: String
    }
  }
};
</script>
<style lang="scss" scoped>
div {
  display: flex;
}
.label ::v-deep .v-label {
  font-size: 14px;
}
</style>
