/**
 * 该文件用于高德地图api调用
 */
import AMap from 'AMap'
import Stack from './stack'
import Subscribe from './subscribe'
import { BaseSetting } from './baseSetting'
import { deepClone } from '@/utils/deepClone'
import guangzhou from '@/utils/guangdong.json'

function getMarkerIcon(color) {
  return `<svg t="1635838135487" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2693" width="32" height="32" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M512 64c-172.3 0-312 139.7-312 312 0 139.8 205.3 437 282.8 544.3 7.2 9.9 18.2 14.9 29.2 14.9s22-5 29.2-14.9C618.7 813 824 515.8 824 376c0-172.3-139.7-312-312-312z m0 424c-64.1 0-116-51.9-116-116s51.9-116 116-116 116 51.9 116 116-51.9 116-116 116z" p-id="2694" data-spm-anchor-id="a313x.7781069.0.i6" class="selected" fill="${color}"></path></svg>`
}

const distrctMapId = {
  天河区: '1',
  白云区: '2',
  越秀区: '3',
  海珠区: '4',
  荔湾区: '5',
  番禺区: '6',
  黄埔区: '7',
  花都区: '8',
  南沙区: '9',
  从化区: '10',
  增城区: '11'
}

export default class MapEditor {
  /**
   * @param {*} options 地图初始化配置项
   * @param {*} options.container 挂载的dom
   * @param {*} options.mapOptions 挂载的dom
   * @param {*} options.contextMenu 右键事件注册
   */
  constructor(options = {}) {
    this.map = new AMap.Map(options.container, options.mapOptions) // 当前地图
    this.map.on('click', ({ lnglat }) => {
      const { lng, lat } = lnglat
    })
    this.contextMenu = null // 右键事件
    this.mouseTool = null // 鼠标实例(绘制片区)

    this.stack = null // 操作栈实例
    this.subscribe = new Subscribe() // 发布订阅者

    this.areaList = [] // 片区数据列表

    this.companyGroup = null // 行政区(分公司)
    this.companyTextGroup = null // 行政区标题
    this.infoWindow = null // 行政区信息窗口

    this.polygonList = null // 多边形列表(对应片区)
    this.polygonTextList = [] // 每个片区单独有一个AMap.Text实例(在中心显示片区名称)
    this.currentPolygon = null // 当前多边形实例
    this.editor = null // 编辑器实例
    this.markerList = [] // 每个片区的标记点列表

    this.initCompany()
    this.initContextMenu(options.contextMenu)
  }

  /**
   * 绘制广州10个区的轮廓
   */
  initCompany() {
    const companyList = []
    const companyTextList = []
    guangzhou.features.forEach(item => {
      // 中心文字
      companyTextList.push(new AMap.Text({
        position: item.properties.centroid,
        anchor: 'bottom-center',
        text: item.properties.name,
        clickable: false,
        style: {
          'background-color': 'transparent',
          border: 0,
          fontWeight: 700,
          padding: 0
        }
      }))
      // 区域轮廓
      companyList.push(new AMap.Polygon({
        path: item.geometry.coordinates[0],
        fillColor: 'rgba(97, 123, 255, .1)',
        zIndex: 1,
        extData: {
          id: distrctMapId[item.properties.name],
          origin: item.properties.centroid,
          name: item.properties.name
        }
      }))
    })
    if (this.companyGroup) {
      this.map.remove(this.companyGroup)
    }
    if (this.companyTextGroup) {
      this.map.remove(this.companyTextGroup)
    }
    this.companyGroup = new AMap.OverlayGroup(companyList)
    this.companyTextGroup = new AMap.OverlayGroup(companyTextList)
    this.map.add([this.companyGroup, this.companyTextGroup])

    /* ---------------------------------------注册事件--------------------------------------- */
    // 双击聚焦当前行政区
    let mouseOverTarget = ''

    // 双击放大当前分公司
    this.companyGroup.on('dblclick', e => {
      if (this.infoWindow) this.infoWindow.close()
      this.subscribe.execute('dblclick', {
        type: 'company',
        target: e.target
      })
    })

    // 鼠标移入显示分公司信息
    this.companyGroup.on('mouseover', e => {
      // 如果鼠标一直在同一片区，则InfoWindow不显示
      if (e.target.getExtData().name === mouseOverTarget) return
      const extData = e.target.getExtData()
      let infoWindowContent =
      `<div style="background:#fff;">` +
      `<div style="margin-bottom: 5px">分公司名称: <span style="font-weight: 600">${extData.name}</span> </div>` +
      `<div>数量: <span style="font-weight: 600">${extData.num || 0}</span></div>` +
      `</div>`
      this.infoWindow = new AMap.InfoWindow({
        content: infoWindowContent
      })
      this.infoWindow.open(this.map, extData.origin)
      mouseOverTarget = extData.name
      this.subscribe.execute('mouseover', {
        type: 'company',
        target: e.target
      })
    })
  }

