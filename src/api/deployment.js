import appserver from "./appserve";

const API_URL = "/deployment";

export default {
  async getDeployments(params) {
    return await appserver.get(`${API_URL}`, {
      params
    });
  },
  async getDeployment(uuid, params) {
    return await appserver.get(`${API_URL}/${uuid}`, { params });
  },
  async createDeployment(params) {
    return await appserver.post(`${API_URL}`, params);
  },
  async startDeploying(uuid, params) {
    return await appserver.post(`${API_URL}/${uuid}/deploy`, params);
  },
  async editDeployment(uuid, params) {
    return await appserver.put(`${API_URL}/${uuid}`, params);
  },
  async reviewDeployment(uuid, params) {
    return await appserver.post(`${API_URL}/${uuid}/review`, params);
  },
  async getTag(params) {
    return await appserver.get(`${API_URL}/tag/find`, { params });
  },
  async getRenderResult(uuid) {
    return await appserver.get(`${API_URL}/${uuid}/renderResult`);
  },
  async deleteDeployment(uuid) {
    return await appserver.delete(`${API_URL}/${uuid}`);
  },
  async getReviews(uuid, params) {
    return await appserver.get(`${API_URL}/${uuid}/reviewRecord`, { params });
  },
  async reviewResult(uuid, params) {
    return await appserver.post(`${API_URL}/${uuid}/review/result`, params);
  }
};
