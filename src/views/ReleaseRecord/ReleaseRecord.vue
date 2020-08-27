<template>
  <content-layout :infoTitle="title">
    <template v-slot:toBtn>
      <v-row class="top-margin">
        <v-btn fab small color="white" @click="showAddItemPage()" class="btn">
          <v-icon color="#666666">mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </template>
    <rs-panes
      id="panes"
      split-to="columns"
      :allow-resize="true"
      units="percents"
      :size="75"
      primary="first"
      style="max-height:88%;"
    >
      <div slot="firstPane" id="firstTree">
        <div class="treeTitle">
          <p class="titleP">{{ $t("DeploymentVersion") }}</p>
        </div>
        <v-treeview
          dense
          :items="items"
          class="treeValue"
          activatable
          transition
          open-on-click
          return-object
          @update:active="fetchDatas"
          :load-children="fetchItems"
        ></v-treeview>
      </div>
      <div slot="secondPane">
        <div class="treeTitle">
          <p class="titleP">{{ $t("dataVersion") }}</p>
        </div>
        <v-treeview
          dense
          :items="datas"
          class="treeValue"
          activatable
          open-on-click
          transition
          return-object
          @update:active="fetchDataInfo"
        ></v-treeview>
      </div>
    </rs-panes>

    <template v-slot:actions>
      <div v-show="infoData.cloudStorageUuid && editShow">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn fab small icon @click="dataPreview()" v-on="on">
              <v-icon color="#666666">mdi-eye-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("preview") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn fab small icon @click="cloudStorage()" v-on="on">
              <v-icon color="#666666">mdi-download-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("achievementsDownload") }}</span>
        </v-tooltip>
      </div>
    </template>

    <template v-slot:info>
      <components :is="view" :infoData="infoData"></components>
    </template>
  </content-layout>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { release, data, deployment } from "@/api";
