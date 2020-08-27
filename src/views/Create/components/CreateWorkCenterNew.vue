<template>
  <div>
    <br />
    <v-form ref="form" v-model="valid" lazy-validation>
      <t-input text="workCenterName" v-model="workcenter.name"></t-input>
      <t-input text="location" v-model="workcenter.region"></t-input>
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
      {{ $t("createErr") }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { workcenter } from "@/api";
export default {
  data() {
    return {
      workcenter: {
        name: "",
        region: ""
      },
      snackbar: false,
      valid: true
    };
  },
  methods: {
    async define() {
      if (this.$refs.form.validate()) {
        await workcenter
          .createWorkcenter(this.workcenter)
          .then(() => {
            this.$router.push("/workcenter");
          })
          .catch(err => {
            this.snackbar = true;
            throw err;
          });
      }
    }
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
