import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import vuetify from "./plugins/vuetify";
import auth from "./directives/auth";
import ResSplitPane from "vue-resize-split-pane";

import "@/components";
import "@/layout";

Vue.use(auth);
Vue.component("rs-panes", ResSplitPane);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
