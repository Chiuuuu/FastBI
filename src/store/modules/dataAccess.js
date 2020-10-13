import dataAccessApi from '../../api/modules/common'
const state = {
  modelType: '', // 数据类型
  firstFinished: false, // 数据接入信息是否填写完成
  modelInfo: {}, // 数据源信息
  modelId: 0, // 选中的菜单id
  menuList: [], // 左边菜单列表
  parentId: 0, // 文件夹id
  databaseid: 0, // 选择的默认表id
  modelSelectType: '', // new: 新添加 add: 右键添加
  readRows: [] // 读表数据
}

const mutations = {
  SET_MODELINFO(state, info) {
    state.modelInfo = info
  },
  SET_MODELID(state, id) {
    state.modelId = id
  },
  SET_MODELTYPE(state, type) {
    state.modelType = type
  },
  SET_FIRSTFINISHED(state, status) {
    state.firstFinished = status
  },
  SET_MENULIST(state, list) {
    state.menuList = [].concat(list)
  },
  SET_READROWS(state, list) {
    state.readRows = [].concat(list)
  },
  SET_MODELSELECTTYPE(state, type) {
    state.modelSelectType = type
  },
  SET_PARENTID(state, id) {
    state.parentId = id
  }
}

const actions = {
  async getMenuList({
    commit
  }, vm) {
    const result = await dataAccessApi.getMenuList('/datasource/catalog/list/1')
    if (result.code === 200) {
      commit('SET_MENULIST', result.rows)
    } else {
      vm.$message.error(result.msg)
    }
  },
  setModelInfo({
    commit
  }, info) {
    commit('SET_MODELINFO', info)
  },
  setModelId({
    commit
  }, id) {
    commit('SET_MODELID', id)
  },
  setParentId({
    commit
  }, id) {
    commit('SET_PARENTID', id)
  },
  setModelType({
    commit
  }, type) {
    commit('SET_MODELTYPE', type)
  },
  setFirstFinished({
    commit
  }, status) {
    commit('SET_FIRSTFINISHED', status)
  },
  setModelSelectType({
    commit
  }, type) {
    commit('SET_MODELSELECTTYPE', type)
  },
  setReadRows({
    commit
  }, list) {
    commit('SET_READROWS', list)
  }
}

export default {
  namespaced: true, // 用于在全局引用此文里的方法时标识这一个的文件名
  state,
  mutations,
  actions
}
