<template>
  <content-layout :infoTitle="title">
    <t-data-table
      :headers="headers"
      :items="deployments"
      @handleClick="handleClick"
      :count="count"
      v-model="page"
    >
      <template v-slot:top>
        <v-row>
          <v-btn
            fab
            small
            color="white"
            @click="showAddItemPage()"
            class="btn"
            v-auth="['gitlab']"
          >
            <v-icon color="#666666">mdi-plus</v-icon>
          </v-btn>
          <!-- <t-search :labelOne="labelOne" :labelTwo="labelTwo"></t-search> -->
        </v-row>
      </template>
    </t-data-table>
    <template v-slot:actions>
      <components
        :is="buttons"
        @delete="deleteDialog"
        @startDeploy="startDeploy"
        @edit="edit"
        @editReview="editInspectioner"
        @close="close"
        @confirm="confirm"
        @dataPreview="dataPreview"
        @reviewPreview="reviewPreview"
        @startInspection="startInspection"
        @confirmReview="reviewDialog"
        :title="title"
        :infoData="infoData"
      ></components>
    </template>
    <template v-slot:info>
      <components
        ref="form"
        :is="compList"
        @changeTab="changeTab"
        v-model="deploymentBody"
        :infoData="infoData"
        :tabIndex="tabIndex"
        :title="title"
      ></components>
    </template>
    <t-dialog
      v-model="dialog"
      :checkInfo="dialogTitle"
      :uncovery="dialogDescription"
      :persistance="false"
    >
      <template v-slot:btn>
        <v-btn @click="rejectDialog" outlined color="cancel">{{
          $t(dialogReject)
        }}</v-btn>
        <v-btn @click="confirmDialog" class="dialogBtn">{{
          $t(dialogConfirmation)
        }}</v-btn>
      </template>
    </t-dialog>
    <review
      :isDialog="isDialog"
      :infoData="infoData"
      @closeDialog="isDialog = false"
    ></review>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
        v-if="progressOverlay"
      ></v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="snackbar" top :color="snackbarColor" text>
      {{ snackbarName }}
      <v-btn @click="snackbar = false" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </content-layout>