import ReleaseContent from "./components/ReleaseContent";
export default {
  props: { a: { type: Array } },

  data() {
    return {
      infoData: {},
      items: [],
      datas: [],
      view: "ReleaseContent",
      title: "basicInfo"
    };
  },
  components: { ReleaseContent },
  computed: {
    ...mapGetters({ footerShow: "getFooterShow", editShow: "getEditShow" })
    // height() {
    //   return this.footerShow ? "46vh" : "64vh";
    // }
  },
  methods: {
    ...mapActions(["setFooterShow", "setEditShow"]),
    showAddItemPage() {
      this.$router.push({
        path: "/create",
        query: { from: "create-release" }
      });
      if (this.footerShow) {
        this.setFooterShow();
        this.setEditShow();
      }
    },
    mapping(res, e) {
      // formatting the response object for node tree
      return res.map(res => {
        return {
          id:
            res.type === "data"
              ? res.uuid
              : res.companyUuid +
                res.productionUuid +
                res.templateUuid +
                res.deploymentUuid,
          name: res.name,
          type: res.type,
          companyUuid: res.companyUuid,
          productionUuid: res.productionUuid,
          templateUuid: res.templateUuid,
          deploymentUuid: res.deploymentUuid,
          children:
            e.type === "deployment" || e.type === "template" ? undefined : []
        };
      });
    },
    async fetchItems(e) {
      function findIndex(items) {
        // to find the index of the children to put the data response
        let companyIndex = items.findIndex(
          item => item.companyUuid === e.companyUuid
        );
        let productionIndex =
          companyIndex !== -1
            ? items[companyIndex].children.findIndex(
                item =>
                  item.companyUuid === e.companyUuid &&
                  item.productionUuid === e.productionUuid
              )
            : "";
        let templateIndex =
          productionIndex !== -1
            ? items[companyIndex].children[productionIndex].children.findIndex(
                item =>
                  item.companyUuid === e.companyUuid &&
                  item.productionUuid === e.productionUuid &&
                  item.templateUuid === e.templateUuid
              )
            : "";
        return { companyIndex, productionIndex, templateIndex };
      }

      const params = {
        select: e.type,
        companyUuid: e.companyUuid,
        productionUuid: e.productionUuid,
        templateUuid: e.templateUuid,
        deploymentUuid: e.deploymentUuid,
        dataUuid: e.dataUuid
      };

      try {
        const treeBody = await release.getReleaseTree(params);
        // if response is empty then we make the children of that node empty.
        if (treeBody.data.data.results.length == 0) {
          const index = findIndex(this.items);
          switch (e.type) {
            case "company":
              this.items[index.companyIndex].children = undefined;
              break;
            case "production":
              this.items[index.companyIndex].children[
                index.productionIndex
              ].children = undefined;
              break;
            case "template":
              this.items[index.companyIndex].children[
                index.productionIndex
              ].children[index.templateIndex].children = undefined;
              break;
          }
          return;
        }
        // Format the response and find which children node that we put the reponse
        if (treeBody.data.data.results[0].type === "template") {
          const index = findIndex(this.items);
          this.items[index.companyIndex].children[
            index.productionIndex
          ].children = this.mapping(treeBody.data.data.results, e);
        } else if (treeBody.data.data.results[0].type === "deployment") {
          const index = findIndex(this.items);
          this.items[index.companyIndex].children[
            index.productionIndex
          ].children[index.templateIndex].children = this.mapping(
            treeBody.data.data.results,
            e
          );
        } else {
          let companyIndex = this.items.findIndex(item => item.id === e.id);
          this.items[companyIndex].children = this.mapping(
            treeBody.data.data.results,
            e
          );
        }
      } catch {
        /* empty */
      }
    },
    async fetchDatas(e) {
      // Get Deployment Contents and also data list when @click event happen
      if (e.length === 0 || e[0].type !== "deployment") {
        this.datas = [];
        this.infoData = {};
        return;
      }
      const params = {
        select: e[0].type,
        companyUuid: e[0].companyUuid,
        productionUuid: e[0].productionUuid,
        templateUuid: e[0].templateUuid,
        deploymentUuid: e[0].deploymentUuid
      };
      try {
        const releaseTree = await release.getReleaseTree(params);
        this.datas = this.mapping(releaseTree.data.data.results, e[0]);

        const params1 = {
          type: "all"
        };
        const deploymentBody = await deployment.getDeployment(
          e[0].deploymentUuid,
          params1
        );
        this.infoData = deploymentBody.data.data.deployment;
        this.infoData.state = this.$t(this.infoData.state);
        this.infoData.type = "deployment";
        this.title = "ReleaseContent";
        if (!this.footerShow) {
          this.setFooterShow();
          this.setEditShow();
        }
      } catch {
        /* empty */
      }
    },
    async fetchDataInfo(e) {
      // Get Data Contents when @click event happen
      if (e.length === 0) {
        this.infoData = {};
        return;
      }
      try {
        const dataBody = await data.getDataValue(e[0].id);
        this.infoData = dataBody.data.data;
        this.title = "saleDataContent";
        if (!this.footerShow) {
          this.setFooterShow();
          this.setEditShow();
        }
      } catch {
        /* empty */
      }
    },
    dataPreview() {
      const dataPreviewUrl = `${process.env.VUE_APP_DATA_PROTOCOL}://${process.env.VUE_APP_DATA_HOST}:${process.env.VUE_APP_DATA_PORT}/api/tms_tmp/download/${this.infoData.cloudStorageUuid}?type=view`;
      window.open(dataPreviewUrl);
    },
    cloudStorage() {
      const cloudStorageUrl = `${process.env.VUE_APP_DATA_PROTOCOL}://${process.env.VUE_APP_DATA_HOST}:${process.env.VUE_APP_DATA_PORT}/api/tms_tmp/download/${this.infoData.cloudStorageUuid}`;
      window.open(cloudStorageUrl);
    }
  },
  async mounted() {
    const params = {
      select: "root"
    };
    try {
      const releaseTree = await release.getReleaseTree(params);
      this.items = releaseTree.data.data.results.map(res => {
        return {
          id: res.uuid,
          name: res.name,
          type: res.type,
          companyUuid: res.companyUuid,
          children: []
        };
      });
    } catch {
      /* empty */
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .v-treeview--dense .v-treeview-node__root {
  border-bottom: solid 1px;
}
.top-margin {
  align-items: center;
  padding-left: 20px;
  padding-bottom: 10px;
}

#firstTree {
  height: 73% !important;
  overflow-y: scroll;
}

.btn {
  box-shadow: 0px 0px 4px #c7c7cc;
}
.treeTitle {
  background-color: #f3f3f3;
  display: flex;
  height: 48px;
  border-bottom: solid 1px #e5e5ea;
}
.titleP {
  padding: 16px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
}
#panes ::v-deep span {
  z-index: 0;
  margin: 0px !important;
}
.treeValue {
  color: #8e8e93;
  font-size: 13px;
  font-weight: 500;
}
.v-btn:focus::before {
  display: none;
}
.v-btn:hover::before {
  display: none;
}
</style>
