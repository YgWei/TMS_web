<template>
  <div>
    <br />
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-select
        text="company"
        v-model="company"
        :items="companyItems"
      ></t-select>
      <t-select
        text="product"
        v-model="production"
        :items="productionItems"
      ></t-select>
      <t-select
        text="responsibleTask"
        v-model="template"
        :items="templateItems"
      ></t-select>
    </v-form>
    <v-col class="col-btn">
      <v-btn
        color="#2196F3"
        style="width:150px;"
        rounded
        dark
        @click="define"
        >{{ $t("determine") }}</v-btn
      >
    </v-col>
    <v-snackbar v-model="snackbar" color="#e60000" top>
      {{ $t("templateExists") }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { company, workcenter, template } from "@/api";
export default {
  data() {
    return {
      company: null,
      production: null,
      template: null,
      snackbar: false,
      companyItems: [],
      productionItems: [],
      templateItems: [],
      valid: true
    };
  },
  watch: {
    company: {
      async handler(val) {
        this.production = {};
        this.productionItems = await this.getProduction(val);
      }
    },
    production: {
      async handler(val) {
        this.template = {};
        this.templateItems = await this.getTemplateList(val);
      }
    }
  },
  computed: {
    ...mapGetters({
      workcenterInfo: "getWorkcenterInfo"
    })
  },
  methods: {
    async getProduction(e) {
      let data = null;
      const params = {
        start: 0,
        limit: 999,
        type: "select"
      };
      await company
        .getProduction(e.uuid, params)
        .then(res => {
          data = res.data.data.data;
        })
        .catch(err => {
          throw err;
        });
      return data;
    },
    async getTemplateList(e) {
      let templateData = null;
      const templateParams = {
        start: 0,
        limit: 999,
        type: "select",
        companyUuid: this.company.uuid,
        productionUuid: e.uuid
      };
      await template
        .getTemplate(templateParams)
        .then(res => {
          templateData = res.data.data.data;
        })
        .catch(err => {
          throw err;
        });
      return templateData;
    },

    async define() {
      if (this.$refs.form.validate()) {
        const templateUuid = this.template.uuid;
        await workcenter
          .createTemplateList(this.workcenterInfo.uuid, templateUuid)
          .then(() => {})
          .catch(err => {
            this.snackbar = true;
            throw err;
          });
        this.$router.push("/workcenter/templateList");
      }
    }
  },
  async mounted() {
    await company
      .getCompany({ start: 0, limit: 999, type: "select" })
      .then(res => {
        this.companyItems = res.data.data.data;
      })
      .catch(err => {
        throw err;
      });
  }
};
</script>
<style lang="scss" scoped>
@import "@/design";

.col {
  @extend %create-col-style;
}
.col-btn {
  @extend %create-btn-style;
}
</style>
