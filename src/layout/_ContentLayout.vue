<template>
  <v-container ref="container" id="container">
    <slot name="toBtn"></slot>
    <v-expand-transition>
      <div id="list-body">
        <slot></slot>
      </div>
    </v-expand-transition>
    <t-footer ref="navbar" id="navbar" :title="$t(infoTitle)">
      <div slot="actions">
        <slot name="actions"></slot>
      </div>
      <div slot="info" style="width:100%">
        <slot name="info"></slot>
      </div>
    </t-footer>
  </v-container>
</template>
<script>
export default {
  props: {
    infoTitle: {
      type: String
    }
  },
  data() {
    return {
      bodyHeight: 0
    };
  }
};
</script>

<style lang="scss" scoped>
#container {
  max-width: 100%;
  padding: 0;
  position: absolute;
  flex-direction: column;
  top: 55px;
  bottom: 0px;
  display: flex;
}

#list-body {
  height: 100%;
}

#navbar {
  flex-grow: 1;
  z-index: 6;
  position: absolute;
  bottom: 0px;
  width: 100%;
}
</style>
