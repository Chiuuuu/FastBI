const options = {
  state: {
    dragFile: '' // 拖拽的维度
  },
  mutations: {
    SET_DRAG_FILE: (state, val) => {
        state.dragFile = val
    }
  },
  actions: {
    SetDragFile: ({ commit }, val) => {
      commit('SET_DRAG_FILE', val)
    }
  }
}

export default options
