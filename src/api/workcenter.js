import appserver from "./appserve";

const API_URL = "/workcenter";

export default {
  async getWorkcenter(params) {
    return await appserver.get(`${API_URL}`, { params });
  },
  async getWorkcenterInfo(uuid) {
    return await appserver.get(`${API_URL}/${uuid}`);
  },
  async createWorkcenter(params) {
    return await appserver.post(`${API_URL}`, params);
  },
  async editWorkcenter(uuid, params) {
    return await appserver.put(`${API_URL}/${uuid}`, params);
  },
  async deleteWorkcenter(uuid) {
    return await appserver.delete(`${API_URL}/${uuid}`);
  },
  async getOwner(workCenterUuid, params) {
    return await appserver.get(`${API_URL}/${workCenterUuid}/productOwner`, {
      params
    });
  },
  async createOwner(workCenerUuid, params) {
    return await appserver.post(
      `${API_URL}/${workCenerUuid}/productOwner`,
      params
    );
  },
  async deleteOwner(workCenterUuid, uuid) {
    return await appserver.delete(
      `${API_URL}/${workCenterUuid}/productOwner/${uuid}`
    );
  },
  async editOwner(workCenterUuid, uuid, params) {
    return await appserver.put(
      `${API_URL}/${workCenterUuid}/productOwner/${uuid}`,
      params
    );
  },
  async getTemplateList(workCenterUuid, params) {
    return await appserver.get(`${API_URL}/${workCenterUuid}/template`, {
      params
    });
  },
  async deleteTemplateList(workCenterUuid, templateUuid) {
    return await appserver.delete(
      `${API_URL}/${workCenterUuid}/template/${templateUuid}`
    );
  },
  async createTemplateList(workCenterUuid, templateUuid) {
    return await appserver.post(`${API_URL}/${workCenterUuid}/template`, {
      templateUuid
    });
  },
  async getTaskList(workCenterUuid, params) {
    return await appserver.get(`${API_URL}/${workCenterUuid}/updateRecord`, {
      params
    });
  }
};
