import { getPages, maxItem, minItem } from "@/core/utils";
import api from "@/libs/api";

const develop = {
  state: {
    result: {},
    length: 0,
  },

  mutations: {
    set_develop: (state, res) => {
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
    load_develop({ state, commit, getters, dispatch }, params) {
      return api.develop
        .list({ params: { tenDatas: params.tenDatas } })
        .then((res) => {
          commit("set_develop", Object.assign(res, params));
          return state.result;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    reload_develop({ state, commit, getters, dispatch }, params) {
      return dispatch("load_develop", params);
    },
    // 获取信息列表
    list_develop({ state, commit, getters, dispatch }, params) {
      let res = dispatch("load_develop", params);
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
    add_develop({ state, commit, getters, dispatch }, params) {
      return api.develop
        .add({ data: params })
        .then((res) => {
          commit("set_develop", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    update_develop({ state, commit, getters, dispatch }, params) {
      return api.develop
        .edit({ data: params })
        .then((res) => {
          commit("set_develop", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_develop({ state, commit, getters, dispatch }, params) {
      return api.develop
        .del({ data: params })
        .then((res) => {
          commit("set_develop", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    del_multi_develop({ state, commit, getters, dispatch }, params) {
      return api.develop
        .del_multi({ data: params })
        .then((res) => {
          commit("set_develop", Object.assign(res, { pageNo: params.pageNo, pageSize: params.pageSize }));
          return res;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
  },
};

export default develop;
