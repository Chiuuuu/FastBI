export default class Subscribe {
  constructor() {
    this.events = {}
  }

  /**
   * 注册订阅事件
   * @param {*} eventType 事件类型(需保证event类型和高德api保持一致)
   * @param {*} fn 回调函数
   */
  on(eventType, fn) {
    if (!this.events[eventType]) {
      this.events[eventType] = []
    }
    this.events[eventType].push(fn)
  }

  /**
   * 删除订阅事件
   * @param {*} eventType 事件类型(需保证event类型和高德api保持一致)
   * @param {*} fn 回调函数
   */
   off(eventType, fn) {
    if (!this.events[eventType]) return
    const index = this.events[eventType].findIndex(item => item === fn)
    index > -1 && this.events[eventType].splice(index, 1)
  }

  /**
   * 发布执行当前事件函数
   * @param {*} eventType 事件类型
   * @param {*} obj 触发对象
   * @param {*} obj.type 对象类型 map(地图) | district(行政区) | polygon(多边形) | marker(网格) | editor(片区编辑器) | contextMenu(右键对象)
   * @param {*} obj.target 对象实例
   */
  execute(eventType, obj) {
    if (!this.events[eventType]) return
    this.events[eventType].forEach(fn => {
      fn(obj)
    })
  }

  /**
   * 清空某一类事件或所有事件
   * @param {*} eventType string? 事件类型(需保证event类型和高德api保持一致)
   */
   clear(eventType) {
     if (eventType) {
       delete this.events[eventType]
     } else {
       this.events = {}
     }
  }
}
