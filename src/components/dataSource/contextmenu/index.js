import Vue from 'vue'
import isFunction from 'lodash/isFunction'
import tml from './contextMenu.vue'

var _ContextMenu = Vue.extend(tml)
var instance = ''
var ContextMenu = function(options) {
  var defaultOpitons = options || {}

  if (defaultOpitons.styleObj) {
    // 判断当前页面点击高度, 防止穿模
    const clientHeight = document.body.clientHeight // 页面高
    const bodyHeight = defaultOpitons.menus.length * 32 // 列表高
    let top = defaultOpitons.styleObj.top.slice(0, -2) // 点击位置
    if (clientHeight - top < bodyHeight) {
      defaultOpitons.styleObj.top = top - bodyHeight + 'px'
    }
  }

  let mark = document.createElement('div')
  mark.className = 'm-window mask-transparent'
  mark.style.zIndex = '1001'

  mark.onclick = handleRemove

  defaultOpitons.remove = handleRemove
  // 生成组件
  instance = new _ContextMenu({
    propsData: defaultOpitons
  })
  // 组件需要挂载在dom元素上
  instance.vm = instance.$mount()

  function handleRemove() {
    if (isFunction(defaultOpitons['handleMarkCancel'])) {
      defaultOpitons.handleMarkCancel()
    }
    document.body.removeChild(mark)
    document.body.removeChild(instance.vm.$el)
  }
  mark.oncontextmenu = function(e) {
    e.preventDefault()
  }
  document.body.appendChild(mark)
  // append到body
  document.body.appendChild(instance.vm.$el)
  return instance.vm
}

export default ContextMenu
