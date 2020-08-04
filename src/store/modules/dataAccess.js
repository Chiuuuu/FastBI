const state = {
    selectAccess: 2
}

const mutations = {
    // 当前x选中的数据
    set_selectAccess(state, data) {
        state.selectAccess = data
    }
}

const actions = {}

export default {
    namespaced: true, // 用于在全局引用此文里的方法时标识这一个的文件名
    state,
    mutations,
    actions
}