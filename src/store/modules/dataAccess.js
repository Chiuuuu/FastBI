const state = {
    modelType:'',// 数据类型
    firstFinished: false, // 数据连接信息是否填写完成
    modelInfo: null, // 数据表信息
}

const mutations = {
    SET_MODELTYPE(state, type) {
        state.modelType = type
    },
    SET_FIRSTFINISHED(state, status){
        state.firstFinished = status
    },
}

const actions = {
    setModelType({ commit }, type) {
        commit('SET_MODELTYPE', type)
    },
    setFirstFinished({commit}, status){
        commit('SET_FIRSTFINISHED', status)
    }
}

export default {
    namespaced: true, // 用于在全局引用此文里的方法时标识这一个的文件名
    state,
    mutations,
    actions
}