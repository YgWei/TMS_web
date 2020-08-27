<template>
  <content-layout :infoTitle="title">
    <t-data-table
      :headers="headers"
      :items="workcenterList"
      v-model="page"
      :count="count"
      @handleClick="handleClick"
    >
      <template v-slot:top>
        <v-row>
          <v-btn
            fab
            small
            color="white"
            @click="addNewWorkCenter()"
            class="btn"
          >
            <v-icon color="#666666">mdi-plus</v-icon>
          </v-btn>
        </v-row>
      </template>
    </t-data-table>
    <template v-slot:actions>
      <components
        :is="buttons"
        @edit="edit"
        @confirm="confirm"
        @close="close"
        @showList="showPage('/workcenter/templateList')"
        @showTask="showPage('/workcenter/taskList')"
        @showResponsible="showPage('/workcenter/responsible')"
        :keyValue="workcenterInfo"
      ></components>
    </template>
    <template v-slot:info>
      <components
        :is="components"
        :keyValue="workcenterInfo"
        v-model="workcenter"
        ref="form"
      ></components>
    </template>
    <v-overlay :value="overlay"></v-overlay>
    <!-- <t-dialog v-model="dialog" checkInfo="worcenterDelete" uncovery="deleteUncovery">
      <template v-slot:btn>
        <v-btn @click="dialog = false" outlined color="cancel">{{ $t("cancel") }}</v-btn>
        <v-btn @click="deleteValue()" id="dialogBtn">{{ $t("determine") }}</v-btn>
        
      </template>
    </t-dialog>-->
  </content-layout>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import { workcenter } from "@/api";
import MainBtns from "./components/MainBtns";
import EditForm from "./components/EditForm";
import EditBtns from "./components/EditBtns";
import BasicData from "./components/BasicData";

export default {
  components: {
    MainBtns,
    EditForm,
    EditBtns,
    BasicData
  },
  computed: {
    ...mapGetters({
      footerShow: "getFooterShow",
      workcenterList: "getWorkcenterList",
      workcenterInfo: "getWorkcenterInfo"
    })
  },
  data() {
    return {
      title: "basicData",
      overlay: false,
      workcenter: {},
      dialog: false,
      keyValue: {},
      count: 0,
      workcenterItems: [],
      components: "BasicData",
      buttons: "main-btns",
      page: 1,
      headers: [
        {
          text: this.$t("workCenterName"),
          value: "name"
        },
        { text: this.$t("location"), value: "region" }
      ]
    };
  },
  watch: {
    page: {
      immediate: true,
      async handler(val) {
        this.count = await this.$store.dispatch("getWorkcenterList", {
          start: (val - 1) * 10,
          limit: 10,
          type: "all"
        });
      }
    }
  },
  methods: {
    ...mapMutations(["setWorkCenterInfo"]),
    ...mapActions(["setFooterShow", "setEditShow"]),
    addNewWorkCenter() {
      this.$router.push({
        path: "/create",
        query: { from: "create-work-center" }
      });
      if (this.footerShow) {
        this.setFooterShow();
        this.setEditShow();
      }
    },
    async handleClick(e) {
      await this.$store.dispatch("getWorkcenterInfo", e.uuid);
      this.workcenter = {
        name: e.name,
        region: e.region
      };
    },
    // todelete() {
    //   this.dialog = true;
    // },
    edit() {
      this.components = "edit-form";
      this.buttons = "edit-btns";
      this.title = this.$t("edit");
      this.overlay = true;
      this.setEditShow();
    },
    async confirm() {
      const Edit = this.$refs.form;
      if (Edit.$refs.form.validate()) {
        await workcenter
          .editWorkcenter(this.workcenterInfo.uuid, this.workcenter)
          .then(res => {
            this.setWorkCenterInfo(res.data.data);
            this.components = "BasicData";
            this.buttons = "main-btns";
            this.title = this.$t("basicInfo");
            const index = this.workcenterList.findIndex(
              element => element.uuid === this.workcenterInfo.uuid
            );
            this.$set(this.workcenterList, index, this.workcenterInfo);
            this.setEditShow();
          });
      }
      this.overlay = false;
    },
    close() {
      this.components = "BasicData";
      this.buttons = "main-btns";
      this.title = this.$t("basicInfo");
      this.overlay = false;
      this.workcenter = {
        name: this.workcenterInfo.name,
        region: this.workcenterInfo.region
      };
      this.setEditShow();
    },

    showPage(e) {
      this.$router.push(e);
      if (this.footerShow) {
        this.setFooterShow();
        this.setEditShow();
      }
    }
    // deleteValue() {
    //   workcenter
    //     .deleteWorkcenter(this.workcenterInfo.uuid)
    //     .then(() => {
    //       const index = this.workcenterList.findIndex(
    //         element => element.uuid === this.workcenterInfo.uuid
    //       );
    //       this.workcenterList.splice(index, 1);

    //       this.dialog = false;
    //       if (this.footerShow) {
    //         this.setFooterShow();
    //       }
    //     })
    //     .catch(err => {
    //       throw err;
    //     });
    // }
  }
};
</script>

<style lang="scss" scoped>
.btn {
  box-shadow: 0px 0px 4px #c7c7cc;
}

// #dialogBtn {
//   background-color: #2196f3;
//   color: white;
//   margin-left: 20px;
// }
</style>