</template>
<script>
import DTabs from "./components/DTabs";
import EditBtns from "./components/EditBtns";
import MainBtns from "./components/MainBtns";
import DInspectionForm from "./components/DInspectionForm";
import DEditForm from "./components/DEditForm";
import DEditInspection from "./components/DEditInspection";
import Review from "./components/Review";
import { deployment, review } from "@/api";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { snackbarMixin, changeTableStateMixin } from "@/mixins";
export default {
  components: {
    DTabs,
    EditBtns,
    DInspectionForm,
    DEditForm,
    MainBtns,
    DEditInspection,
    Review
  },
  mixins: [snackbarMixin, changeTableStateMixin],
  data() {
    return {
      uuid: "",
      overlay: false,
      progressOverlay: false,
      submitType: null,
      infoData: {},
      deploymentBody: {},
      snackbar: false,
      title: "basicInfo",
      buttons: "main-btns",
      compList: "d-tabs",
      page: 1,
      count: 0,
      headers: [
        {
          text: this.$t("templateName"),
          value: "template",
          sortable: false
        },
        { text: this.$t("company"), value: "company" },
        { text: this.$t("product"), value: "production" },
        { text: this.$t("templateVersion"), value: "tag" },

        { text: this.$t("creationDay"), value: "createTime" },
        { text: this.$t("status"), value: "state" }
      ],
      deployments: [],
      snackbarName: null,
      snackbarColor: "error",
      dialog: false,
      dialogTitle: null,
      dialogDescription: null,
      dialogAbout: null,
      dialogConfirmation: "determine",
      dialogReject: "cancel",
      polling: null,
      isDialog: false,
      tabIndex: 0
    };
  },
  computed: {
    ...mapGetters({
      footerShow: "getFooterShow"
    })
  },
  watch: {
    page: {
      immediate: true,
      async handler(val) {
        clearInterval(this.polling);

        await this.pollData(val);
        const vm = this;
        this.polling = setInterval(async function() {
          await vm.pollData(val);
        }, 10000);
      }
    }
  },
  methods: {
    ...mapActions(["setFooterShow", "setEditShow"]),
    async pollData(val) {
      const params = {
        start: (val - 1) * 10,
        limit: val * 10,
        type: "list"
      };

      try {
        const getdeployments = await deployment.getDeployments(params);
        this.count = getdeployments.data.data.count;
        this.deployments = getdeployments.data.data.data;
        if (this.infoData.deployment) {
          const index = this.deployments.findIndex(
            item => item.uuid === this.infoData.deployment.uuid
          );
          if (index !== -1) {
            if (
              this.infoData.deployment.state !== this.deployments[index].state
            ) {
              this.infoData.deployment.state = this.deployments[index].state;
            }
          }
        }
        this.deployments.map(element => {
          element.createTime = moment(element.createTime).format(
            "YYYY/MM/DD - kk:mm"
          );
          element.state = this.$t(element.state);
        });
      } catch {
        /* empty */
      }
    },
    async handleClick(e) {
      this.uuid = e.uuid;
      this.changeTab({ title: "basicInfo", index: 0 });
      const params = {
        type: "all"
      };
      try {
        const deployments = await deployment.getDeployment(e.uuid, params);
        this.infoData = deployments.data.data;
      } catch {
        /* empty */
      }
    },
    changeTab(val) {
      this.title = val.title;
      this.tabIndex = val.index;
    },
    showAddItemPage() {
      this.$router.push({ path: "/create", query: { from: "create-deploy" } });
      if (this.footerShow) {
        this.setFooterShow();
        this.setEditShow();
      }
    },
    async startDeploy() {
      try {
        this.overlay = true;
        this.progressOverlay = true;
        await deployment.startDeploying(this.uuid, {
          state: this.infoData.deployment.state
        });
        this.infoData.deployment.state = "deploy";
        this.changeState(this.deployments, this.uuid, "deploy");
        this.showSnackbar("deploySuccess", "success");
      } catch {
        this.showSnackbar("deployError", "error");
        /* empty */
      } finally {
        this.overlay = false;
        this.progressOverlay = false;
      }
    },
    edit() {
      this.title = "basicInfoEdit";
      this.buttons = "edit-btns";
      this.compList = "d-edit-form";
      this.overlay = true;
      this.submitType = "edit";
      this.deploymentBody = {
        note: this.infoData.deployment.note
      };
      this.setEditShow();
    },
    editInspectioner() {
      this.title = "editInspector";
      this.buttons = "edit-btns";
      this.compList = "d-edit-inspection";
      this.overlay = true;
      this.submitType = "editInspectioner";
      this.deploymentBody = {
        reviewGroup: this.infoData.review.reviewGroup
      };
      this.setEditShow();
    },
    startInspection() {
      this.title = "initiateQuality";
      this.buttons = "edit-btns";
      this.compList = "d-inspection-form";
      this.overlay = true;
      this.submitType = "inspection";
      this.deploymentBody = {};
      this.setEditShow();
    },
    close() {
      this.title = "basicInfo";
      this.buttons = "main-btns";
      this.compList = "d-tabs";
      if (this.uuid) {
        this.deploymentBody.note = this.infoData.deployment.note;
      }
      if (this.submitType == "editInspectioner") {
        this.changeTab({ title: "qualityInspectionInfo", index: 2 });
      } else {
        this.changeTab({ title: "basicInfo", index: 0 });
      }
      this.overlay = false;
      this.deploymentBody = {};
      this.setEditShow();
    },
    async confirm() {
      const deploymentCom = this.$refs.form;
      if (deploymentCom.$refs.form.validate()) {
        let result = null;
        let success = true;
        const body = {
          note: this.deploymentBody.note
        };
        if (this.submitType === "edit") {
          try {
            result = await deployment.editDeployment(this.uuid, body);
            this.showSnackbar("editSuccess", "success");
            this.infoData.deployment.note = result.data.data.note;
            success = true;
            this.deploymentBody = {};
          } catch {
            this.showSnackbar("editError", "error");
            success = false;
            /* empty */
          }
        } else if (this.submitType === "inspection") {
          const body = {
            reviewUser: this.deploymentBody.reviewUser.uuid,
            customer: this.deploymentBody.customer.uuid,
            reviewGroup: this.deploymentBody.reviewGroup.map(item => {
              return item.uuid;
            }),
            startTime: this.deploymentBody.startTime,
            endTime: this.deploymentBody.endTime
          };
          try {
            await deployment.reviewDeployment(this.uuid, body);
            result = await deployment.getDeployment(this.uuid, { type: "all" });
            this.infoData = result.data.data;
            this.changeState(
              this.deployments,
              this.uuid,
              this.infoData.deployment.state
            );
            this.showSnackbar("reviewSuccess", "success");
            success = true;
          } catch {
            this.showSnackbar("reviewError", "error");
            success = false;
            /* empty */
          }
        } else if (this.submitType == "editInspectioner") {
          const body = {
            userUuid: this.deploymentBody.reviewGroup.map(el => {
              return el.uuid;
            })
          };
          try {
            result = await review.addReviewer(
              this.infoData.deployment.reviewKey,
              body
            );
            this.infoData.review.reviewGroup = result.data.data.reviewGroup;
            this.showSnackbar("addReviewerSuccess", "success");
            success = true;
          } catch {
            this.showSnackbar("addReviewerFail", "error");
            success = false;
            /* empty */
          }
        }
        if (success === true) {
          this.buttons = "main-btns";
          this.compList = "d-tabs";
          this.overlay = false;
          if (this.submitType == "editInspectioner") {
            this.changeTab({ title: "qualityInspectionInfo", index: 2 });
          } else {
            this.changeTab({ title: "basicInfo", index: 0 });
          }
          this.setEditShow();
        }
      }
    },
    async dataPreview() {
      await deployment.getRenderResult(this.uuid).then(res => {
        if (res.data.data.success) {
          const dataPreviewUrl = `${process.env.VUE_APP_DATA_PROTOCOL}://${process.env.VUE_APP_DATA_HOST}:${process.env.VUE_APP_DATA_PORT}/api/tms_tmp/download/${res.data.data.fileID}?type=view`;
          window.open(dataPreviewUrl);
        } else {
          this.showSnackbar("renderFailed", "error");
        }
      });
    },
    deleteDialog() {
      this.dialogTitle = "deploymentDeleteTitle";
      this.dialogDescription = "deleteUncovery";
      this.dialogConfirmation = "determine";
      this.dialogReject = "cancel";
      this.dialog = true;
      this.dialogAbout = "delete";
    },
    reviewDialog() {
      this.dialogTitle = "reviewConfirmTitle";
      this.dialogDescription = "reivewConfirmContent";
      this.dialogConfirmation = "reviewPass";
      this.dialogReject = "reviewReject";
      this.dialog = true;
      this.dialogAbout = "review";
    },
    reviewPreview() {
      this.isDialog = true;
    },
    async confirmDialog() {
      if (this.dialogAbout === "review") {
        try {
          await deployment.reviewResult(this.uuid, {
            result: true
          });
          this.changeState(this.deployments, this.uuid, "review_accept");
          this.showSnackbar("reviewPassSnackbarText", "success");
          this.infoData.deployment.state = "review_accept";
        } catch {
          /* empty */
        }
      } else {
        // try {
        //   await deployment.deleteDeployment(this.uuid);
        //   this.deployments.splice(index, 1);
        //   this.infoData = {};
        // } catch {
        //   /* empty */
        // }
      }
      this.dialog = false;
    },
    async rejectDialog() {
      if (this.dialogAbout === "review") {
        try {
          await deployment.reviewResult(this.uuid, {
            result: false
          });
          this.changeState(this.deployments, this.uuid, "review_reject");
          this.showSnackbar("reviewRejectSnackbarText", "success");
          this.infoData.deployment.state = "review_reject";
        } catch {
          /* empty */
        }
      }
      this.dialog = false;
    }
  },
  beforeDestroy() {
    clearInterval(this.polling);
  }
};
</script>

<style lang="scss" scoped>
.btn {
  box-shadow: 0px 0px 4px #c7c7cc;
}

.dialogBtn {
  background-color: #2196f3 !important;
  color: white !important;
  margin-left: 20px;
}
</style>
