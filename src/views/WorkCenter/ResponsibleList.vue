<template>
  <add-layout>
    <t-data-table
      :headers="headers"
      :items="workcenterOwnerList"
      v-model="page"
      :count="count"
      @handleClick="handleClick"
    >
      <template v-slot:top>
        <v-btn fab small color="white" class="btn" @click="addNew()">
          <v-icon color="#666666">mdi-plus</v-icon>
        </v-btn>
        <!-- <v-btn fab small color="white" class="btn">
          <v-icon color="#666666">mdi-magnify</v-icon>
        </v-btn>-->
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
        <v-btn
          fab
          small
          color="white"
          class="btn"
          @click="edit()"
          v-show="isShow"
        >
          <v-icon color="#666666">mdi-pencil-outline</v-icon>
        </v-btn>
      </template>
    </t-data-table>
    <t-dialog
      v-model="dialog"
      checkInfo="worcenterOwnerDelete"
      uncovery="deleteUncovery"
    >
      <template v-slot:btn>
        <v-btn @click="dialog = false" outlined color="cancel">{{
          $t("cancel")
        }}</v-btn>
        <v-btn @click="deleteItem()" id="dialogBtn">
          {{ $t("determine") }}
        </v-btn>
      </template>
    </t-dialog>
  </add-layout>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { workcenter } from "@/api";
export default {
  data() {
    return {
      dialog: false,
      isShow: false,
      page: 1,
      count: 0,
      headers: [
        {
          text: this.$t("name"),
          value: "name"
        },
        { text: this.$t("responsibleTask"), value: "templateName" },
        { text: this.$t("phone"), value: "phone" },
        { text: this.$t("email"), value: "email" }
      ],
      uuid: ""
    };
  },
  computed: {
    ...mapGetters({
      workcenterOwnerList: "getWorkcenterOwnerList",
      workcenterInfo: "getWorkcenterInfo",
      editOwner: "getEditOwner"
    })
  },
  watch: {
    page: {
      immediate: true,
      async handler(val) {
        this.count = await this.$store.dispatch("getWorkcenterOwnerList", {
          workCenterUuid: this.workcenterInfo.uuid,
          params: { start: (val - 1) * 10, limit: 10 }
        });
      }
    }
  },
  methods: {
    ...mapMutations(["setEditOwner"]),
    handleClick(e) {
      this.isShow = true;
      this.uuid = e.uuid;
      this.setEditOwner(e);
    },
    addNew() {
      this.$router.push({
        path: "/create",
        query: { from: "create-responsible", uuid: this.$route.query.uuid }
      });
    },
    edit() {
      this.$router.push({
        path: "/workcenter/responsible/edit"
      });
    },
    async deleteItem() {
      await workcenter
        .deleteOwner(this.workcenterInfo.uuid, this.uuid)
        .then(() => {
          const index = this.workcenterOwnerList.findIndex(
            element => element.uuid === this.uuid
          );
          this.workcenterOwnerList.splice(index, 1);
        });
      this.dialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.top-margin {
  text-align: left;
  margin-left: 10px;
}
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