  /**
   * 初始化一个右键实例
   * @param {*} callbacks 回调列表
   */
  initContextMenu(callbacks) {
    const contextMenu = new AMap.ContextMenu()
    callbacks.forEach(item => {
      contextMenu.addItem(item.text, e => {
        item.callback(this.currentPolygon)
        this.subscribe.execute('open', {
          type: 'contextMenu',
          target: contextMenu
        })
        contextMenu.close()
      })
    })
    contextMenu.on('close', () => {
      if (!this.editor) {
        this.currentPolygon = null
      }
      this.subscribe.execute('close', {
        type: 'contextMenu',
        target: contextMenu
      })
    })
    this.contextMenu = contextMenu
  }

  /**
   * 根据片区数据初始化一个标记点群组
   * @param {*} area 片区数据
   */
  initMarkers(area) {
    const marker = area.setting.marker
    if (!marker.list || !marker.list.length) return
    const path = marker.list.map(item => item)
    const markers = path.map(item => {
      const icon = getMarkerIcon(area.setting.marker.fillColor)
      const marker = new AMap.Marker({
        position: item.path,
        offset: [-8, -16],
        content: icon,
        extData: {
          parentId: area.id,
          id: item.id,
          info: item.info
        }
      })
      return marker
    })
    this.markerList = new AMap.OverlayGroup(markers)
    this.markerList.on('click', e => {
      this.subscribe.execute('click', {
        type: 'marker',
        target: e.target
      })
    })
    // return OverlayGroup
    this.map.add(this.markerList)
  }

  /**
   * 根据片区数据初始化一个多边形实例
   */
  initPolygon() {
    const polygons = this.areaList.map(area => {
      const polygon = new AMap.Polygon({
        ...area.setting.polygon,
        bubble: true,
        extData: area
      })
      // 同时创建中心标题文本
      const bounds = polygon.getBounds()
      if (!bounds) {
        // this.polygonList.push(polygon)
        return polygon
      }
      const position = bounds ? bounds.getCenter() : []
      const title = new AMap.Text({
        position,
        style: {
          'background-color': 'transparent',
          'border': 0,
          'font-weight': 700,
          'padding': 0,
          'font-size': area.setting.polygon.titleFontSize + 'px',
          'color': area.setting.polygon.titleColor
        },
        anchor: 'center',
        text: area.name,
        zIndex: 9,
        clickable: false
      })
      title.setMap(this.map)
      const target = this.polygonTextList.find(item => item.id === area.id)
      if (target) {
        target.text = title
      } else {
        this.polygonTextList.push({
          id: area.id,
          text: title
        })
      }
      return polygon
    })
    this.polygonList = new AMap.OverlayGroup(polygons)
    this.polygonList.on('rightclick', e => {
      const id = e.target.getExtData().id
      // 右键打开contextMenu
      if (!this.currentPolygon || this.currentPolygon.getExtData().id === id) {
        this.currentPolygon = e.target
        this.contextMenu.open(this.map, e.lnglat)
      }
      this.subscribe.execute('rightclick', {
        type: 'polygon',
        target: e.target
      })
    })
    this.polygonList.on('click', event => {
      this.contextMenu.close()
      this.subscribe.execute('click', {
        type: 'polygon',
        target: event.target
      })
    })
    this.polygonList.on('dblclick', e => {
      this.subscribe.execute('dblclick', {
        type: 'polygon',
        target: e.target
      })
    })
    this.map.add(this.polygonList)
  }

