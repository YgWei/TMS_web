<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-input
        class="contentPadding"
        text="templateName"
        v-model="template.name"
      ></t-input>
      <t-select
        class="contentPadding"
        :items="typeItems"
        text="templateType"
        v-model="template.type"
      ></t-select>
      <t-input
        class="contentPadding"
        text="entryPoint"
        :placeholder="placeholder"
        v-model="template.entryPoint"
      ></t-input>
      <t-select-multiple
        class="contentPadding"
        :items="multipleItems"
        text="productCenter"
        v-model="template.workCenters"
        :clear="true"
      ></t-select-multiple>
      <t-textarea
        class="contentPadding"
        text="description"
        v-model="template.description"
      ></t-textarea>
    </v-form>
  </div>
</template>
<script>
import { workcenter } from "@/api";
export default {
  model: {
    prop: "template",
    event: "emit"
  },
  props: {
    template: {
      type: Object
    }
  },
  data() {
    return {
      typeItems: ["fop", "vue"],
      multipleItems: [],
      placeholder: " Vue：/entrypoint/${dataId}     fop：indexName",
      valid: true
    };
  },
  watch: {
    template: {
      deep: true,
      handler() {}
    }
  },
  async mounted() {
    try {
      const workcenters = await workcenter.getWorkcenter({
        start: 0,
        limit: 10,
        type: "select"
      });
      this.multipleItems = workcenters.data.data.data;
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
