<template>
  <div>
    <v-dialog
      width="300"
      :value="dialog"
      @input="$emit('input')"
      :persistent="persistance"
    >
      <v-card>
        <p>{{ $t(checkInfo) }}</p>
        <p class="noticeMessage">{{ $t(uncovery) }}</p>
        <v-card-actions class="btnPosition">
          <slot name="btn"></slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dailog: false
    };
  },
  model: {
    prop: "dialog",
    event: "input"
  },
  props: {
    dialog: {
      type: Boolean
    },
    checkInfo: {
      type: String
    },
    uncovery: {
      type: String
    },
    persistance: {
      type: Boolean,
      default: true
    }
  }
};
</script>
<style lang="scss" scoped>
p {
  text-align: center;
  padding-top: 30px;
  font-size: 20px;
  color: #606060;
  font-weight: 500;
  margin: 0px;
}
.noticeMessage {
  text-align: center;
  font-size: 13px;
  padding-top: 0px;
  color: #b0b0b0;
  padding-top: 10px;
  margin: 0px;
}
.btnPosition {
  justify-content: center;
  padding: 20px;
}
</style>
