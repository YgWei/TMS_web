import appserver from "./appserve";

const API_URL = "/notify";

export default {
  async getReview(params) {
    return await appserver.get(`${API_URL}/personal`, { params });
  },
  async getReviewByUuid(uuid) {
    return await appserver.get(`${API_URL}/${uuid}`);
  },
  async submitReview(uuid, params) {
    return await appserver.put(`${API_URL}/${uuid}/submit/review`, params);
  },
  async addReviewer(uuid, params) {
    return await appserver.post(`review/${uuid}/reviewGroup`, params);
  }
};
