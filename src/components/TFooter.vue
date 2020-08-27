<template>
  <div style="background-color: #FFFFFF;">
    <div style="height: 10px; background-color: #EEEEEE;"></div>
    <v-layout
      id="header"
      :style="{ 'border-color': show ? '#81D4FA' : '#e0e0e0' }"
    >
      <v-flex class="header-title">{{ title }}</v-flex>
      <v-flex class="header-action">
        <slot name="actions"></slot>
      </v-flex>
      <v-flex
        class="header-chevron"
        :style="{ 'border-color': show ? '#81D4FA' : '#e0e0e0' }"
      >
        <v-btn v-show="editShow" tile icon color="#757575" @click="control">
          <v-icon>{{ show ? "mdi-chevron-down" : "mdi-chevron-up" }}</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-expand-transition>
      <v-layout
        id="content"
        v-show="show"
        :style="{ 'border-color': show ? '#81D4FA' : '#e0e0e0' }"
      >
        <slot name="info"></slot>
      </v-layout>
    </v-expand-transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    title: {
      type: String
    }
  },
  computed: {
    ...mapGetters({ show: "getFooterShow", editShow: "getEditShow" })
  },
  methods: {
    ...mapActions(["setFooterShow", "setEditShow"]),
    control() {
      this.setFooterShow();
      if (!this.show) {
        this.setEditShow();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$bg_color: #eeeeee;

%border_style {
  border-style: solid;
  border-width: 2px;
}

#header {
  height: 40px;
  @extend %border_style;

  .header-title {
    width: 70%;
    line-height: 37px;
    margin-left: 15px;
    color: #4a90e2;
    font-size: 14px;
    font-weight: 500;
  }
  .header-action {
    width: 30%;
    text-align: right;
  }
  .header-chevron {
    height: 100%;
    background-color: $bg_color;
    border-left-style: solid;
    border-width: 2px;
  }
}
#content {
  height: 26vh;
  border-top-style: none;
  overflow: auto;
  @extend %border_style;
}
</style>
