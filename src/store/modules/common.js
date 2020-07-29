const state = {
    sidebarUnfold: false, // 侧边栏是否收起(true收起，false展开)
    navMenuActive: '1-1', // 导航菜单高亮
    adminToken: '', //
    username: ''
}

const mutations = {
    // 设置侧边栏展开收起
    set_sidebarUnfold(state, data) {
        state.sidebarUnfold = data
    },

    // 设置导航菜单高亮
    set_navMenuActive(state, data) {
        state.navMenuActive = data
    },

    // 设置token
    set_token(state, data) {
        state.adminToken = data
    },

    // 设置用户名
    set_username(state, data) {
      state.username = data
    }
}

const actions = {}

export default {
    namespaced: true, // 用于在全局引用此文里的方法时标识这一个的文件名
    state,
    mutations,
    actions
}
