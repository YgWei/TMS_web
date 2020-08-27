import appserver from "./appserve";

const API_URL = "/template";

export default {
  async getTemplate(params) {
    return await appserver.get(`${API_URL}`, { params });
  },
  async getTemplateUuid(uuid) {
    return await appserver.get(`${API_URL}/${uuid}`);
  },
  async editTemplate(uuid, params) {
    return await appserver.put(`${API_URL}/${uuid}`, params);
  },
  async TemplateDefine(params) {
    return await appserver.post(`${API_URL}`, params);
  },
  async deleteTemplate(uuid) {
    return await appserver.delete(`${API_URL}/${uuid}`);
  },
  async getWorkcenterByTemplateUuid(uuid, params) {
    return await appserver.get(`${API_URL}/${uuid}/workcenter`, { params });
  }
};
