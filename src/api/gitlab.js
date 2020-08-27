import appserver from "./appserve";

const API_URL = "/gitlab";

export default {
  async getWarehousing(params) {
    return await appserver.get(`${API_URL}/projects`, { params });
  },
  async getBranches(projectId, params) {
    return await appserver.get(`${API_URL}/branches/${projectId}`, { params });
  }
};
