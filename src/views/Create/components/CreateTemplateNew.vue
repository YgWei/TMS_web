<template>
  <div>
    <br />
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-select
        :items="companyItems"
        text="company"
        v-model="company"
      ></t-select>
      <t-select
        :items="productionItems"
        text="product"
        v-model="production"
      ></t-select>

      <t-select
        :items="repositoryItems"
        text="ProjecteName"
        v-model="repository"
      ></t-select>
      <t-input text="templateName" v-model="name"></t-input>
      <t-select
        :items="typeItems"
        text="templateType"
        v-model="type"
      ></t-select>
      <t-input
        text="entryPoint"
        placeholder="defaultValue"
        v-model="entryPoint"
      ></t-input>
      <t-select-multiple
        :items="multipleItems"
        text="productCenter"
        v-model="workCenters"
      ></t-select-multiple>
      <t-textarea :text="'description'" v-model="description"></t-textarea>
    </v-form>
    <v-col class="col-btn">
      <v-btn
        color="#2196F3"
        style="width:150px;"
        rounded
        dark
        @click="Define"
        >{{ $t("determine") }}</v-btn
      >
    </v-col>
    <v-snackbar v-model="snackbar" color="#e60000" top>
      {{ $t("createErr") }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import { company, workcenter, template, gitlab } from "@/api";
export default {
  data() {
    return {
      name: "",
      company: null,
      production: null,
      repository: null,
      type: "",
      entryPoint: "",
      description: "",
      workCenters: null,
      snackbar: false,
      companyItems: [],
      productionItems: [],
      typeItems: ["fop", "vue"],
      multipleItems: [],
      repositoryItems: [],
      workcenter: [],
      valid: true
    };
  },
  watch: {
    company: {
      async handler(val) {
        this.production = null;
        this.productionItems = await this.getProduction(val);
      }
    },
    repository: {
      async handler(val) {
        this.name = val.name;
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
        const productions = await company.getProduction(e.uuid, params);
        return productions.data.data.data;
      } catch {
        return [];
      }
    },
    async Define() {
      if (this.$refs.form.validate()) {
        this.workCenters.forEach(uuid => {
          this.workcenter.push(uuid.uuid);
        });
        const params = {
          name: this.name,
          companyUuid: this.company.uuid,
          productionUuid: this.production.uuid,
          projectId: this.repository.id,
          type: this.type,
          entryPoint: this.entryPoint,
          description: this.description,
          workCenters: this.workcenter
        };
        try {
          await template.TemplateDefine(params);
          this.$router.push("/template");
        } catch {
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

      const workcenters = await workcenter.getWorkcenter({
        start: 0,
        limit: 999,
        type: "select"
      });
      this.multipleItems = workcenters.data.data.data;

      const warehouses = await gitlab.getWarehousing({ start: 0, limit: 999 });
      this.repositoryItems = warehouses.data.data.res;
    } catch {
      /* empty */
    }
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
