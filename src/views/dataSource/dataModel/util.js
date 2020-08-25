import assing from 'lodash/assign'
import get from 'lodash/get'

export class Node {
  constructor(props) {
    this.props = assing({}, props)
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
  setTableId(id) {
    this.props['tableId'] = id
  }
  getProps() {
    return this.props
  }
}

export function conversionTree(node, list, key, lineKey = 'conditions[0].leftTableId') {
    let tableId = node.props[key]
    list.forEach(function(item) {
      let leftTableId = get(item.join, lineKey)
      if (leftTableId === tableId) {
        let _node = new Node(item)
        node.add(_node)
        conversionTree(_node, list, key, lineKey)
      }
    })
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
