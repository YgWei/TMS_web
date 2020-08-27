<template>
  <div v-show="keyValue.uuid && footerShow">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn fab small icon v-on="on" @click="$emit('showResponsible')">
          <v-icon>mdi-account-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("responsible") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn fab small icon v-on="on" @click="$emit('showList')">
          <v-icon>mdi-format-list-text</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("templateList") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn @click="$emit('showTask')" fab small icon v-on="on">
          <v-icon>mdi-update</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("updateTask") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn @click="$emit('edit')" fab small icon v-on="on">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("edit") }}</span>
    </v-tooltip>
    <!-- <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn @click="$emit('delete')" fab small icon v-on="on">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("delete") }}</span>
    </v-tooltip>-->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    keyValue: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({ footerShow: "getFooterShow" })
  }
};
</script>
<style lang="scss" scoped>
.v-btn:focus::before {
  display: none;
}
.v-btn:hover::before {
  display: none;
}
</style>
