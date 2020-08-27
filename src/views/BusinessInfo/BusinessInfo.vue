<template>
  <content-layout :infoTitle="title">
    <t-data-table
      :headers="headers"
      :items="templates"
      @handleClick="handleClick"
      v-model="page"
      :count="count"
    >
      <template v-slot:top>
        <v-row>
          <v-btn
            fab
            small
            color="white"
            @click="showAddItemPage()"
            class="create"
          >
            <v-icon color="#666666">mdi-plus</v-icon>
          </v-btn>
          <!-- <t-search :labelOne="labelOne" :labelTwo="labelTwo"></t-search> -->
        </v-row>
      </template>
    </t-data-table>

    <template v-slot:actions>
      <div v-show="isShow && keyValue.uuid && footerShow">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn fab small icon @click="dataPreview()" v-on="on">
              <v-icon color="#666666">mdi-eye-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("viewData") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn fab small icon @click="cloudStorage()" v-on="on">
              <v-icon color="#666666">mdi-download-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("downloadFile") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn fab small icon @click="changeView()" v-on="on">
              <v-icon color="#666666">mdi-pencil-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("edit") }}</span>
        </v-tooltip>
        <!-- <v-btn fab small icon>
          <v-icon color="#666666" @click="dialog = true">mdi-delete-outline</v-icon>
        </v-btn>-->
      </div>
      <div v-show="!isShow && keyValue.uuid && footerShow">
        <v-btn fab small icon @click="editSubmit()">
          <v-icon color="#666666">mdi-check</v-icon>
        </v-btn>
        <v-btn fab small icon>
          <v-icon @click="cancel()">mdi-close</v-icon>
        </v-btn>
      </div>
    </template>
    <template v-slot:info>
      <component
        :is="componentList"
        :keyValue="keyValue"
        v-model="editedItem"
        ref="form"
      />
    </template>
    <v-overlay :value="overlay"></v-overlay>
    <!-- <t-dialog v-model="dialog" checkInfo="dataDelete" uncovery="deleteUncovery">
      <template v-slot:btn>
        <v-btn @click="dialog = false" outlined color="cancel">
          {{
          $t("cancel")
          }}
        </v-btn>
        <v-btn @click="deleteItem" class="dialogBtn">
          {{
          $t("determine")
          }}
        </v-btn>
      </template>
    </t-dialog>-->
  </content-layout>
</template>
<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import BusinessContent from "./components/BusinessContent";
import EditBusiness from "./components/EditBusiness";
import { data } from "@/api";
export default {
  data() {
    return {
      title: "saleDataContent",
      dialog: false,
      overlay: false,
      componentList: "BusinessContent",
      labelOne: this.$t("company"),
      labelTwo: this.$t("insurancetype"),
      isShow: true,
      company: null,
      type: null,
      page: 1,
      count: 0,
      headers: [
        {
          text: this.$t("company"),
          value: "company",
          sortable: false
        },
        { text: this.$t("product"), value: "production" },
        { text: this.$t("saleData"), value: "name" },
        { text: this.$t("creationDay"), value: "createTime" },
        { text: this.$t("founder"), value: "createUser" }
      ],
      editedItem: {},
      templates: [],
      keyValue: {}
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
          limit: 10 * val,
          type: "list"
        };
        try {
          const datas = await data.getData(params);
          this.count = datas.data.data.count;
          this.templates = datas.data.data.data;
          this.templates.map(element => {
            element.createTime = moment(element.createTime).format(
              "YYYY/MM/DD - kk:mm"
            );
          });
        } catch {
          /* empty */
        }
      }
    }
  },
  components: { EditBusiness, BusinessContent },
  methods: {
    ...mapActions(["setFooterShow", "setEditShow"]),
    async handleClick(e) {
      try {
        const dataBody = await data.getDataValue(e.uuid);
        this.keyValue = dataBody.data.data;
        this.editedItem = {
          company: dataBody.data.data.company,
          production: dataBody.data.data.production,
          description: dataBody.data.data.description,
          name: dataBody.data.data.name
        };
      } catch {
        /* empty */
      }
    },
    // async deleteItem() {
    //   try {
    //     await data.deleteData(this.keyValue.uuid);
    //     const index = this.templates.findIndex(
    //       element => element.uuid === this.keyValue.uuid
    //     );
    //     this.templates.splice(index, 1);
    //     this.keyValue = {};
    //   } catch {
    //     /* empty */
    //   }
    //   this.dialog = false;
    //   if (this.footerShow) {
    //     this.setFooterShow();
    //   }
    // },

    showAddItemPage() {
      this.$router.push({
        path: "/create",
        query: { from: "create-business" }
      });

      if (this.footerShow) {
        this.setFooterShow();
        this.setEditShow();
      }
    },
    changeView() {
      this.componentList = "edit-business";
      this.overlay = true;
      this.isShow = false;
      this.title = "edit";
      this.setEditShow();
    },
    cancel() {
      this.isShow = true;
      this.componentList = "BusinessContent";
      this.title = "saleDataContent";
      this.overlay = false;
      this.editedItem = {
        company: this.keyValue.company,
        production: this.keyValue.production,
        description: this.keyValue.description,
        name: this.keyValue.name
      };
      this.setEditShow();
    },
    dataPreview() {
      const dataPreviewUrl = `${process.env.VUE_APP_DATA_PROTOCOL}://${process.env.VUE_APP_DATA_HOST}:${process.env.VUE_APP_DATA_PORT}/api/tms_tmp/download/${this.keyValue.cloudStorageUuid}?type=view`;
      window.open(dataPreviewUrl);
    },
    cloudStorage() {
      const cloudStorageUrl = `${process.env.VUE_APP_DATA_PROTOCOL}://${process.env.VUE_APP_DATA_HOST}:${process.env.VUE_APP_DATA_PORT}/api/tms_tmp/download/${this.keyValue.cloudStorageUuid}`;
      window.open(cloudStorageUrl);
    },
    async editSubmit() {
      const businessData = this.$refs.form;
      if (businessData.$refs.form.validate()) {
        const params = {
          companyUuid: this.editedItem.company.uuid,
          productionUuid: this.editedItem.production.uuid,
          name: this.editedItem.name,
          description: this.editedItem.description
        };
        try {
          const result = await data.editData(this.keyValue.uuid, params);
          this.keyValue = result.data.data;
          this.overlay = false;
          this.isShow = true;
          this.componentList = "BusinessContent";
          this.title = "saleDataContent";
          const index = this.templates.findIndex(
            element => element.uuid === this.keyValue.uuid
          );
          this.$set(this.templates, index, this.keyValue);
          this.templates[index].createTime = moment(
            this.keyValue.createTime
          ).format("YYYY/MM/DD - kk:mm");
          this.setEditShow();
        } catch {
          this.snackbar = true;
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.create {
  // margin: 10px 0px 12px;
  box-shadow: 0px 0px 4px #c7c7cc;
}
.v-btn:focus::before {
  display: none;
}
.v-btn:hover::before {
  display: none;
}

// #dialogBtn {
//   background-color: #2196f3;
//   color: white;
//   margin-left: 20px;
// }
</style>
