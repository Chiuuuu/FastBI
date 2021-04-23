import router from '../../router'
import screenManage from '../../api/modules/screenManage'
import { message } from 'ant-design-vue'
import { Loading } from 'element-ui'
import { handleRefreshData } from '@/utils/handleRefreshData'
import { messages } from 'bin-ui'
import guangzhou from '@/utils/guangdong.json'

let orginPageSettings = {
  width: 1920,
  height: 1080,
  backgroundColor: '#0d2a42',
  gridStep: 1,
  backgroundSrc: '',
  backgroundType: '1',
  opacity: 1,
  refresh: { frequency: '', isRefresh: false }
}
const app = {
  state: {
    orginPageSettings,
    pageSettings: orginPageSettings,
    // 状态数据
    canvasRange: 0.65, // 画布缩放
    optionsExpand: true, // 参数面板打开关闭
    modelExpand: true, // 8-14数据模型面板
    coverageExpand: false, // 图层面板打开关闭
    isScreen: false, // 是否全屏
    screenId: '', // 大屏id
    fileName: '',
    parentId: '', // 大屏父id
    screenDataModels: [],
    pageList: [],
    currentPageId: '',
    isPublish: '' // 大屏是否已发布
  },
  mutations: {
    SET_CANVAS_RANGE: (state, val) => {
      state.canvasRange = val
    },
    SET_OPTIONS_EXPAND: state => {
      state.optionsExpand = !state.optionsExpand
    },
    SET_MODEL_EXPAND: state => {
      state.modelExpand = !state.modelExpand
    },
    SET_COVERAGE_EXPAND: state => {
      state.coverageExpand = !state.coverageExpand
    },
    SET_PAGE_SETTING: (state, setting) => {
      console.log(setting)
      state.pageSettings = { ...setting }
    },
    SET_IS_SCREEN: (state, val) => {
      state.isScreen = val
    },
    SET_SCREEN_ID(state, res) {
      console.log('screenId', res)
      state.screenId = res
    },
    SET_FILE_NAME(state, val) {
      state.fileName = val
    },
    SET_PARENT_ID(state, id) {
      state.parentId = id
    },
    SET_PAGE_LIST(state, pages) {
      state.pageList = pages
    },
    SET_PAGE_ID(state, page) {
      state.currentPageId = page
    },
    SET_IS_PUBLISH(state, isPublish) {
      state.isPublish = isPublish
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
    SetPageList({ commit }, pages) {
      commit('SET_PAGE_LIST', pages)
    },
    SetPageId({ commit }, page) {
      commit('SET_PAGE_ID', page)
    },
    SetIsPublish({ commit }, isPublish) {
      commit('SET_IS_PUBLISH', isPublish)
    },
    // 新建大屏
    async addScreenData({ commit, state }, obj) {
      let params = {
        name: obj && obj.name ? obj.name : router.history.current.query.name,
        // parentId: obj && obj.parentId ? obj.parentId : router.history.current.query.parentId,
        // 没有选目录默认在外面
        parentId: obj && obj.parentId ? obj.parentId : '0',
        isSaved: 1,
        setting: state.orginPageSettings // 新建传默认配置
      }
      screenManage
        .addScreen(params)
        .then(res => {
          if (res.code === 200) {
            commit('SET_PAGE_SETTING', state.orginPageSettings)
            commit('SET_PAGE_LIST', [])
            commit('SET_SCREEN_ID', res.id)
            res.msg && message.success(res.msg)
            router.push({
              name: 'screenEdit',
              query: { id: res.id }
            })
          } else {
            res.msg && message.error(res.msg)
            return false
          }
        })
        .catch(err => {
          // 捕获错误
          err && message.error(err)
        })
    },
    // 保存大屏页面设置
    async saveScreenData({ rootGetters, state }, obj) {
      let params = {}
      // 重命名
      if (obj) {
        let { id, name, setting } = obj
        params.id = id
        params.newName = name
        params.setting = setting
      } else {
        // 普通保存
        // 保存图层排序列表，图层操作，新增，删除顺序会变，所以这三个操作要调这个接口
        state.pageSettings.idList = rootGetters.canvasMapIdList

        params.id = state.screenId
        params.setting = state.pageSettings
      }
      return screenManage
        .saveScreen(params)
        .then(res => {
          if (res.code === 200) {
            // res.msg && message.success(res.msg)
            return true
          }
          res.msg && message.error(res.msg)
        })
        .catch(err => {
          // 需要捕获错误 否则无法传递给commit
          err && message.error(err)
        })
    },
    // 新增图表
    async addChartData({ dispatch, state }, obj) {
      // 地图去掉mapOrgin，减少数据
      if (obj.setting.name === 've-map') {
        obj.setting.apis.mapOrigin = ''
      }
      // 素材库不需要config
      let name = obj.setting.config
        ? obj.setting.config.title.content
        : obj.setting.name
      let params = {
        tabId: obj.tabId,
        name: name || '文本',
        screenId: state.screenId,
        datamodelId: obj.datamodelId || 0, // 复制的图表存在模型，先判断有没有模型
        isPublish: 1,
        setting: obj.setting
      }

      return screenManage
        .addChart(params)
        .then(res => {
          if (res.code === 200) {
            // res.msg && message.success(res.msg)
            // 地图类型还原json
            if (res.data.setting.name === 've-map') {
              res.data.setting.apis.mapOrigin = guangzhou
            } else {
            }

            dispatch('AddCanvasMap', res.data)
            // 保存图层顺序
            dispatch('saveScreenData')
            return true
          } else {
            res.msg && message.error(res.msg)
            return false
          }
        })
        .catch(err => {
          // 需要捕获错误 否则无法传递给commit
          err && message.error(err)
        })
    },
    // 删除图表
    async deleteChartData({ dispatch, state, rootGetters }) {
      let chart = rootGetters.currSelected
      let params = {
        id: chart.id,
        name: chart.name,
        screenId: state.screenId,
        datamodelId: chart.datamodelId || 0
      }
      screenManage.deleteChart(params).then(res => {
        if (res.code === 200) {
          dispatch('DelCanvasMap', chart.id)
          // 如果有当前图表联动关系的要清除
          let updateList = []
          rootGetters.canvasMap.forEach(chart => {
            let apiData = chart.setting.api_data
            if (
              apiData.interactive &&
              apiData.interactive.beBinded === rootGetters.currentSelected
            ) {
              apiData.interactive.beBinded = ''
              updateList.push(chart)
            }
          })
          if (updateList.length > 0) {
            screenManage.saveAllChart(updateList)
          }
          dispatch('dataModel/setSelectedModelList', res.data)
          dispatch('SingleSelected', null)
          dispatch('HideContextMenu')
          // 保存图层顺序
          dispatch('saveScreenData')
          message.success('删除成功')
        }
      })
    },
    // 保存图表
    async updateChartData({ state, rootGetters }) {
      let chart = rootGetters.currSelected
      // 图表联动数据selectData不保存后台
      delete chart.setting.api_data.selectData

      let params = {
        id: chart.id,
        name: chart.name,
        screenId: state.screenId,
        datamodelId: chart.datamodelId || 0,
        isPublish: 1,
        setting: chart.setting
      }
      return screenManage.updateChart(params)
    },
    // 获取大屏详情
    async getScreenDetail({ dispatch, commit }, { id, tabId, needRefresh }) {
      return screenManage.getScreenDetailById(id, tabId).then(res => {
        if (res.code === 200) {
          this.screenData = res.data
          dispatch('SetFileName', res.data ? res.data.name : '')
          dispatch('SetPageSettings', res.data ? res.data.setting : {})
          // 地图加上json
          let graphs = res.data ? res.data.screenGraphs : []
          dispatch('InitCanvasMaps', {
            maps: graphs,
            idList: res.data ? res.data.setting.idList : []
          })
          dispatch('dataModel/setSelectedModelList', res.list)
          commit('common/SET_PRIVILEGES', res.data.privileges || [])
          commit('SET_IS_PUBLISH', res.data.isPublish)
          if (needRefresh) {
            return dispatch('refreshScreen', {
              charSeted: false,
              needLoading: false
            })
          }
          return true
        }
      })
    },
    // 刷新大屏
    async refreshScreen({ state, rootGetters }, { charSeted, needLoading }) {
      // 有loading的是手动刷新，refreshCache设为true
      let params = {
        tabId: state.currentPageId,
        refreshCache: needLoading
      }
      let loadingInstance = null
      if (needLoading) {
        loadingInstance = Loading.service({
          lock: true,
          text: '加载中...',
          target: document.querySelector('.screen-manage')
        })
      }
      return screenManage
        .actionRefreshScreen({ params })
        .then(res => {
          if (res.code === 200) {
            let dataItem = res.data
            let ids = Object.keys(dataItem)
            if (ids.length === 0) {
              return true
            }
            for (let id of ids) {
              // 图表设置刷新只刷新对应的图表
              if (charSeted && charSeted !== id) {
                continue
              }
              let chart = rootGetters.canvasMap.find(
                chart => chart.id + '' === id
              )
              // 素材库不需要数据
              if (chart.name === 'material') {
                continue
              }
              let newData = dataItem[id].graphData

              // 找到chart的表示当前页
              if (chart) {
                // 图表模型被删掉
                if (dataItem[id] === 'IsChanged') {
                  chart.setting.isEmpty = true
                  continue
                }
                chart.setting.isEmpty = false
                // 更新界面
                handleRefreshData({ chart, newData })
              }
            }
            screenManage.saveAllChart(rootGetters.canvasMap)
            if (needLoading) {
              message.success('刷新成功')
            }
            return true
          } else {
            res.msg && message.error(res.msg)
          }
        })
        .finally(() => {
          if (needLoading) {
            loadingInstance.close()
          }
        })
    }
  }
}

export default app
