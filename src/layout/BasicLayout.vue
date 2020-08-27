<template>
  <v-app>
    <v-navigation-drawer
      id="nav"
      v-model="drawer"
      :mini-variant.sync="mini"
      app
      clipped
      :class="{ 'nav_box-shadow': drawer }"
    >
      <v-list>
        <v-list-item-group>
          <v-list-item
            v-for="item in items"
            :key="item.path"
            link
            active-class="primary--text"
            :to="item.path == '#' ? '' : item.path"
            @click="menuClickHendler(item.path)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.meta.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title style="font-size:14px;font-weight:500">
                {{ $t(item.meta.title) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <v-btn
          dark
          width="100%"
          min-width="100%"
          height="48px"
          color="#5896fa"
          @click.stop="mini = !mini"
        >
          <v-icon>{{ mini ? "mdi-chevron-right" : "mdi-chevron-left" }}</v-icon>
        </v-btn>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      app
      clipped-left
      style="box-shadow: none;"
      id="appbar"
      height="50"
    >
      <v-spacer></v-spacer>
      <v-btn depressed color="white" class="logoutBtn" @click="dialog = true">
        {{ $t("signOut") }}
      </v-btn>
    </v-app-bar>
    <t-dialog v-model="dialog" checkInfo="checkSignout" uncovery="renewlogin">
      <template v-slot:btn>
        <v-btn @click="dialog = false" outlined color="cancel">
          {{ $t("cancel") }}
        </v-btn>
        <v-btn id="dialogBtn" @click="checkSinout">{{ $t("determine") }}</v-btn>
      </template>
    </t-dialog>
    <v-content>
      <t-breadcrumbs height="50" :historys="historys"></t-breadcrumbs>
      <v-divider></v-divider>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      dialog: false,
      drawer: true,
      items: [],
      historys: [],
      mini: true
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(val) {
        if (val.meta.clickHistorys) this.historys = [];
        let index = this.historys.findIndex(history => {
          return history.text == val.name;
        });
        if (index < 0) {
          this.historys.push({
            text: val.name,
            disabled: false,
            to: val.path
          });
        } else {
          this.historys = this.historys.slice(0, index + 1);
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      footerShow: "getFooterShow"
    })
  },
  methods: {
    ...mapActions(["setFooterShow", "setEditShow"]),
    menuClickHendler(path) {
      if (path != this.$route.path) {
        this.$router.push(path);
      }
      if (this.footerShow) {
        this.setFooterShow();
        this.setEditShow();
      }
    },
    checkSinout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  },

  mounted() {
    let routes = this.$router.options.routes;
    routes.forEach(route => {
      if (route.meta && route.meta.show) {
        this.items.push(route);
      }
    });
  }
};
</script>

<style scoped lang="scss">
.nav_box-shadow {
  box-shadow: 1px 1px 4px 1px #cccccc;
}

#nav ::v-deep .v-navigation-drawer__append {
  text-align: center;
  background-color: #5896fa;
}
#appbar .logoutBtn {
  border: solid #c7c7cc 1px !important;
  color: #4a90e2;
}
#dialogBtn {
  background-color: #2196f3;
  color: white;
  margin-left: 20px;
}
</style>
