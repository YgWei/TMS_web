<template>
  <div>
    <br />
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-select
        :items="companyItems"
        v-model="company"
        text="company"
      ></t-select>
      <t-select
        :items="productionItems"
        v-model="production"
        text="product"
      ></t-select>
      <t-select
        :items="templateItems"
        v-model="template"
        text="template"
      ></t-select>
      <t-select
        :items="versions"
        v-model="versionSelected"
        text="templateVersion"
      ></t-select>
      <t-file-input
        text="uploadData"
        placeholder="format"
        v-model="file"
      ></t-file-input>
    </v-form>
    <v-col class="col-btn">
      <v-btn
        color="#2196F3"
        style="width:150px;"
        rounded
        dark
        @click="submitRegis()"
        >{{ $t("determine") }}</v-btn
      >
    </v-col>
    <v-snackbar v-model="snackbar" top color="error" text>
      {{ $t("deploymentError") }}
      <v-btn @click="snackbar = false" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import { company, template, deployment } from "@/api";
export default {
  data() {
    return {
      companyItems: [],
      productionItems: [],
      templateItems: [],
      versions: [],
      file: [],
      company: null,
      production: null,
      template: null,
      versionSelected: null,
      deploymentBody: {},
      snackbar: false,
      valid: true
    };
  },
  // computed: {
  //   ...mapGetters({ role: "getRoles" })
  // },
  watch: {
    company: {
      async handler(val) {
        this.production = null;
        this.productionItems = await this.getProduction(val);
      }
    },
    production: {
      async handler(val) {
        this.template = null;
        if (val == null) return;
        this.templateItems = await this.getTemplates(val);
      }
    },
    template: {
      async handler(val) {
        this.versionSelected = null;
        if (val == null) return;
        const params = {
          start: 0,
          limit: 999,
          type: "all",
          templateUuid: val.uuid
        };
        try {
          const getDeployments = await deployment.getDeployments(params);
          this.versions = getDeployments.data.data.data;
        } catch {
          /* empty */
        }
      }
    }
  },
  methods: {
    async getProduction(e) {
      try {
        const params = {
          start: 0,
          limit: 999,
          type: "select"
        };
        let result = await company.getProduction(e.uuid, params);
        return result.data.data.data;
      } catch {
        return [];
      }
    },
    async getTemplates(e) {
      try {
        const params = {
          start: 0,
          limit: 999,
          type: "all",
          companyUuid: this.company.uuid,
          productionUuid: e.uuid
        };
        let result = await template.getTemplate(params);

        return result.data.data.data;
      } catch {
        return [];
      }
    },
    async submitRegis() {
      if (this.$refs.form.validate()) {
        // this.overlay = true;
        // this.deploymentBody.companyUuid = this.company.uuid;
        // this.deploymentBody.productionUuid = this.production.uuid;
        // this.deploymentBody.templateUuid = this.template.uuid;
        // this.deploymentBody.dataUuid = this.data.uuid;
        // this.deploymentBody.branch = this.branch.name;
        // this.deploymentBody.tag = this.tag;
        // await deployment
        //   .createDeployment(this.deploymentBody)
        //   .then(() => {
        //     this.$router.push({ path: "/deploymentmanage" });
        //     this.overlay = false;
        //   })
        //   .catch(() => {
        //     this.snackbar = true;
        //     this.overlay = false;
        //   });
      }
    }
  },
  async mounted() {
    try {
      const getCompany = await company.getCompany({
        start: 0,
        limit: 999,
        type: "select"
      });
      this.companyItems = getCompany.data.data.data;
    } catch {
      /* empty */
    }
    // authName(this.role);
  }
};
</script>

<style scoped lang="scss">
@import "@/design";

.col {
  @extend %create-col-style;
}
.col-btn {
  @extend %create-btn-style;
}
</style>
