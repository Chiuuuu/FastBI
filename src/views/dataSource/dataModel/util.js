import assing from 'lodash/assign'
import get from 'lodash/get'

export class Node {
  constructor(props) {
    this.props = assing({
      joinType: 1
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
  setField(field, value) {
    this.props[field] = value
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
