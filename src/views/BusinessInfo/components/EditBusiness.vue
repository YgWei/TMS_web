<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-select
        class="contentPadding"
        text="company"
        v-model="editedItem.company"
        :items="companyItems"
      ></t-select>
      <t-select
        class="contentPadding"
        text="product"
        v-model="editedItem.production"
        :items="productionItems"
      ></t-select>
      <t-input
        class="contentPadding"
        text="saleData"
        v-model="editedItem.name"
      ></t-input>
      <t-textarea
        class="contentPadding"
        :text="'description'"
        v-model="editedItem.description"
      ></t-textarea>
    </v-form>
  </div>
</template>
<script>
import { company } from "@/api";
export default {
  model: {
    prop: "editedItem",
    event: "emit"
  },
  props: {
    editedItem: {
      type: Object
    },
    keyValue: {
      type: Object
    }
  },
  data() {
    return {
      valid: true,
      companyItems: [],
      productionItems: []
    };
  },
  watch: {
    editedItem: {
      deep: true,
      handler(val) {
        this.$emit("edit", val);
      }
    },
    "editedItem.company": {
      async handler(val) {
        this.editedItem.production = null;
        this.productionItems = await this.getProduction(val);
      }
    }
  },
  methods: {
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
        limit: 10,
        type: "select"
      });
      this.companyItems = companys.data.data.data;

      const productions = await company.getProduction(
        this.editedItem.company.uuid,
        {
          start: 0,
          limit: 10,
          type: "select"
        }
      );
      this.productionItems = productions.data.data.data;
    } catch {
      /* empty */
    }
  }
};
</script>
<style lang="scss" scoped>
.contentPadding {
  padding: 5px 90px 0px 15px;
}
</style>
