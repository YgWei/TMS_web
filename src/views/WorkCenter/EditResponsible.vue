<template>
  <div>
    <br />
    <div>
      <v-btn icon class="icon" @click="goBack()">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </div>
    <t-input text="name" v-model="editOwner.name"></t-input>
    <t-select
      text="responsibleTask"
      v-model="editOwner.template"
      :items="templateSelect"
    ></t-select>
    <t-input text="phone" v-model="editOwner.phone"></t-input>
    <t-input text="email" v-model="editOwner.email"></t-input>
    <v-col class="col-btn">
      <v-btn
        color="#2196F3"
        style="width:150px;"
        rounded
        dark
        @click="define()"
      >
        {{ $t("determine") }}
      </v-btn>
    </v-col>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
// import { workcenter } from "@/api";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["setEditOwner"]),
    goBack() {
      this.$router.go(-1);
    },
    // define() {
    //   const params = {
    //     templateUuid: this.editOwner.templateUuid,
    //     name: this.editOwner.name,
    //     email: this.editOwner.email,
    //     phone: this.editOwner.phone
    //   };
    async define() {
      const defineParams = {
        params: {
          templateUuid: this.editOwner.template.templateUuid,
          name: this.editOwner.name,
          email: this.editOwner.email,
          phone: this.editOwner.phone
        },
        workCenterUuid: this.editOwner.workCenterUuid,
        uuid: this.editOwner.uuid
      };
      await this.$store.dispatch("getEditOwner", defineParams);
      this.$router.push("/workcenter/responsible");
    }
    // workcenter
    //   .editOwner(this.editOwner.workCenterUuid, this.editOwner.uuid, params)
    //   .then(res => {

    //     // this.setEditOwner(res.data.data);
    //   })
    // .catch(err => {
    //   throw err;
    // });
    //   }
  },
  computed: {
    ...mapGetters({
      workcenterInfo: "getWorkcenterInfo",
      editOwner: "getEditOwner",
      templateSelect: "getTemplateSelect"
    })
  },
  mounted() {
    const params = {
      params: {
        start: 0,
        limit: 10,
        type: "select"
      },
      workCenterUuid: this.workcenterInfo.uuid
    };
    this.$store.dispatch("getTemplateList", params);
  }
};
</script>
<style scoped lang="scss">
.col {
  display: flex;
  flex-direction: row;
  padding: 5px 100px 5px 50px;
}
.col-btn {
  justify-content: flex-end;
  margin-bottom: 50px;
}
.icon {
  position: absolute;
  right: 20px;
  top: 60px;
}
</style>
