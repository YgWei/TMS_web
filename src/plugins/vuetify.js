import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        error: "#FF5252",
        cancel: "#ED553B"
      }
    }
  },
  icons: {
    iconfont: "mdi"
  }
});
