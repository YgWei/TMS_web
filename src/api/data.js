import appserver from "./appserve";

const API_URL = "/data";

export default {
  async getData(params) {
    return await appserver.get(`${API_URL}`, {
      params
    });
  },
  async getDataValue(uuid) {
    return await appserver.get(`${API_URL}/${uuid}`);
  },
  async deleteData(uuid) {
    return await appserver.delete(`${API_URL}/${uuid}`);
  },
  async editData(uuid, params) {
    return await appserver.put(`${API_URL}/${uuid}`, params);
  },
  async uploadData(params) {
    return await appserver.post(`${API_URL}`, params);
  }
};
