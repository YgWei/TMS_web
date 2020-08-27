<template>
  <content-layout :infoTitle="title">
    <t-data-table
      :headers="headers"
      :items="review"
      @handleClick="handleClick"
      :count="count"
      v-model="page"
    ></t-data-table>
    <template v-slot:actions>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            small
            icon
            v-show="!isShow && infoData.uuid && footerShow"
            v-on="on"
            @click="dataPreview()"
          >
            <v-icon>mdi-eye-outline</v-icon>
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
            v-show="!isShow && infoData.uuid && footerShow"
            v-on="on"
            @click="dataDownload()"
          >
            <v-icon>mdi-download-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("achievementsDownload") }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            small
            icon
            v-show="!isShow && footerShow && !infoData.reviewMessage"
            v-on="on"
            @click="goReview()"
          >
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("QualityInspection") }}</span>
      </v-tooltip>
      <v-btn
        fab
        small
        icon
        v-show="isShow && footerShow"
        @click="submitReview()"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
      <v-btn fab small icon v-show="isShow && footerShow" @click="cancel()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <template v-slot:info>
      <components
        :is="view"
        v-model="reviewResult"
        @changeTab="changeTab"
        ref="form"
        :infoData="infoData"
      ></components>
    </template>
    <v-overlay :value="overlay"></v-overlay>
    <v-snackbar v-model="snackbar" top :color="snackbarColor" text>
      {{ snackbarName }}
      <v-btn @click="snackbar = false" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </content-layout>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { review } from "@/api";
import moment from "moment";
import ReviewForm from "./components/ReviewForm";
import DTabs from "./components/DTabs";
import { snackbarMixin, changeTableStateMixin } from "@/mixins";
export default {
  components: {
    ReviewForm,
    DTabs
  },
  mixins: [snackbarMixin, changeTableStateMixin],
  data() {
    return {
      page: 1,
      count: 0,
      title: "basicInfo",
      view: "d-tabs",
      infoData: {},
      reviewResult: {},
      isShow: false,
      headers: [
        {
          text: this.$t("company"),
          value: "company",
          sortable: false
        },
        { text: this.$t("product"), value: "production" },
        { text: this.$t("templateName"), value: "template" },
        { text: this.$t("templateVersion"), value: "templateVersion" },
        { text: this.$t("qualityDate"), value: "endTime" },
        { text: this.$t("status"), value: "state" }
      ],
      review: [],
      snackbar: false,
      snackbarColor: "error",
      snackbarName: "",
      overlay: false
    };
  },
  watch: {
    page: {
      immediate: true,
      async handler(val) {
        const params = {
          start: (val - 1) * 10,
          limit: val * 10,
          type: "review"
        };
        try {
          const datas = await review.getReview(params);
          this.count = datas.data.data.count;
          this.review = datas.data.data.data;
          this.review.map(element => {
            element.endTime = moment(element.endTime).format(
              "YYYY/MM/DD - kk:mm"
            );
            element.startTime = moment(element.startTime).format(
              "YYYY/MM/DD - kk:mm"
            );
            element.state =
              element.state === false
                ? this.$t("unQualified")
                : this.$t("Qualified");
          });
        } catch {
          /* empty */
        }
      }
    }
  },
  computed: {
    ...mapGetters({ footerShow: "getFooterShow" })
  },
  methods: {
    ...mapActions(["setFooterShow", "setEditShow"]),
    async handleClick(e) {
      this.reviewResult = {};
      try {
        const result = await review.getReviewByUuid(e.uuid);
        this.infoData = result.data.data;
        this.infoData.state = e.state;

        this.infoData.endTime = moment(this.infoData.endTime).format(
          "YYYY/MM/DD - kk:mm"
        );
        this.infoData.startTime = moment(this.infoData.startTime).format(
          "YYYY/MM/DD - kk:mm"
        );
      } catch {
        /* empty */
      }
    },
    changeTab(v) {
      this.title = v;
    },
    cancel() {
      this.isShow = false;
      this.view = "d-tabs";
      this.overlay = false;
      this.setEditShow();
      this.reviewResult = {};
    },
    goReview() {
      this.view = "review-form";
      this.isShow = true;
      this.overlay = true;
      this.setEditShow();
    },
    async submitReview() {
      if (this.$refs.form.$refs.form.validate()) {
        try {
          const result = await review.submitReview(
            this.infoData.uuid,
            this.reviewResult
          );
          this.infoData.reviewMessage = result.data.data.message;
          this.infoData.reviewState = result.data.data.result;
          this.changeState(this.review, this.infoData.uuid, "Qualified");
          this.showSnackbar("inspectSuccess", "success");
          this.setEditShow();
          this.overlay = false;
          this.isShow = false;
          this.view = "d-tabs";
        } catch {
          this.showSnackbar("inspectError", "error");
        }
      }
    },
    dataPreview() {
      const dataPreviewUrl = `${process.env.VUE_APP_DATA_PROTOCOL}://${process.env.VUE_APP_DATA_HOST}:${process.env.VUE_APP_DATA_PORT}/api/tms_tmp/download/${this.infoData.renderResult}?type=view`;
      window.open(dataPreviewUrl);
    },
    dataDownload() {
      const cloudStorageUrl = `${process.env.VUE_APP_DATA_PROTOCOL}://${process.env.VUE_APP_DATA_HOST}:${process.env.VUE_APP_DATA_PORT}/api/tms_tmp/download/${this.infoData.renderResult}`;
      window.open(cloudStorageUrl);
    }
  }
};
</script>
<style lang="scss" scoped>
.v-btn:focus::before {
  display: none;
}
.v-btn:hover::before {
  display: none;
}
</style>
