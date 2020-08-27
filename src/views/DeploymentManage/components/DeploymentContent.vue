<template>
  <div>
    <t-content-template
      v-for="(item, key) in items"
      :title="key"
      :value="item"
      :key="key"
    ></t-content-template>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: {
    infoData: Object,
    title: String
  },
  computed: {
    items() {
      if (Object.keys(this.infoData).length === 0) return {};
      let Obj = {};
      if (this.title === "basicInfo") {
        Obj = {
          company: this.infoData.deployment.company.name,
          product: this.infoData.deployment.production.name,
          templateName: this.infoData.deployment.template.name,
          templateVersion: this.infoData.deployment.template.tag,
          businessData: this.infoData.deployment.data.name,
          currentStatus: this.$t(this.infoData.deployment.state),
          note: this.infoData.deployment.note
        };
      } else if (this.title === "projectInformation") {
        Obj = {
          projectName: this.infoData.deployment.template.repository,
          projectBranch: this.infoData.deployment.template.branch,
          commit: this.infoData.deployment.template.commit
        };
      } else {
        if (Object.keys(this.infoData.review).length === 0) {
          Obj = {
            inspector: null,
            inspectionGroup: null,
            customer: null,
            expiration: null
          };
          return Obj;
        }
        Obj = {
          inspector: this.infoData.review.reviewUser.name,
          inspectionGroup: this.infoData.review.reviewGroup
            .map(element => element.name)
            .join(", "),
          customer: this.infoData.review.customer.name,
          expiration: `${moment(this.infoData.review.startTime).format(
            "YYYY/" + "MM/" + "DD" + ", kk:" + "mm"
          )} ~ ${moment(this.infoData.review.endTime).format(
            "YYYY/" + "MM/" + "DD" + ", kk:" + "mm"
          )}`
        };
      }
      return Obj;
    }
  }
};
</script>
