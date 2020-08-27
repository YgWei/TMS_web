<template>
  <add-layout>
    <br />
    <t-data-table
      :headers="headers"
      :items="taskList"
      v-model="page"
      :count="count"
    ></t-data-table>
  </add-layout>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      page: 1,
      count: 0,
      headers: [
        {
          text: this.$t("template"),
          value: "templateName"
        },
        { text: this.$t("version"), value: "releaseVersion" },
        { text: this.$t("updateExpiration"), value: "startTime" },
        { text: this.$t("status"), value: "state" }
      ],
      updateItems: []
    };
  },
  computed: {
    ...mapGetters({
      workcenterInfo: "getWorkcenterInfo",
      taskList: "getTaskList"
    })
  },
  watch: {
    page: {
      immediate: true,
      async handler(val) {
        const params = {
          workCenterUuid: this.workcenterInfo.uuid,
          params: {
            start: (val - 1) * 10,
            limit: 10 * val
          }
        };
        this.count = await this.$store.dispatch("getTaskList", params);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.top-margin {
  justify-content: space-between;
  margin-left: 10px;
  margin-right: 10px;
}
.btn {
  margin: 10px;
  box-shadow: 0px 0px 4px #c7c7cc;
}
#container ::v-deep .v-breadcrumbs {
  padding: 0px;
}
</style>
