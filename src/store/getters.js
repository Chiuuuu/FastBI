const getters = {
    pageSettings: state => state.app.pageSettings, // 页面设置

    canvasRange: state => state.app.canvasRange, // 画布缩放参数

    optionsExpand: state => state.app.optionsExpand, // 参数面板展开

    modelExpand: state => state.app.modelExpand, // 8-14 数据模型展开

    coverageExpand: state => state.app.coverageExpand, // 图层面板展开

    canvasMap: state => state.canvasMaps.canvasMap, // 画布映射数组

    currentSelected: state => state.canvasMaps.singleSelected, // 当前选中的组件

    contextMenuInfo: state => state.canvasMaps.contextMenuInfo, // 右键菜单信息

    isScreen: state => state.app.isScreen, // 是否全屏

    dragFile: state => state.options.dragFile, // 拖拽的字段类型

    dataModel: state => state.options.dataModel, // 选中的数据模型

    optionsTabsType: state => state.options.optionsTabsType, // 选中的项 样式/数据/交互

    screenId: state => state.app.screenId, // 大屏id

    fileName: state => state.app.fileName,

    modelFile: state => state.options.modelFile
}

export default getters
