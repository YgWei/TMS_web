<template>
  <content-layout infoTitle="updateContent">
    <t-data-table
      :headers="headers"
      :items="templates"
      @handleClick="handleClick"
      v-model="page"
      :count="count"
    >
      <template v-slot:top>
        <v-row>
          <v-btn fab small color="white" @click="showAddItemPage()" class="btn">
            <v-icon color="#666666">mdi-plus</v-icon>
          </v-btn>
        </v-row>
      </template>
      <template v-slot:footer>
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </template>
    </t-data-table>
    <template v-slot:actions>
      <div>
        <!-- <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              small
              icon
              @click="sendNotification()"
              v-on="on"
              v-show="infoData.uuid && footerShow"
            >
              <v-icon color="#666666">mdi-bullhorn-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("initiateNotification") }}</span>
        </v-tooltip>-->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              small
              icon
              @click="dataPreview()"
              v-on="on"
              v-show="
                infoData.state == '更新成功' ||
                  (infoData.state == '已回報' && footerShow)
              "
            >
              <v-icon color="#666666">mdi-eye-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("preview") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              small
              icon
              @click="cloudStorage()"
              v-on="on"
              v-show="
                infoData.state == '更新成功' ||
                  (infoData.state == '已回報' && footerShow)
              "
            >
              <v-icon color="#666666">mdi-download-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("achievementsDownload") }}</span>
        </v-tooltip>
      </div>
    </template>
    <template v-slot:info>
      <component :is="view" :infoData="infoData" />
    </template>
  </content-layout>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import UpdateContent from "./components/UpdateContent";
import { updateRecord } from "@/api";
import moment from "moment";

export default {
  components: { UpdateContent },
  data() {
    return {
      infoData: {},
      page: 1,
      count: 0,
      view: "UpdateContent",
      headers: [
        {
          text: this.$t("productCenter"),
          align: "left",
          value: "workCenter",
          sortable: false
        },
        { text: this.$t("template"), value: "template" },
        { text: this.$t("updateVersion"), value: "templateVersion" },
        { text: this.$t("updateExpiration"), value: "startTime" },
        { text: this.$t("updateStatus"), value: "state" }
      ],
      templates: []
    };
  },
  computed: {
    ...mapGetters({ footerShow: "getFooterShow" })
  },
  watch: {
    page: {
      immediate: true,
      async handler(val) {
        const params = {
          start: (val - 1) * 10,
          limit: val * 10
        };
        try {
          const datas = await updateRecord.getUpdateRecord(params);
          this.count = datas.data.data.count;
          this.templates = datas.data.data.data;

          this.templates.map(element => {
            element.startTime = this.$t(element.startTime);
            element.state =
              element.state === "init"
                ? this.$t("notUpdated")
                : element.state === "update_success"
                ? this.$t("updateSuccess")
                : element.state === "reported"
                ? this.$t("reported")
                : this.$t("updateFail");
          });
        } catch {
          /* empty */
        }
      }
    }
  },
  methods: {
    ...mapActions(["setFooterShow", "setEditShow"]),
    async handleClick(e) {
      try {
        const result = await updateRecord.getUpdateRecordUuid(e.uuid);
        this.infoData = result.data.data;

        this.infoData.createTime = moment(this.infoData.createTime).format(
          "YYYY/MM/DD - kk:mm"
        );
        this.infoData.startTime = this.$t(this.infoData.startTime);
        this.infoData.state =
          this.infoData.state === "init"
            ? this.$t("notUpdated")
            : this.infoData.state === "update_success"
            ? this.$t("updateSuccess")
            : this.infoData.state === "reported"
            ? this.$t("reported")
            : this.$t("updateFail");
      } catch {
        /* empty */
      }
    },
    showAddItemPage() {
      this.$router.push({
        path: "/create",
        query: { from: "create-update" }
      });
      if (this.footerShow) {
        this.setFooterShow();
        this.setEditShow();
      }
    },
    // sendNotification() {},
    dataPreview() {
      const dataPreviewUrl = `${process.env.VUE_APP_DATA_PROTOCOL}://${process.env.VUE_APP_DATA_HOST}:${process.env.VUE_APP_DATA_PORT}/api/tms_tmp/download/${this.infoData.cloudStorageUuid}?type=view`;
      window.open(dataPreviewUrl);
    },
    cloudStorage() {
      const cloudStorageUrl = `${process.env.VUE_APP_DATA_PROTOCOL}://${process.env.VUE_APP_DATA_HOST}:${process.env.VUE_APP_DATA_PORT}/api/tms_tmp/download/${this.infoData.cloudStorageUuid}`;
      window.open(cloudStorageUrl);
    }
  }
};
</script>
<style lang="scss" scoped>
.btn {
  box-shadow: 0px 0px 4px #c7c7cc;
}
.v-btn:focus::before {
  display: none;
}
.v-btn:hover::before {
  display: none;
}
</style>
