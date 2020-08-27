import { login, user } from "@/api";
export const state = {
  token: null,
  user: {}
};

export const mutations = {
  TOKEN(state, token) {
    state.token = token;
  },
  USER(state, user) {
    state.user = user;
  }
};

export const actions = {
  async Login({ commit }, params) {
    try {
      const response = await login.login(params);
      commit("TOKEN", response.data.data.jwt);
      return response;
    } catch (err) {
      throw err;
    }
  },
  async userInfo({ commit }) {
    try {
      const response = await user.getUserInfo();
      commit("USER", response.data.data);
    } catch (err) {
      throw err;
    }
  }
};

export const getters = {
  getToken(state) {
    return state.token;
  },
  getRoles(state) {
    return state.user.roles;
  },
  getReviewUser(state) {
    return { uuid: state.user.uuid, name: state.user.name };
  }
};
