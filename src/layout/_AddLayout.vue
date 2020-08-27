<template>
  <v-container id="container">
    <div>
      <v-btn icon class="icon" @click="goBack()">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </div>
    <div id="list-body">
      <slot></slot>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    goBack() {
      if (
        this.$route.path == "/workcenter/responsible" ||
        this.$route.path == "/workcenter/templateList"
      ) {
        this.$router.push("/workcenter");
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#container {
  max-width: 100%;
}
.icon {
  position: absolute;
  right: 20px;
  top: 60px;
}
.v-btn:focus::before {
  display: none;
}
.v-btn:hover::before {
  display: none;
}
</style>
