<template>
  <add-layout>
    <components :is="compList"></components>
  </add-layout>
</template>
<script>
import CreateDeployNew from "./components/CreateDeployNew";
import CreateUpdateNew from "./components/CreateUpdateNew";
import CreateTemplateNew from "./components/CreateTemplateNew";
import CreateWorkCenterNew from "./components/CreateWorkCenterNew";
import CreateReleaseNew from "./components/CreateReleaseNew";
import CreateBusinessNew from "./components/CreateBusinessNew";
import CreateResponsibleNew from "./components/CreateResponsibleNew";
import CreateTemplateListNew from "./components/CreateTemplateListNew";
import CreateTestNew from "./components/CreateTestNew";

export default {
  components: {
    CreateTemplateNew,
    CreateUpdateNew,
    CreateDeployNew,
    CreateWorkCenterNew,
    CreateReleaseNew,
    CreateBusinessNew,
    CreateResponsibleNew,
    CreateTemplateListNew,
    CreateTestNew
  },
  data() {
    return {
      compList: this.$route.query.from + "-new"
    };
  }
};
</script>