  /**
   * @description 绘制多边形片区
   * @param {*} options
   * @param {*} options.data 片区数据
   * @param {*} options.polygonSetting 片区配置
   * @param {*} options.drawn 绘制结束的回调
   */
  drawPolygon(options) {
    const { data, drawn, polygonSetting } = options
    const map = this.map
    // 创建鼠标绘制工具
    map.plugin(['AMap.MouseTool'], () => {
      const mouseTool = new AMap.MouseTool(map)
      mouseTool.polygon({
        ...polygonSetting,
        zIndex: 5,
        extData: deepClone(data)
      })
      // 监听绘制完成事件
      mouseTool.on('draw', ({ obj }) => {
        if (typeof drawn === 'function') drawn(obj)
      })
      this.mouseTool = mouseTool
    })
  }

  /**
   * @description 创建编辑多边形片区
   * @param {*} options
   * @param {*} options.polygon 片区对象
   */
  editPolygon(options) {
    const { polygon } = options

    // 先获取片区实例对象
    if (polygon instanceof AMap.Polygon) {
      // 如果是刚绘制好的对象, 替换列表中的初始对象
      const data = polygon.getExtData()
      this.polygonList.eachOverlay(item => {
        if (item.getExtData().id === data.id) {
          this.polygonList.removeOverlay(item)
          this.polygonList.addOverlay(polygon)
        }
      })
      this.currentPolygon = polygon
    } else {
      // 根据id找到当前多边形
      let target = null
      this.polygonList.eachOverlay(item => {
        if (item.getExtData().id === polygon.id) {
          target = item
        }
      })
      this.currentPolygon = target
      if (!target) return
    }
    // 注册点击事件(弹窗配置样式)
    this.currentPolygon.off('rightclick')
    this.currentPolygon.on('rightclick', e => {
      const id = e.target.getExtData().id
      if (!this.currentPolygon || this.currentPolygon.getExtData().id === id) {
        this.currentPolygon = e.target
        this.contextMenu.open(this.map, e.lnglat)
      }
      // this.subscribe.execute('rightclick', {
      //   type: 'polygon',
      //   target: e.target
      // })
    })
    this.currentPolygon.off('click')
    this.currentPolygon.on('click', e => {
      const { lnglat: { lng, lat }, target } = e
      const pos = [lng, lat]
      const data = target.getOptions()
      this.contextMenu && this.contextMenu.close()
      // this.subscribe.execute('click', {
      //   type: 'polygon',
      //   target: event.target
      // })
    })
    this.currentPolygon.off('dblclick')
    this.currentPolygon.on('dblclick', e => {
      this.subscribe.execute('dblclick', {
        type: 'polygon',
        target: e.target
      })
    })
    this.handlePolygonTitle()

    // 创建编辑组件
    const polyEditor = new AMap.PolygonEditor(this.map, this.currentPolygon)
    this.editor = polyEditor
    polyEditor.open()

    // 开启新的操作栈
    this.stack = new Stack(polyEditor, this.currentPolygon)

    /** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!注意!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * 编辑器开启后需要重新覆盖样式配置, 否则边框是默认的蓝色
     */
    this.currentPolygon.setOptions(this.currentPolygon.getExtData().setting.polygon)

    // 新增节点事件
    polyEditor.on('addnode', event => {
      const polygon = event.target
      const setting = polygon.getOptions()
      const path = setting.path
      this.stack.do({ polygon: { path } }, () => {
        this.handlePolygonTitle()
      })
      // this.subscribe.execute('addnode', {
      //   type: 'editor',
      //   target: event.target
      // })
    })

    // 点位变化事件
    polyEditor.on('adjust', event => {
      const polygon = event.target
      const setting = polygon.getOptions()
      const path = setting.path
      this.stack.do({ polygon: { path } }, () => {
        this.handlePolygonTitle()
      })
      // this.subscribe.execute('adjust', {
      //   type: 'editor',
      //   target: event.target
      // })
    })

    // 删除节点事件
    polyEditor.on('removenode', event => {
      const polygon = event.target
      const setting = polygon.getOptions()
      const path = setting.path
      if (path.length < 3) {
      }
      this.stack.do({ polygon: { path } }, () => {
        this.handlePolygonTitle()
      })
      this.subscribe.execute('removenode', {
        type: 'editor',
        target: event.target
      })
    })

    // 编辑结束事件
    polyEditor.on('end', event => {
      // event.target 即编辑后的片区对象
    })
  }

