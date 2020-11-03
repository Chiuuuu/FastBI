import router from '../../router'
import screenManage from '../../api/modules/screenManage'
import { message } from 'ant-design-vue'

const app = {
    state: {
        pageSettings: { width: 1920, height: 1080, backgroundColor: '#0d2a42', gridStep: 1, backgroundSrc: '', backgroundType: '1', opacity: 1 },
        // 状态数据
        canvasRange: 0, // 画布缩放
        optionsExpand: true, // 参数面板打开关闭
        modelExpand: true, // 8-14数据模型面板
        coverageExpand: false, // 图层面板打开关闭
        isScreen: false, // 是否全屏
        screenId: '', // 大屏id
        fileName: '',
        parentId: '', // 大屏父id
        screenDataModels: []
    },
    mutations: {
        SET_CANVAS_RANGE: (state, val) => {
            state.canvasRange = val
        },
        SET_OPTIONS_EXPAND: (state) => {
            state.optionsExpand = !state.optionsExpand
        },
        SET_MODEL_EXPAND: (state) => {
            state.modelExpand = !state.modelExpand
        },
        SET_COVERAGE_EXPAND: (state) => {
          state.coverageExpand = !state.coverageExpand
      },
        SET_PAGE_SETTING: (state, setting) => {
          console.log(setting)
            state.pageSettings = { ...setting }
        },
        SET_IS_SCREEN: (state, val) => {
            state.isScreen = val
        },
        SET_SCREEN_ID (state, res) {
          state.screenId = res
        },
        SET_FILE_NAME(state, val) {
          state.fileName = val
        },
        SET_PARENT_ID(state, id) {
          state.parentId = id
        }
    },
    actions: {
        SetCanvasRange: ({ commit }, val) => {
            commit('SET_CANVAS_RANGE', val)
        },
        ToggleOptionsExpand: ({ commit }) => {
            commit('SET_OPTIONS_EXPAND')
        },
        ToggleModelExpand: ({ commit }) => {
            commit('SET_MODEL_EXPAND')
        },
        ToggleCoverageExpand: ({ commit }) => {
          commit('SET_COVERAGE_EXPAND')
      },
        SetPageSettings: ({ commit }, setting) => {
            commit('SET_PAGE_SETTING', setting)
        },
        SetIsScreen: ({ commit }, val) => {
            commit('SET_IS_SCREEN', val)
        },
        SetScreenId: ({ commit }, val) => {
          commit('SET_SCREEN_ID', val)
        },
        SetFileName({ commit }, val) {
          commit('SET_FILE_NAME', val)
        },
        SetParentId({ commit }, id) {
          commit('SET_PARENT_ID', id)
        },
        // 保存大屏
        async saveScreenData ({ commit, state, rootGetters }, obj) {
          // const { commit, state, rootGetters } = store
          const setting = {
            setting: state.pageSettings,
            components: rootGetters.canvasMap,
            screenDataModels: state.screenDataModels.push(rootGetters.dataModel)
          }
          let params = {}
          if (!state.screenId) {
            commit('SET_PAGE_SETTING', { width: 1920, height: 1080, backgroundColor: '#0d2a42', gridStep: 1, backgroundSrc: '', backgroundType: '1', opacity: 1, refresh: { frequency: '', isRefresh: false } })
            params = {
              id: -1,
              name: obj && obj.name ? obj.name : router.history.current.query.name,
              parentId: obj && obj.parentId ? obj.parentId : router.history.current.query.parentId,
              isSaved: 1,
              setting: {
                setting: state.pageSettings,
                components: {}
              }
            }
          } else {
            params.id = state.screenId
            params.setting = setting
          }
          screenManage.saveScreen(params).then((res) => {
            if (res.code === 200) {
              commit('SET_SCREEN_ID', res.id)
              if (obj && obj.mes) {
                message.success(obj.mes)
              }
              if (obj && obj.isAdd === 1) {
                router.push({
                  name: 'screenEdit',
                  query: {
                    ...obj
                  }
                })
              }
            } else {
              message.error(res.msg)
              return false
            }
            // if (obj.callback) {
            //   console.log(123)
            //   obj.callback()
            // }
          }).catch((err) => { // 需要捕获错误 否则无法传递给commit
            message.error(err)
            commit('SET_SCREEN_ID', '')
          })
        }
    }
}

export default app
