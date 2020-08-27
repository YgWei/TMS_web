import appserver from "./appserve";

const API_URL = "/release";

export default {
  async getRelease(params) {
    return await appserver.get(`${API_URL}`, { params });
  },
  async getReleaseTree(params) {
    return await appserver.get(`${API_URL}/tree`, { params });
  },
  async createRelease(params) {
    return await appserver.post(`${API_URL}`, params);
  }
};
