<template>
  <div>
    <br />
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-input text="name" v-model="owner.name"></t-input>
      <t-select
        text="responsibleTask"
        v-model="owner.template"
        :items="templateSelect"
      ></t-select>
      <t-input text="phone" v-model="owner.phone"></t-input>
      <t-input text="email" v-model="owner.email"></t-input>
    </v-form>
    <v-col class="col-btn">
      <v-btn
        color="#2196F3"
        style="width:150px;"
        rounded
        dark
        @click="createOwner()"
        >{{ $t("determine") }}</v-btn
      >
    </v-col>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { workcenter } from "@/api";
export default {
  data() {
    return {
      owner: {
        name: "",
        template: "",
        phone: "",
        email: ""
      },
      valid: true
    };
  },
  computed: {
    ...mapGetters({
      workcenterInfo: "getWorkcenterInfo",
      templateSelect: "getTemplateSelect"
    })
  },
  methods: {
    createOwner() {
      if (this.$refs.form.validate()) {
        const creatparams = {
          name: this.owner.name,
          templateUuid: this.owner.template.templateUuid,
          email: this.owner.email,
          phone: this.owner.phone
        };
        workcenter
          .createOwner(this.workcenterInfo.uuid, creatparams)
          .then(() => {
            this.$router.go(-1);
          })
          .catch(err => {
            throw err;
          });
      }
    }
  },
  async mounted() {
    const params = {
      params: {
        start: 0,
        limit: 10,
        type: "select"
      },
      workCenterUuid: this.workcenterInfo.uuid
    };
    await this.$store.dispatch("getTemplateList", params);
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
