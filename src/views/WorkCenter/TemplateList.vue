<template>
  <add-layout>
    <t-data-table
      :headers="headers"
      :items="templateList"
      v-model="page"
      :count="count"
      @handleClick="handleClick"
    >
      <template v-slot:top>
        <v-btn fab small color="white" class="btn" @click="createTemplateList">
          <v-icon color="#666666">mdi-plus</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          color="white"
          class="btn"
          v-show="isShow"
          @click="dialog = true"
        >
          <v-icon color="#666666">mdi-delete</v-icon>
        </v-btn>
        <!-- <v-btn fab small color="white" class="btn" v-show="isShow">
          <v-icon color="#666666">mdi-pencil-outline</v-icon>
        </v-btn>-->
      </template>
    </t-data-table>
    <t-dialog
      v-model="dialog"
      checkInfo="worcenterTemplateDelete"
      uncovery="deleteUncovery"
    >
      <template v-slot:btn>
        <v-btn @click="dialog = false" outlined color="cancel">
          {{ $t("cancel") }}
        </v-btn>
        <v-btn id="dialogBtn" @click="deleteItem()">
          {{ $t("determine") }}
        </v-btn>
      </template>
    </t-dialog>
  </add-layout>
</template>

<script>
import { workcenter } from "@/api";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      templateUuid: "",
      dialog: false,
      isShow: false,
      page: 1,
      count: 0,
      headers: [
        {
          text: this.$t("company"),
          value: "company"
        },
        { text: this.$t("product"), value: "production" },
        { text: this.$t("templateName"), value: "template" }
      ]
    };
  },
  computed: {
    ...mapGetters({
      workcenterInfo: "getWorkcenterInfo",
      templateList: "getTemplateList"
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
            limit: 10 * val,
            type: "list"
          }
        };
        this.count = await this.$store.dispatch("getTemplateList", params);
      }
    }
  },
  methods: {
    createTemplateList() {
      this.$router.push({
        path: "/create",
        query: { from: "create-template-list" }
      });
    },
    handleClick(e) {
      this.isShow = true;
      this.templateUuid = e.templateUuid;
    },
    async deleteItem() {
      await workcenter
        .deleteTemplateList(this.workcenterInfo.uuid, this.templateUuid)
        .then(() => {
          const index = this.templateList.findIndex(
            element => element.templateUuid === this.templateUuid
          );
          this.templateList.splice(index, 1);
        });

      this.dialog = false;
    }
  }
};
</script>

<style scoped lang="scss">
.btn {
  margin: 10px;
  box-shadow: 0px 0px 4px #c7c7cc;
}
#container ::v-deep .v-breadcrumbs {
  padding: 0px;
}
#dialogBtn {
  background-color: #2196f3;
  color: white;
  margin-left: 20px;
}
</style>
