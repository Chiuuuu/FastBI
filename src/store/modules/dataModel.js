const state = {
    modelId: -1 // 选中的菜单id
}

const mutations = {
    SET_MODELID(state, id) {
        state.modelId = id
    }
}

const actions = {
    setModelId({ commit }, id) {
        commit('SET_MODELID', id)
    }
}

export default {
    namespaced: true, // 用于在全局引用此文里的方法时标识这一个的文件名
    state,
    mutations,
    actions
}
