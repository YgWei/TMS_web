import appserver from "./appserve";

const API_URL = "/company";

export default {
  async getCompany(params) {
    return await appserver.get(`${API_URL}`, {
      params
    });
  },
  async getProduction(companyUuid, params) {
    return await appserver.get(`${API_URL}/${companyUuid}/production`, {
      params
    });
  }
};
