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
      <t-select :items="dataItems" v-model="data" text="saleData"></t-select>
      <t-input
        text="templateVersion"
        v-model="tag"
        placeholder="tagExample"
        prefix="dev-"
        :otherRules="rules"
        :icon="check"
        :disabled="checkVersion"
        :error="error"
      ></t-input>
      <t-select
        text="projectBranch"
        v-model="branch"
        :items="branchItems"
        :disabled="checkTemplate"
      ></t-select>
      <t-textarea text="note" v-model="deploymentBody.note"></t-textarea>
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
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import { company, template, data, deployment, gitlab } from "@/api";
export default {
  data() {
    return {
      companyItems: [],
      productionItems: [],
      templateItems: [],
      dataItems: [],
      branchItems: [],
      company: null,
      production: null,
      template: null,
      data: null,
      branch: null,
      deploymentBody: {},
      snackbar: false,
      overlay: false,
      tag: null,
      valid: true,
      timeout: null,
      rules: [
        value => !!value || "Required.",
        value => /(^\d+)((\.\d+)*$)/.test(value) || "TAG must be valid",
        () => {
          return this.checkRules;
        }
      ],
      checkRules: true,
      check: "",
      checkTemplate: true,
      checkVersion: true,
      error: false
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
        this.data = null;
        if (val !== null) {
          this.templateItems = await this.getTemplates(val);
          this.dataItems = await this.getDatas(val);
        }
      }
    },
    template: {
      async handler(val) {
        this.branch = null;
        if (val !== null) {
          this.branchItems = await this.getBranch(val.repository.id);
          this.checkTemplate = false;
          this.checkVersion = false;
        }
      }
    },
    tag: {
      async handler(val) {
        clearTimeout(this.timeout);
        this.checkRules = true;
        this.error = false;
        this.timeout = setTimeout(async () => {
          if (/(^\d+)((\.\d+)*$)/.test(val) === true) {
            this.checkVersion = true;
            const tagInput = `dev-${val}`;
            const params = {
              templateUuid: this.template.uuid,
              tag: tagInput
            };
            try {
              const tag = await deployment.getTag(params);

              if (tag.data.data.length === 0) {
                this.check = "mdi-check";
                this.error = false;
              } else {
                for (const i of tag.data.data) {
                  if (!(i.name === tagInput || i.tag === tagInput)) {
                    this.check = "mdi-check";
                    this.error = false;
                  } else {
                    this.check = "mdi-close";
                    this.error = true;
                    break;
                  }
                }
              }
            } catch {
              this.error = true;
              this.check = "mdi-close";
            } finally {
              this.checkVersion = false;
            }
          } else {
            this.check = "mdi-close";
          }
        }, 500);
      }
    }
  },
  methods: {
    async getProduction(e) {
      const params = {
        start: 0,
        limit: 999,
        type: "select"
      };
      try {
        const result = await company.getProduction(e.uuid, params);
        return result.data.data.data;
      } catch {
        return [];
      }
    },
    async getTemplates(e) {
      const params = {
        start: 0,
        limit: 999,
        type: "all",
        companyUuid: this.company.uuid,
        productionUuid: e.uuid
      };
      try {
        const result = await template.getTemplate(params);
        return result.data.data.data;
      } catch (err) {
        return [];
      }
    },
    async getDatas(e) {
      const params = {
        start: 0,
        limit: 999,
        type: "select",
        companyUuid: this.company.uuid,
        productionUuid: e.uuid
      };
      try {
        const result = await data.getData(params);
        return result.data.data.data;
      } catch (err) {
        return [];
      }
    },
    async getBranch(e) {
      try {
        const params = {
          start: 0,
          limit: 10
        };
        const result = await gitlab.getBranches(e, params);
        return result.data.data.res;
      } catch {
        return [];
      }
    },
    async submitRegis() {
      if (this.check !== "mdi-check") {
        this.checkRules = false;
      }
      if (this.$refs.form.validate()) {
        this.overlay = true;
        this.deploymentBody.companyUuid = this.company.uuid;
        this.deploymentBody.productionUuid = this.production.uuid;
        this.deploymentBody.templateUuid = this.template.uuid;
        this.deploymentBody.dataUuid = this.data.uuid;
        this.deploymentBody.branch = this.branch.name;
        this.deploymentBody.tag = `dev-${this.tag}`;

        try {
          await deployment.createDeployment(this.deploymentBody);
          this.overlay = false;
          this.$router.push({ path: "/deploymentmanage" });
        } catch {
          this.overlay = false;
          this.snackbar = true;
        }
      }
    }
  },
  async mounted() {
    try {
      const companys = await company.getCompany({
        start: 0,
        limit: 999,
        type: "select"
      });
      this.companyItems = companys.data.data.data;
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
