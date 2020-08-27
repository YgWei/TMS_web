<template>
  <content-layout :infoTitle="title">
    <t-data-table
      :headers="headers"
      :items="templates"
      @handleClick="handleClick"
      :count="count"
      v-model="page"
    >
      <template v-slot:top>
        <v-row>
          <v-btn fab small color="white" @click="showAddItemPage()" class="btn">
            <v-icon color="#666666">mdi-plus</v-icon>
          </v-btn>
        </v-row>
      </template>
    </t-data-table>
    <template v-slot:actions>
      <v-btn fab small icon v-show="footerShow">
        <v-icon @click="dataDownload()">mdi-download-outline</v-icon>
      </v-btn>
      <v-btn fab small icon v-show="footerShow">
        <v-icon @click="dataPreview()">mdi-eye-outline</v-icon>
      </v-btn>
      <v-btn fab small icon v-show="footerShow">
        <v-icon @click="dialog = true">mdi-delete-outline</v-icon>
      </v-btn>
    </template>
    <template v-slot:info>
      <components
        :is="view"
        @changeTab="changeTab"
        :infoData="infoData"
      ></components>
    </template>
    <t-dialog v-model="dialog" checkInfo="dataDelete" uncovery="deleteUncovery">
      <template v-slot:btn>
        <v-btn @click="dialog = false" color="cancel" outlined>
          {{ $t("cancel") }}
        </v-btn>
        <v-btn @click="deleteItem" id="dialogBtn">{{ $t("determine") }}</v-btn>
      </template>
    </t-dialog>
  </content-layout>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import DTabs from "./components/DTabs";
export default {
  components: {
    DTabs
  },
  data() {
    return {
      page: 1,
      count: 0,
      title: "basicInfo",
      view: "d-tabs",
      infoData: {},
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
        { text: this.$t("testTime"), value: "testTime" }
      ],
      templates: [],
      dialog: false
    };
  },
  // watch: {
  //   page: {
  //     immediate: true,
  //     async handler(val) {
  //       const params = {
  //         start: (val - 1) * 10,
  //         limit: val * 10
  //       };
  //       await review.getReview(params).then(res => {
  //         this.count = res.data.data.count;
  //         this.templates = res.data.data.data;
  //       });
  //     }
  //   }
  // },
  computed: {
    ...mapGetters({ footerShow: "getFooterShow" })
  },
  methods: {
    ...mapActions(["setFooterShow"]),
    async handleClick() {
      // await review.getReviewByUuid(e.uuid).then(res => {
      //   this.infoData = res.data.data;
      // });
    },
    changeTab(v) {
      this.title = v;
    },
    showAddItemPage() {
      this.$router.push({ path: "/create", query: { from: "create-test" } });
    },
    dataPreview() {
      const dataPreviewUrl = `${process.env.VUE_APP_DATA_PROTOCOL}://${process.env.VUE_APP_DATA_HOST}:${process.env.VUE_APP_DATA_PORT}/api/tms_tmp/download/${this.infoData.cloudStorageUuid}?type=view`;
      window.open(dataPreviewUrl);
    },
    dataDownload() {
      const cloudStorageUrl = `${process.env.VUE_APP_DATA_PROTOCOL}://${process.env.VUE_APP_DATA_HOST}:${process.env.VUE_APP_DATA_PORT}/api/tms_tmp/download/${this.infoData.cloudStorageUuid}`;
      window.open(cloudStorageUrl);
    },
    async deleteItem() {
      this.dialog = false;
      if (this.footerShow) {
        this.setFooterShow();
      }
    }
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
