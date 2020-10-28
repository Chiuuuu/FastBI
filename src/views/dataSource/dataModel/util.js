import assing from 'lodash/assign'
import get from 'lodash/get'

export class Node {
  constructor(props) {
    this.props = assing({
      joinType:1
    }, props)
    this.parent = null
    this.children = []
  }
  add(node) {
    node.parent = this
    this.children.push(node)
  }
  setParent(node) {
    this.parent = node
  }
  setChildren(item) {
    this.children = item
  }
  setTableId() {
    this.props['tableId'] = this.props['id']
  }
  setTableNo(no) {
    this.props['tableNo'] = no
  }
  setJoinType(type) {
    this.props['joinType'] = type
  }
  setDataModelId(id, key = 'datamodelId') {
    this.props[key] = id
  }
  setJoin(data, key = 'join') {
    this.props[key] = data
  }
  getProps() {
    return this.props
  }
}

export function conversionTree(node, list, key, lineKey = 'leftTableId') {
  let tableId = node.props[key] * 1
  list.forEach(function(item) {
    let leftTableId = get(item, lineKey)
    if (parseInt(leftTableId) === tableId) {
      let _node = new Node(item)
      node.add(_node)
      conversionTree(_node, list, key, lineKey)
    }
  })
}

/**
 * 是否匹配关键字
 */
export function isSearchMatch(item, value) {
  return item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
}
/**
 * 递归搜索
 */
export function menuSearchLoop(item, value) {
  // 不是文件夹且匹配直接写入数组
  if (item.fileType === 1 && isSearchMatch(item, value)) {
    return item
  } else {
    // 递归遍历文件夹
    if (item.children && item.children.length > 0) {
      let newChildren = []
      item.children.map(child => {
        // 遍历子节点
        const newChild = menuSearchLoop(child, value)
        if (newChild) newChildren.push(newChild)
      })
      // 拷贝新的节点并写入子节点数组
      if (newChildren.length > 0) {
        return Object.assign({}, item, { children: newChildren })
      }
    }
  }
}

export const Utils = {
  isType(target, type) {
    let targetType = Object.prototype.toString
      .call(target)
      .slice(8, -1)
      .toLowerCase()
    return targetType === type.toLowerCase()
  },
  hasClass: function(target, className, isRef) {
    let classNames = isRef ? target : target.className || ''
    return (' ' + classNames + ' ').indexOf(' ' + className + ' ') === -1
  },
  addClass: function(target, className, isRef) {
    let classNames = isRef ? target : target.className || ''
    if (this.hasClass(target, className, isRef)) {
      target.className = classNames ? classNames + ' ' + className : className
    }
  },
  removeClass: function(target, className, isRef) {
    let classNames = isRef ? target : target.className || ''
    target.className = (' ' + classNames + ' ')
      .replace(' ' + className + ' ', ' ')
      .trim()
  }
}
