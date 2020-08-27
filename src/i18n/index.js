import VueI18n from "vue-i18n";
import Vue from "vue";
import cn from "./cn-lang";

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "cn", // set locale
  messages: { cn }
});

export default i18n;
