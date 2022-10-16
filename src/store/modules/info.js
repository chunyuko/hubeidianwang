import { getPages, maxItem, minItem } from "@/core/utils";
import api from "@/libs/api";

const info = {
  state: {
    result: {},
    length: 0,
  },

  mutations: {
    set_info: (state, res) => {
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
    load_info({ state, commit, getters, dispatch }, params) {
      return api.info
        .list({ params: { tenDatas: params.tenDatas } })
        .then((res) => {
          commit("set_info", Object.assign(res, params));
          return state.result;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    reload_info({ state, commit, getters, dispatch }, params) {
      return dispatch("load_info", params);
    },
    // 获取信息列表
    list_info({ state, commit, getters, dispatch }, params) {
      let res = dispatch("load_info", params);
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
    add_info({ state, commit, getters, dispatch }, params) {
      return api.info
        .add({ data: params })
        .then((res) => {
          commit("set_info", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    update_info({ state, commit, getters, dispatch }, params) {
      return api.info
        .edit({ data: params })
        .then((res) => {
          commit("set_info", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_info({ state, commit, getters, dispatch }, params) {
      return api.info
        .del({ data: params })
        .then((res) => {
          commit("set_info", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_multi_info({ state, commit, getters, dispatch }, params) {
      return api.info
        .del_multi({ data: params })
        .then((res) => {
          commit("set_info", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
  },
};

export default info;
