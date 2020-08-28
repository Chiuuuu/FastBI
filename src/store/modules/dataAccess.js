import { fetchMenuList } from '../../api/dataAccess/api'

const state = {
    modelType: '', // 数据类型
    firstFinished: false, // 数据连接信息是否填写完成
    modelInfo: {}, // 数据表信息
    modelId: -1, // 选中的菜单id
    menuList: [], // 左边菜单列表
    databaseid: -1, // 选择的默认表id
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
    }
}

const actions = {
    async getMenuList({ commit }, vm) {
        const result = await fetchMenuList({
            url: '/zj/dev-api/system/catalog/cataloglist'
        })
        if (result.data.code === 200) {
            commit('SET_MENULIST', result.data.data)
        } else {
            vm.$message.error(result.data.msg)
        }
    },
    setModelInfo({ commit }, info) {
        commit('SET_MODELINFO', info)
    },
    setModelId({ commit }, id) {
        commit('SET_MODELID', id)
    },
    setModelType({ commit }, type) {
        commit('SET_MODELTYPE', type)
    },
    setFirstFinished({ commit }, status) {
        commit('SET_FIRSTFINISHED', status)
    },
    setModelSelectType({ commit }, type) {
        commit('SET_MODELSELECTTYPE', type)
    },
    setReadRows({ commit }, list) {
        commit('SET_READROWS', list)
    }
}

export default {
    namespaced: true, // 用于在全局引用此文里的方法时标识这一个的文件名
    state,
    mutations,
    actions
}
