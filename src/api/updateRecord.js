import appserver from "./appserve";

const API_URL = "/updaterecord";

export default {
  async getUpdateRecord(params) {
    return await appserver.get(`${API_URL}`, { params });
  },
  async createUpdateRecord(params) {
    return await appserver.post(`${API_URL}`, params);
  },
  async getUpdateRecordUuid(uuid) {
    return await appserver.get(`${API_URL}/${uuid}`);
  }
};
