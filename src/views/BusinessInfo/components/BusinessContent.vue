<template>
  <div>
    <t-content-template
      v-for="(item, key, index) in items"
      :title="key"
      :value="item"
      :key="index"
    ></t-content-template>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: {
    keyValue: Object
  },
  computed: {
    items() {
      let obj = {
        saleData: this.keyValue.name,
        dataUuid: this.keyValue.uuid,
        creationDay: moment(this.keyValue.createTime).format(
          "YYYY/MM/DD - kk:mm"
        ),
        founder: this.keyValue.createUser,
        description: this.keyValue.description
      };

      return obj;
    }
  }
};
</script>
