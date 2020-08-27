import { workcenter } from "@/api";
import i18n from "@/i18n";

export const state = {
  workcenterList: [],
  workcenterInfo: {},
  workcenterOwnerList: [],
  // workcenterOwnerInfo: {},
  templateSelect: [],
  templateList: [],
  taskList: [],
  editOwner: {}
};

export const mutations = {
  setWorkcenterList(state, workcenterList) {
    state.workcenterList = workcenterList;
  },
  setWorkCenterInfo(state, workcenterInfo) {
    state.workcenterInfo = workcenterInfo;
  },
  setWorkcenterOwnerList(state, workcenterOwnerList) {
    state.workcenterOwnerList = workcenterOwnerList;
  },
  setTemplateList(state, templateList) {
    state.templateList = templateList;
  },
  setTemplateSelect(state, templateSelect) {
    state.templateSelect = templateSelect;
  },
  setTaskList(state, taskList) {
    state.taskList = taskList;
  },
  setEditOwner(state, editOwner) {
    state.editOwner = editOwner;
  }
};

export const actions = {
  async getWorkcenterList({ commit }, params) {
    let count = 0;
    await workcenter.getWorkcenter(params).then(res => {
      commit("setWorkcenterList", res.data.data.data);
      count = res.data.data.count;
    });
    return count;
  },
  async getWorkcenterInfo({ commit }, uuid) {
    await workcenter.getWorkcenterInfo(uuid).then(res => {
      commit("setWorkCenterInfo", res.data.data);
    });
  },
  async getWorkcenterOwnerList({ commit }, params) {
    let count = 0;
    await workcenter
      .getOwner(params.workCenterUuid, params.params)
      .then(res => {
        commit("setWorkcenterOwnerList", res.data.data.data);
        count = res.data.data.count;
      });
    return count;
  },
  async getTemplateList({ commit }, params) {
    let count = 0;
    await workcenter
      .getTemplateList(params.workCenterUuid, params.params)
      .then(res => {
        commit("setTemplateList", res.data.data.data);
        commit("setTemplateSelect", res.data.data);
        count = res.data.data.count;
      });
    return count;
  },
  async getTaskList({ commit }, params) {
    let count = 0;
    await workcenter
      .getTaskList(params.workCenterUuid, params.params)
      .then(res => {
        const data = res.data.data.data;
        data.map(item => {
          item.startTime = i18n.t(item.startTime);
          item.state = i18n.t(item.state);
        });
        commit("setTaskList", data);
        count = res.data.data.count;
      });
    return count;
  },
  async getEditOwner({ commit }, defineParams) {
    await workcenter
      .editOwner(
        defineParams.workCenterUuid,
        defineParams.uuid,
        defineParams.params
      )
      .then(res => {
        commit("setEditOwner", res.data.data);
      });
  }
};

export const getters = {
  getWorkcenterList(state) {
    return state.workcenterList;
  },
  getWorkcenterInfo(state) {
    return state.workcenterInfo;
  },
  getWorkcenterOwnerList(state) {
    return state.workcenterOwnerList;
  },
  getTemplateList(state) {
    return state.templateList;
  },
  getTemplateSelect(state) {
    return state.templateSelect;
  },
  getTaskList(state) {
    return state.taskList;
  },
  getEditOwner(state) {
    return state.editOwner;
  }
};
