import { deepClone } from '@/utils/deepClone'
import Lodash from 'lodash'
export default class Stack {
  /**
   * 多边形专用的操作栈
   * @param {*} editor // 多边形编辑器实例
   * @param {*} polygon // 多边形实例
   */
  constructor(editor, polygon) {
    this.editor = editor
    this.polygon = polygon
    const setting = deepClone(polygon.getExtData().setting)
    setting.polygon.path = deepClone(polygon.getOptions().path)
    this.defaultSetting = setting // 记录初始配置对象
    this.currentSetting = setting // 当前配置对象
    this.stack = [] // 历史操作栈
    this.log = [] // 可恢复的记录
  }

  /**
   * 新增操作栈
   * @param {*} stack 供合并的对象
   * @param {*} callback 回调函数
   */
  do(stack, callback) {
    // 入栈
    this.stack.push(deepClone(this.currentSetting))

    const setting = Lodash.merge(deepClone(this.polygon.getExtData().setting), stack)
    setting.polygon.path = this.polygon.getOptions().path
    this.currentSetting = setting

    // 新操作入栈, 清空可恢复的撤销记录
    this.log = []
    if (typeof callback === 'function') callback(this.currentSetting)
  }

  // 撤销操作
  undo(callback) {
    // 出栈
    const target = this.stack.pop()
    // 入栈
    this.log.push(deepClone(this.currentSetting))

    // 更新配置
    this.currentSetting = target

    if (typeof callback === 'function') callback(this.currentSetting)
  }

  // 恢复操作
  redo(callback) {
    // 出栈
    const target = this.log.pop()
    // 入栈
    this.stack.push(deepClone(this.currentSetting))

    // 更新配置
    this.currentSetting = target

    if (typeof callback === 'function') callback(this.currentSetting)
  }

  // 结束操作
  finish(callback) {
    this.stack = []
    this.log = []
    if (typeof callback === 'function') {
      callback(this.currentSetting)
    }
  }

  // 清空操作
  clear(callback) {
    this.stack = []
    this.log = []
    if (typeof callback === 'function') {
      callback(this.defaultSetting)
    }
  }
}
