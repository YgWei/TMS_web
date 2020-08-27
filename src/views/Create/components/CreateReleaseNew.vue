<template>
  <div>
    <br />
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-select
        :items="templates"
        :text="'templateName'"
        v-model="template"
      ></t-select>
      <t-select
        :items="items"
        :text="'DeploymentVersion'"
        v-model="deploymentVersion"
        :disabled="checkTemplate"
      ></t-select>
      <v-col class="col-btn">
        <v-btn
          color="#2196F3"
          style="width:150px;"
          rounded
          dark
          @click="createRelease()"
          >{{ $t("determine") }}</v-btn
        >
      </v-col>
    </v-form>
  </div>
</template>
<script>
import { template, deployment, release } from "@/api";
export default {
  data() {
    return {
      template: null,
      templates: [],
      checkTemplate: true,
      items: [],
      deploymentVersion: null,
      valid: true
    };
  },
  watch: {
    template: {
      async handler(val) {
        this.checkTemplate = false;
        const params = {
          start: 0,
          limit: 999,
          type: "all",
          status: "review_accept",
          templateUuid: val.uuid
        };
        try {
          const getDeployments = await deployment.getDeployments(params);
          this.items = getDeployments.data.data.data;
        } catch {
          /* empty */
        }
      }
    }
  },
  methods: {
    async createRelease() {
      if (this.$refs.form.validate()) {
        const body = {
          deploymentUuid: this.deploymentVersion.uuid
        };
        try {
          await release.createRelease(body);
          this.$router.push({ path: "/release" });
        } catch {
          /* empty */
        }
      }
    }
  },
  async mounted() {
    const params = {
      start: 0,
      limit: 999,
      type: "list"
    };
    try {
      const getTemplates = await template.getTemplate(params);
      this.templates = getTemplates.data.data.data;
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
