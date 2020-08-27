import login from "./login";
import company from "./company";
import appserve from "./appserve.js";
import release from "./release.js";
import data from "./data";
import template from "./template.js";
import workcenter from "./workcenter.js";
import deployment from "./deployment.js";
import user from "./user.js";
import gitlab from "./gitlab.js";
import review from "./review.js";
import updateRecord from "./updateRecord.js";

appserve.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export {
  login,
  company,
  data,
  release,
  template,
  workcenter,
  deployment,
  user,
  gitlab,
  review,
  updateRecord
};
