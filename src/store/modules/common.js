import loginApi from '../../api/modules/login'

const tokenInfo = JSON.parse(window.localStorage.getItem('tokenInfo'))
const state = {
    sidebarUnfold: false, // 侧边栏是否收起(true收起，false展开)
    navMenuActive: '1-1', // 导航菜单高亮
    adminToken: tokenInfo ? tokenInfo.token : '', //
    expires: tokenInfo ? tokenInfo.expires : '',
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
    SET_TOKEN(state, token) {
        state.adminToken = token
    },

    // 设置用户名
    set_username(state, data) {
      state.username = data
    },

    // 设置下次token过期时间 30分钟过期
    set_expires(state, expires) {
        state.expires = expires
    }
}

const actions = {
    get_token(state, data) {
        loginApi.actionLogin(data)
            .then(res => {
                state.dispatch('set_token', res.data.token)
            })
    },
    set_token(state, token) {
        const expires = +new Date() + 30 * 60 * 1000
        state.commit('set_expires', expires)
        state.commit('SET_TOKEN', token)
        window.localStorage.setItem('tokenInfo', JSON.stringify({ token: token, expires: expires }))
    }
}

export default {
    namespaced: true, // 用于在全局引用此文里的方法时标识这一个的文件名
    state,
    mutations,
    actions
}
