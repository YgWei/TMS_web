<template>
  <content-layout :infoTitle="title">
    <t-data-table
      :items="templates"
      :headers="headers"
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
      <div v-show="isShow && keyValue.uuid && footerShow">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn fab small icon v-on="on" @click="changeView('EditTemplate')">
              <v-icon color="#666666">mdi-pencil-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("edit") }}</span>
        </v-tooltip>
        <!-- <v-btn fab small icon @click="dialog = true">
          <v-icon color="#666666">mdi-delete-outline</v-icon>
        </v-btn>-->
      </div>
      <div v-show="!isShow && keyValue.uuid && footerShow">
        <v-btn fab small icon @click="editSubmit()">
          <v-icon color="#666666">mdi-check</v-icon>
        </v-btn>
        <v-btn fab small icon @click="cancel()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </template>
    <template v-slot:info>
      <component
        :is="view"
        :keyValue="keyValue"
        v-model="template"
        ref="form"
      />
    </template>
    <v-snackbar v-model="snackbar" top color="error" text>
      {{ errorMessage }}
      <v-btn @click="snackbar = false" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-overlay :value="overlay"></v-overlay>
    <!-- <t-dialog v-model="dialog" checkInfo="templateDelete" uncovery="deleteUncovery">
      <template v-slot:btn>
          <v-btn @click="dialog = false" outlined color="cancel">{{ $t("cancel") }}</v-btn>
        <v-btn @click="confirm()" id="dialogBtn">{{ $t("determine") }}</v-btn>
       
      </template>
    </t-dialog>-->
  </content-layout>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { template } from "@/api";
import ContentTemplate from "./components/ContentTemplate";
import EditTemplate from "./components/EditTemplate";
export default {
  data() {
    return {
      title: "templateContent",
      workcenter: [],
      errorMessage: "",
      dialog: false,
      overlay: false,
      template: {},
      keyValue: {},
      isShow: true,
      view: "ContentTemplate",
      page: 1,
      snackbar: false,
      count: 0,
      headers: [
        {
          text: this.$t("company"),
          value: "company",
          sortable: false
        },
        { text: this.$t("product"), value: "production" },
        { text: this.$t("templateName"), value: "name" },
        { text: this.$t("templateType"), value: "type" },
        {
          text: this.$t("ProjecteName"),
          value: "repository"
        }
      ],
      templates: []
    };
  },
  components: { EditTemplate, ContentTemplate },
  watch: {
    page: {
      immediate: true,
      async handler(val) {
        const params = {
          start: (val - 1) * 10,
          limit: 999,
          type: "list"
        };
        try {
          const templates = await template.getTemplate(params);
          this.count = templates.data.data.count;
          this.templates = templates.data.data.data;
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
      try {
        const templateBody = await template.getTemplateUuid(e.uuid);
        this.keyValue = templateBody.data.data;
        this.template = {
          name: templateBody.data.data.name,
          type: templateBody.data.data.type,
          entryPoint: templateBody.data.data.entryPoint,
          description: templateBody.data.data.description,
          workCenters: []
        };

        for (let i of templateBody.data.data.workCenters) {
          this.template.workCenters.push({
            name: i.workCenterName,
            uuid: i.workCenterUuid
          });
        }
      } catch {
        /* empty */
      }
    },
    changeView(viewName) {
      this.view = viewName;
      this.overlay = true;
      this.isShow = false;
      this.title = "templateEdit";
      this.setEditShow();
    },
    showAddItemPage() {
      this.$router.push({
        path: "/create",
        query: { from: "create-template" }
      });
      if (this.footerShow) {
        this.setFooterShow();
        this.setEditShow();
      }
    },
    // async confirm() {
    //   try {
    //     await template.deleteTemplate(this.keyValue.uuid);
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
    cancel() {
      this.isShow = true;
      this.view = "ContentTemplate";
      this.title = "templateContent";
      this.overlay = false;
      this.template = {
        name: this.keyValue.name,
        type: this.keyValue.type,
        entryPoint: this.keyValue.entryPoint,
        description: this.keyValue.description,
        workCenters: []
      };
      for (let i of this.keyValue.workCenters) {
        this.template.workCenters.push({
          name: i.workCenterName,
          uuid: i.workCenterUuid
        });
        this.setEditShow();
      }
    },
    // deleteItem() {
    //   this.dialog = true;
    // },
    async editSubmit() {
      const template = this.$refs.form;
      if (template.$refs.form.validate()) {
        this.workcenter = [];
        this.template.workCenters.forEach(uuid => {
          this.workcenter.push(uuid.uuid);
        });
        const params = {
          name: this.template.name,
          type: this.template.type,
          entryPoint: this.template.entryPoint,
          description: this.template.description,
          workCenters: this.workcenter
        };
        try {
          const result = await template.editTemplate(
            this.keyValue.uuid,
            params
          );
          this.keyValue = result.data.data;
          this.isShow = true;
          this.overlay = false;
          this.view = "ContentTemplate";
          this.title = "templateContent";
          const index = this.templates.findIndex(
            element => element.uuid === this.keyValue.uuid
          );
          this.$set(this.templates, index, this.keyValue);
          this.setEditShow();
        } catch {
          this.snackbar = true;
          this.errorMessage = "請確認資料是否完整";
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.btn {
  box-shadow: 0px 0px 4px #c7c7cc;
}
#dialogBtn {
  background-color: #2196f3;
  color: white;
  margin-left: 20px;
}
.v-btn:focus::before {
  display: none;
}
.v-btn:hover::before {
  display: none;
}
</style>
