<template>
  <v-card outlined>
    <v-row no-gutters style="height: 100%">
      <v-col cols="6">
        <v-row no-gutters>
          <v-col class="titleBlock" sm="">
            <p>{{ $t("name") }}</p>
            <p>{{ $t("reviewTime") }}</p>
            <p>{{ $t("reviewResult") }}</p>
          </v-col>
          <v-col sm="9">
            <p>{{ items.name }}</p>
            <p>{{ items.time }}</p>
            <p>{{ items.result }}</p>
          </v-col>
        </v-row>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="5" style="height: 100%">
        <v-row no-gutters style="height: 100%">
          <v-col class="titleBlock" sm="3">
            <p>{{ $t("note") }}</p>
          </v-col>
          <v-col sm="9" style="height: 100%; overflow-y:scroll">
            <p>{{ items.message }}</p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import moment from "moment";
export default {
  props: {
    reviews: {
      type: Object
    }
  },
  computed: {
    items() {
      if (Object.keys(this.reviews).length === 0) return {};
      return {
        name: this.reviews.user.name,
        time: moment(this.reviews.time).format(
          "YYYY/" + "MM/" + "DD" + ", kk:" + "mm"
        ),
        result: this.reviews.result,
        message: this.reviews.message
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.v-card {
  padding: 20px 0px 20px 20px;
  width: 650px;
  height: 150px;
}
p {
  margin: 0px 0px 8px 0px;
  font-size: 14px;
  padding: 5px 0px 0px 20px;
  color: #8e8e93;
  font-weight: 500;
}
.titleBlock {
  min-height: 10px;
  width: 120px;
}
.v-divider {
  border-width: thin 0 0 1 !important;
}
</style>
