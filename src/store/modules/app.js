import router from '../../router'
import screenManage from '../../api/modules/screenManage'
import { message } from 'ant-design-vue'
import { sum, summary } from '@/utils/summaryList'

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
    canvasRange: 0.5, // 画布缩放
    optionsExpand: true, // 参数面板打开关闭
    modelExpand: true, // 8-14数据模型面板
    coverageExpand: false, // 图层面板打开关闭
    isScreen: false, // 是否全屏
    screenId: '', // 大屏id
    fileName: '',
    parentId: '', // 大屏父id
    screenDataModels: [],
    pageList: []
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
    // 新建大屏
    async addScreenData({ commit, state }, obj) {
      commit('SET_PAGE_SETTING', state.orginPageSettings)
      commit('SET_PAGE_LIST', [])
      let params = {
        name: obj && obj.name ? obj.name : router.history.current.query.name,
        // parentId: obj && obj.parentId ? obj.parentId : router.history.current.query.parentId,
        // 没有选目录默认在外面
        parentId: obj && obj.parentId ? obj.parentId : '0',
        isSaved: 1,
        setting: state.pageSettings
      }
      screenManage
        .addScreen(params)
        .then(res => {
          if (res.code === 200) {
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
      }
      // 普通保存
      else {
        // 保存图层排序列表，图层操作，新增，删除顺序会变，所以这三个操作要调这个接口
        state.pageSettings.idList = rootGetters.canvasMapIdList

        params.id = state.screenId
        params.setting = state.pageSettings
      }
      return screenManage
        .saveScreenNew(params)
        .then(res => {
          if (res.code === 200) {
            res.msg && message.success(res.msg)
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
    // 新增图表
    async addChartData({ dispatch, state }, obj) {
      let params = {
        tabId: obj.tabId,
        name: obj.setting.config.title.content || '文本',
        screenId: state.screenId,
        datamodelId: 0,
        isPublish: 1,
        setting: obj.setting
      }
      return screenManage
        .addChart(params)
        .then(res => {
          if (res.code === 200) {
            // res.msg && message.success(res.msg)
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
      let chart = rootGetters.canvasMap.find(
        item => item.id === rootGetters.currentSelected
      )
      let params = {
        id: chart.id,
        name: chart.name,
        screenId: state.screenId,
        datamodelId: chart.datamodelId || 0
      }
      screenManage.deleteChart(params).then(res => {
        dispatch('DelCanvasMap', chart.id)
        dispatch('SingleSelected', null)
        dispatch('HideContextMenu')
        // 保存图层顺序
        dispatch('saveScreenData')
      })
    },
    // 保存图表
    async updateChartData({ dispatch, state, rootGetters }) {
      let chart = rootGetters.canvasMap.find(
        item => item.id === rootGetters.currentSelected
      )
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
    async getScreenDetail({ dispatch, commit }, { id, tabId }) {
      return screenManage.getScreenDetailById(id, tabId).then(res => {
        if (res.code === 200) {
          this.screenData = res.data
          console.log(this.screenData, 'screenData')
          dispatch('SetPageSettings', res.data ? res.data.setting : {})
          dispatch('InitCanvasMaps', {
            maps: res.data ? res.data.screenGraphs : [],
            idList: res.data ? res.data.setting.idList : []
          })
          dispatch('dataModel/setSelectedModelList', res.list)
          commit('common/SET_PRIVILEGES', res.data.privileges || [])
          return true
        }
      })
    },
    // 处理刷新大屏的数据
    async handleRefreshData({ dispatch, commit }, { chart, newData }) {
      if (
        chart.setting.chartType === 'v-ring' ||
        chart.setting.chartType === 'v-gauge'
      ) {
        let key = Object.keys(newData[0])[0]
        let total = sum(newData, key)
        let rows = [
          {
            type: key,
            value: total
          }
        ]
        chart.setting.api_data.source.rows = rows

        if (chart.setting.chartType === 'v-gauge') {
          let goalTotal = sum(newData, Object.keys(newData[0])[1])
          chart.setting.config.series.max = goalTotal
        }
      }
      // 嵌套饼图设置apis
      else if (chart.setting.chartType === 'v-multiPie') {
        let rows = []
        let dimensionKeys = chart.setting.apiData.dimensions.map(
          item => item.alias
        )
        dimensionKeys.forEach(item => {
          // 根据当前维度分类得到的列表
          let list = summary(newData, item, chart.setting.apiData.measures[0]) // 嵌套饼图度量只有一个，直接取第一个数
          rows = rows.concat(list) // 把所有维度分类出来的数组进行拼接（v-charts配置格式要求）
        })

        chart.setting.api_data.source.rows = rows
      } else {
        chart.setting.api_data.source.rows = newData
      }
    }
  }
}

export default app