  /**
   * @description 聚焦当前片区
   * @param {*} id 片区id
   */
  focusPolygon(id, area) {
    this.polygonList.eachOverlay(item => {
      const data = item.getExtData()
      if (data.id === id) {
        // 隐藏所有片区轮廓
        this.polygonList.hide()
        this.clearPolygonTitle()
        // 先获取到多边形轮廓
        const path = item.getBounds()
        if (path) {
          const fit = this.map.getFitZoomAndCenterByOverlays([item])
          this.map.setZoomAndCenter(...fit)
          this.updataMarkers(area)
        }
      }
    })
  }

  /**
   * @description 聚焦当前分公司
   * @param {*} target 实例
   * @param {*} areaList 片区列表
   * @param {*} callback 回调
   */
  focusCompany(target, areaList, callbcak) {
    // 显示当前行政区的片区
    const extData = target.getExtData()
    this.updateArea(areaList)
    if (typeof callbcak === 'function') {
      const fit = this.map.getFitZoomAndCenterByOverlays([target])
      callbcak(fit)
    }
    // 隐藏所有行政区轮廓
    this.companyGroup.hide()
    this.companyTextGroup.hide()
    this.infoWindow && this.infoWindow.close()
  }

  /**
   * @description 删除当前片区
   * @param {*} id 片区id
   */
  removePolygon(id) {
    // 删除多边形
    this.polygonList.eachOverlay(item => {
      if (item && item.getExtData().id === id) {
        const area = this.areaList.find(item => item.id === id)
        this.polygonList.removeOverlay(item)
        // 重新初始化一个多边形
        const polygonSetting = deepClone(BaseSetting.polygon)
        const polygon = new AMap.Polygon({
          ...polygonSetting,
          bubble: true,
          extData: area
        })
        this.polygonList.addOverlay(polygon)
        this.subscribe.execute('remove', {
          type: 'polygon',
          target: polygon,
          polygonSetting
        })

        if (this.editor && this.editor.getTarget().getExtData().id === id) {
          this.closeEditor()
        }
      }
    })
    // 删除文字标题
    const textIndex = this.polygonTextList.findIndex(item => item.id === id)
    if (textIndex > -1) {
      this.polygonTextList[textIndex].text.remove()
      this.polygonTextList.splice(textIndex, 1)
    }
  }

  /**
   * @description 更新地区信息(重新绘制当前公司的片区列表)
   * @param {*} areaList
   */
  updateArea(areaList) {
    this.areaList = areaList
    // 先清空之前的标记点和标题
    if (this.markerList) {
      this.map.remove(this.markerList)
    }
    this.markerList = null
    this.clearPolygonTitle()

    if (areaList.length) {
      // 先清空之前的群组
      if (this.polygonList) {
        this.map.remove(this.polygonList)
      }
      // 片区实例化及事件监听
      this.initPolygon()
    } else {
      if (this.polygonList) {
        this.map.remove(this.polygonList)
      }
      this.polygonList = null
    }
  }

  /**
   * @description 渲染标记点
   * @param {*} area
   */
  updataMarkers(area) {
    // 先清空之前的标记点
    if (this.markerList) {
      this.map.remove(this.markerList)
      this.markerList = null
    }
    area && this.initMarkers(area)
  }

  /**
   * @description 更新样式配置
   */
  updateStyle(setting) {
    if (!this.currentPolygon || !(this.currentPolygon instanceof AMap.Polygon)) return
    this.stack.do(setting, res => {
      const extData = this.currentPolygon.getExtData()
      extData.setting = res
      this.currentPolygon.setExtData(extData)
      this.currentPolygon.setOptions(res.polygon)
      this.handlePolygonTitle()
      if (setting.marker.fillColor !== res.marker.fillColor) {
        const id = extData.id
        const target = this.markerList.find(item => item.getExtData().id === id)
        // target.setOptions({
        //   content
        // })
      }
    })
  }

  /**
   * @description 更新右键选项
   */
   updateContextMenu(contextMenu) {
     this.initContextMenu(contextMenu)
   }

  // 撤回操作
  undoStack() {
    this.stack.undo(stack => {
      const extData = this.currentPolygon.getExtData()
      extData.setting = stack
      this.currentPolygon.setExtData(extData)
      // 路径需单独设置, 否则会出现无效的情况
      this.currentPolygon.setPath(stack.polygon.path || [])
      // 需重新设置编辑对象并open打开
      this.editor.setTarget(this.currentPolygon)
      this.editor.open()
      /** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!注意!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
       * 编辑器开启后需要重新覆盖样式配置, 否则边框是默认的蓝色
       */
      this.currentPolygon.setOptions(stack.polygon)
      this.handlePolygonTitle()
      // 如果之前清除过, 重新渲染
      if (!this.currentPolygon.getOptions().map) {
        this.map.add(this.polygonList)
      }
    })
  }

