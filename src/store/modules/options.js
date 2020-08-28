const options = {
  state: {
    dragFile: '', // 拖拽的维度
    dataModel: {} // 选中的数据模型
  },
  mutations: {
    SET_DRAG_FILE: (state, val) => {
        state.dragFile = val
    },
    SET_DATA_MODEL: (state, val) => {
      state.dataModel = val
    }
  },
  actions: {
    SetDragFile: ({ commit }, val) => {
      commit('SET_DRAG_FILE', val)
    },
    SetDataModel: ({ commit }, val) => {
      commit('SET_DATA_MODEL', val)
    }
  }
}

export default options
