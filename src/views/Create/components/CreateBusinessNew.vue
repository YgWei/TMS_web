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
        text="product"
        v-model="production"
      ></t-select>
      <t-input
        text="saleData"
        placeholder="uploadplaceholder"
        v-model="name"
      ></t-input>
      <t-file-input
        text="uploadData"
        placeholder="format"
        v-model="file"
      ></t-file-input>
      <t-textarea text="description" v-model="description"></t-textarea>
    </v-form>
    <v-col class="col-btn">
      <v-btn
        color="#2196F3"
        style="width:150px;"
        rounded
        dark
        @click="confirm()"
        >{{ $t("determine") }}</v-btn
      >
    </v-col>
    <v-snackbar v-model="snackbar" :color="color" top>
      {{ text }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { data, company } from "@/api";
export default {
  data() {
    return {
      company: null,
      production: null,
      name: "",
      description: "",
      file: [],
      productionItems: [],
      text: "",
      color: "rgb(33, 150, 243)",
      snackbar: null,
      companyItems: [],
      valid: true
    };
  },
  watch: {
    company: {
      async handler(val) {
        this.production = {};
        this.productionItems = await this.getProduction(val);
      }
    }
  },
  methods: {
    async confirm() {
      if (this.$refs.form.validate()) {
        let formData = new FormData();
        formData.append("companyUuid", this.company.uuid);
        formData.append("companyName", this.company.name);
        formData.append("productionUuid", this.production.uuid);
        formData.append("productionName", this.production.name);
        formData.append("name", this.name);
        formData.append("description", this.description);
        formData.append("file", this.file);

        try {
          await data.uploadData(formData);
          this.text = this.$t("successText");
          this.color = "rgb(33, 150, 243)";
          this.snackbar = true;
          this.$router.push("/business");
        } catch {
          this.text = this.$t("failText");
          this.color = "#e60000";
          this.snackbar = true;
        }
      }
    },
    async getProduction(e) {
      try {
        const productions = await company.getProduction(e.uuid, {
          start: 0,
          limit: 10,
          type: "select"
        });
        return productions.data.data.data;
      } catch {
        return [];
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