  // 恢复操作
  redoStack() {
    this.stack.redo(stack => {
      const extData = this.currentPolygon.getExtData()
      extData.setting = stack
      this.currentPolygon.setExtData(extData)
      // 路径需单独设置, 否则会出现无效的情况
      this.currentPolygon.setPath(stack.polygon.path || [])
      // 需重新设置编辑对象并open打开
      this.editor.setTarget(this.currentPolygon)
      this.editor.open()
      /** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!注意!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
       * 编辑器开启后需要重新覆盖样式配置, 否则边框是默认的蓝色
       */
      this.currentPolygon.setOptions(stack.polygon)
      this.handlePolygonTitle()
    })
  }

  // 循环查找多边形的中心
  findOrigin(bounds) {
    const positionList = ['getCenter', 'getNorthEast', 'getSouthEast', 'getSouthWest', 'getNorthWest']
    for (const position of positionList) {
      let { lng, lat } = bounds[position]()
      // console.log(position, [lng, lat], this.currentPolygon.contains([lng, lat]))
      if (this.currentPolygon.contains([lng, lat])) return [lng, lat]
    }
    return bounds.getCenter()
  }

  // 片区中心标题
  handlePolygonTitle() {
    if (!this.currentPolygon || !(this.currentPolygon instanceof AMap.Polygon)) return
    const data = this.currentPolygon.getExtData()
    const bounds = this.currentPolygon.getBounds()
    const position = bounds ? this.findOrigin(bounds) : []
    const style = {
      'background-color': 'transparent',
      'border': 0,
      'font-weight': 700,
      'padding': 0,
      'font-size': data.setting.polygon.titleFontSize + 'px',
      'color': data.setting.polygon.titleColor
    }

    // 寻找
    const target = this.polygonTextList.find(item => item.id === data.id)
    if (target) {
      target.text.setPosition(position)
      target.text.setStyle(style)
    } else {
      const title = new AMap.Text({
        position,
        style,
        anchor: 'center',
        text: data.name,
        zIndex: 9,
        clickable: false
      })
      title.setMap(this.map)
      this.polygonTextList.push({
        id: data.id,
        text: title
      })
    }
  }

  // 清空全部或指定片区的title
  clearPolygonTitle(id) {
    if (id) {
      const index = this.polygonTextList.findIndex(item => item.id === id)
      if (index > -1) {
        this.polygonTextList[index].text.remove()
        this.polygonTextList.splice(index, 1)
      }
    } else {
      this.polygonTextList.forEach(item => {
        if (item.text instanceof AMap.Text) {
          item.text.remove()
        }
      })
      this.polygonTextList = []
    }
  }

  // 保存片区
  saveEditor() {
    this.stack.finish(setting => {
      const data = this.currentPolygon.getExtData()

      this.editor.close()
      this.stack = null
      this.editor = null
      this.currentPolygon.setOptions(setting.polygon)
      // 路径需单独设置, 否则会出现无效的情况
      this.currentPolygon.setPath(setting.polygon.path || [])
      this.subscribe.execute('saveEditor', {
        type: 'editor',
        target: this.currentPolygon,
        setting
      })
      this.currentPolygon = null
    })
  }
  // 取消编辑
  closeEditor() {
    this.stack.clear(defaultSetting => {
      const extData = this.currentPolygon.getExtData()
      extData.setting = defaultSetting
      // 没有形成图形, 将文字删除
      if (defaultSetting.polygon.path.length === 0) {
        this.currentPolygon.destroy()
        const index = this.polygonTextList.findIndex(item => item.id === extData.id)
        this.polygonTextList[index].text.remove()
        index > -1 && this.polygonTextList.splice(index, 1)
      } else {
        this.currentPolygon.setExtData(extData)
        this.currentPolygon.setOptions(defaultSetting)
        this.currentPolygon.setPath(defaultSetting.polygon.path || [])
        this.handlePolygonTitle()
      }
      this.subscribe.execute('closeEditor', {
        type: 'editor',
        target: this.currentPolygon,
        polygonSetting: defaultSetting
      })
      this.editor.close()
      this.stack = null
      this.editor = null
      this.currentPolygon = null
    })
  }
}
