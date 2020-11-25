import { getPermissionByTree } from '@/utils/permission'
import router, { resetRouter } from '@/router'

const state = {
    routesModule: [],
    objectModule: ''
}

const mutations = {
  SET_ROUTES_MODULE: (state, roleTree) => {
    state.routesModule = getPermissionByTree(roleTree, 'module')
  },
  SET_OBJECT_MODULE: (state, roleTree) => {
    state.objectModule = getPermissionByTree(roleTree, 'page')
  },
  CLEAR_PERMISSIONS: (state) => {
    state.routesModule = []
    state.objectModule = ''
    resetRouter()
  }
}

const actions = {
  setRoutesModule({ commit }, roles) {
    return new Promise(resolve => {
      commit('SET_ROUTES_MODULE', roles)
      resolve()
    })
  },
  setObjectModule({ commit }, roles) {
    return new Promise(resolve => {
      commit('SET_OBJECT_MODULE', roles)
      resolve()
    })
  },
  getInfo({ commit }) {
    return new Promise(resolve => {
      const roleTree = {
        module: [0],
        page: {
          0: [1],
          1: [1, 3]
        }
      }

      commit('SET_ROUTES_MODULE', roleTree)
      commit('SET_OBJECT_MODULE', roleTree)
      resolve(state)
    })
  },
  changeRole({ commit, dispatch }) {
    return new Promise(async resolve => {
      const roleTree = {
        module: [1, 2],
        page: {
          0: [1],
          1: [1]
        }
      }
      // const { roles } = await dispatch('getInfo')

      commit('SET_ROUTES_MODULE', roleTree)
      commit('SET_OBJECT_MODULE', roleTree)

      resetRouter()
      const accessRoutes = await dispatch('permission/generateRoutes', state.routesModule, { root: true })
      router.addRoutes(accessRoutes)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
