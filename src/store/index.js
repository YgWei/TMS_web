import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";

Vue.use(Vuex);

export default new Vuex.Store({
  state: { footerShow: false, editShow: false },
  mutations: {
    setFooterShow(state) {
      state.footerShow = !state.footerShow;
    },
    setEditShow(state) {
      state.editShow = !state.editShow;
    }
  },
  actions: {
    setFooterShow({ commit }) {
      commit("setFooterShow");
    },
    setEditShow({ commit }) {
      commit("setEditShow");
    }
  },
  getters: {
    getFooterShow(state) {
      return state.footerShow;
    },
    getEditShow(state) {
      return state.editShow;
    }
  },
  modules
});
