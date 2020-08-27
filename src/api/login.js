import appserver from "./appserve";

const API_URL = "/login";

export default {
  async login(params) {
    return await appserver.post(`${API_URL}/system`, params);
  },
  async gitlabLogin(params) {
    return await appserver.post(`${API_URL}/gitlab`, params);
  }
};
