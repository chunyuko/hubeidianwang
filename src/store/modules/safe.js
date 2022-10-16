import { getPages, maxItem, minItem } from "@/core/utils";
import api from "@/libs/api";

const safe = {
  state: {
    result: {},
    length: 0,
  },

  mutations: {
    set_safe: (state, res) => {
      let len = res.data.length,
        pageSize = res.pageSize,
        pageNo = res.pageNo,
        success = res.success,
        msg = res.msg;
      state.result = {
        data: res.data,
        totalCount: len,
        totalPage: getPages(len, pageSize),
        pageNo,
        pageSize,
        msg,
        success,
      };
    },
    set_length: (state, val) => {
      state.length = Object.keys(val).length;
    },
  },

  actions: {
    load_safe({ state, commit, getters, dispatch }, params) {
      return api.safe
        .list()
        .then((res) => {
          commit("set_safe", Object.assign(res, params));
          return state.result;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    reload_safe({ state, commit, getters, dispatch }, params) {
      return dispatch("load_safe", params);
    },
    // 获取信息列表
    list_safe({ state, commit, getters, dispatch }, params) {
      let res = state.result.data
        ? new Promise((resolve, reject) => {
            return resolve(state.result);
          })
        : dispatch("load_safe", params);
      return res.then((data) => {
        return new Promise((resolve, reject) => {
          setTimeout(function () {
            return resolve(Object.assign(data, params));
          }, 200);
        }).then((res) => {
          return Promise.resolve(res);
        });
      });
    },
    add_safe({ state, commit, getters, dispatch }, params) {
      return api.safe
        .add({ data: params })
        .then((res) => {
          commit("set_safe", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    update_safe({ state, commit, getters, dispatch }, params) {
      return api.safe
        .edit({ data: params })
        .then((res) => {
          commit("set_safe", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_safe({ state, commit, getters, dispatch }, params) {
      return api.safe
        .del({ data: params })
        .then((res) => {
          commit("set_safe", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_multi_safe({ state, commit, getters, dispatch }, params) {
      return api.safe
        .del_multi({ data: params })
        .then((res) => {
          commit("set_safe", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
  },
};

export default safe;
