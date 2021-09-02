const options = {
  state: {
    dragFile: '', // 拖拽的维度
    dataModel: {}, // 选中的数据模型
    optionsTabsType: 0, // 页面设置选中项 样式/数据/交互
    modelFile: {},
    modelMeasures: [], // 当前度量
    modelDimensions: [] // 当前维度
  },
  mutations: {
    SET_DRAG_FILE: (state, val) => {
      state.dragFile = val
    },
    SET_DATA_MODEL: (state, val) => {
      state.dataModel = val
    },
    SET_TABS_TYPE: (state, val) => {
      state.optionsTabsType = val
    },
    SET_MODEL_MEASURES: (state, val) => {
      state.modelMeasures = val
    },
    SET_MODEL_DIMENSIONS: (state, val) => {
      state.modelDimensions = val
    }
  },
  actions: {
    SetDragFile: ({ commit }, val) => {
      commit('SET_DRAG_FILE', val)
    },
    SetDataModel: ({ commit }, val) => {
      commit('SET_DATA_MODEL', val)
    },
    SetTabsType: ({ commit }, val) => {
      commit('SET_TABS_TYPE', val)
    },
    SetModelMeasures: ({ commit }, val) => {
      commit('SET_MODEL_MEASURES', val)
    },
    SetModelDimensions: ({ commit }, val) => {
      commit('SET_MODEL_DIMENSIONS', val)
    }
  }
}

export default options
