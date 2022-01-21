/**
 * 该文件用于高德地图api调用
 */
import AMap from 'AMap'
import Stack from './stack'
import Subscribe from './subscribe'
import { BaseSetting } from './baseSetting'
import { deepClone } from '@/utils/deepClone'
import guangzhou from '@/utils/guangdong.json'

function getGridIcon(color) {
  return `<svg t="1642390585358" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13561" width="16" height="16"><path d="M511.573333 0C283.648 0 98.901333 185.173333 98.901333 413.525333c0 5.12 0.128 10.24 0.298667 15.274667 4.224 117.76 56.96 231.936 138.581333 313.429333l0.725334 0.725334L511.317333 1024l264.96-272.981333 18.688-18.645334c76.032-80.554667 124.8-190.165333 129.066667-303.061333 0.213333-5.290667 0.298667-10.581333 0.298667-15.872C924.245333 185.173333 739.498667 0 511.616 0z m150.613334 543.232a212.949333 212.949333 0 0 1-151.594667 62.72 212.949333 212.949333 0 0 1-151.552-62.72 212.992 212.992 0 0 1-62.72-151.594667c0-57.216 22.272-111.104 62.72-151.552a212.949333 212.949333 0 0 1 151.594667-62.72c57.216 0 111.104 22.272 151.552 62.72a212.949333 212.949333 0 0 1 62.72 151.552 212.992 212.992 0 0 1-62.72 151.594667z" p-id="13562" fill="${color}"></path></svg>`
}

function getBuildingIcon(color) {
  return `<svg t="1641867878757" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5819" width="48" height="48"><path d="M823 128H487a40 40 0 0 0-40 40v152H201a40 40 0 0 0-40 40v496a40 40 0 0 0 40 40h278l4-0.2 4 0.2h336a40 40 0 0 0 40-40V168a40 40 0 0 0-40-40zM391.5 732.7a3.3 3.3 0 0 1-3.3 3.3H284.8a3.3 3.3 0 0 1-3.3-3.3v-57.4a3.3 3.3 0 0 1 3.3-3.3h103.4a3.3 3.3 0 0 1 3.3 3.3z m0-136a3.3 3.3 0 0 1-3.3 3.3H284.8a3.3 3.3 0 0 1-3.3-3.3v-57.4a3.3 3.3 0 0 1 3.3-3.3h103.4a3.3 3.3 0 0 1 3.3 3.3z m360 136a3.3 3.3 0 0 1-3.3 3.3H626.8a3.3 3.3 0 0 1-3.3-3.3v-57.4a3.3 3.3 0 0 1 3.3-3.3h121.4a3.3 3.3 0 0 1 3.3 3.3z m0-136a3.3 3.3 0 0 1-3.3 3.3H626.8a3.3 3.3 0 0 1-3.3-3.3v-57.4a3.3 3.3 0 0 1 3.3-3.3h121.4a3.3 3.3 0 0 1 3.3 3.3z m0-136a3.3 3.3 0 0 1-3.3 3.3H626.8a3.3 3.3 0 0 1-3.3-3.3v-57.4a3.3 3.3 0 0 1 3.3-3.3h121.4a3.3 3.3 0 0 1 3.3 3.3z" p-id="5820" fill="${color}"></path></svg>`
}

// 百度坐标转高德（传入经度、纬度）
function bgpsGps([bdLng, bdLat]) {
  let X_PI = Math.PI * 3000.0 / 180.0
  let x = bdLng - 0.0065
  let y = bdLat - 0.006
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
  let ggLng = z * Math.cos(theta)
  let ggLat = z * Math.sin(theta)
  return [ggLng, ggLat]
}
// 高德坐标转百度（传入经度、纬度）
function gpsBgps([ggLng, ggLat]) {
  let X_PI = Math.PI * 3000.0 / 180.0
  let x = ggLng; let y = ggLat
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI)
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI)
  let bdLng = z * Math.cos(theta) + 0.0065
  let bdLat = z * Math.sin(theta) + 0.006
  return [bdLat, bdLng]
}

const MAP_DISTRICT_COLOR = {
  '天河区': '#A45CE8',
  '越秀区': '#7060E0',
  '海珠区': '#1FB613',
  '荔湾区': '#7060E0',
  '番禺区': '#3338E2',
  '白云区': '#61C8AA',
  '黄埔区': '#617BFF',
  '花都区': '#EC8121',
  '南沙区': '#ECBA21',
  '增城区': '#E85CAE',
  '从化区': '#5CB8E8'
}
export default class MapEditor {
  /**
   * @param {*} options 地图初始化配置项
   * @param {*} options.container 挂载的dom
   * @param {*} options.mapOptions 挂载的dom
   * @param {*} options.contextMenu 右键事件注册
   * @param {*} options.companyList 右键事件注册
   */
  constructor(options = {}) {
    this.map = new AMap.Map(options.container, {
      mapStyle: 'amap://styles/04f4373ed7932271ac3c6c80dec8487e'
    }) // 当前地图

    this.contextMenu = null // 右键事件
    this.contextMenuTarget = null // 当前右键点击的对象({ type: '', target: null })
    this.mouseTool = null // 鼠标实例(绘制片区)

    this.stack = null // 操作栈实例
    this.subscribe = new Subscribe() // 发布订阅者

    this.areaList = [] // 片区数据列表

    this.companyList = options.companyList
    this.companyGroup = null // 行政区(分公司)
    this.companyTextGroup = null // 行政区标题

    this.areaGroup = null // 多边形列表(对应片区)
    this.areaTextGroup = null // 每个片区单独有一个AMap.Text实例(在中心显示片区名称)
    this.currentArea = null // 当前多边形实例
    this.editor = null // 编辑器实例

    this.gridGroup = null // 每个片区的网格点列表
    this.buildingGroup = null // 每个网格的楼盘列表

    this.initCompany()
    // TODO: 取消右键操作
    // this.initContextMenu(options.contextMenu)
  }

  /**
   * 初始化一个右键实例
   * @param {*} callbacks 回调列表
   */
  initContextMenu(callbacks) {
    const contextMenu = new AMap.ContextMenu()
    callbacks.forEach(item => {
      contextMenu.addItem(item.text, e => {
        item.callback(this.contextMenuTarget)
        contextMenu.close()
        this.contextMenuTarget = null
      })
    })
    contextMenu.on('close', () => {
      if (!this.editor) {
        this.currentArea = null
      }
      this.subscribe.execute('close', {
        type: 'contextMenu',
        target: contextMenu
      })
    })
    this.contextMenu = contextMenu
  }

  /**
   * 绘制广州10个区的轮廓
   */
  initCompany() {
    const companyList = []
    const companyTextList = []
    guangzhou.features.forEach(item => {
      let areaCnt = 0
      const district = item.properties.name
      const sections = this.companyList.find(item => {
        let companyName = item.headOfficeName
        // TODO: 越荔分公司特殊处理
        if (companyName === '越荔分公司') {
          companyName = ['越秀', '荔湾']
        }
        return companyName.indexOf(district.slice(0, -1)) > -1
      })
      if (sections) {
        areaCnt = sections.section.length
        // 中心文字(越荔分公司只显示一个)
        if (district !== '荔湾区') {
          companyTextList.push(new AMap.Text({
            position: item.properties.centroid,
            anchor: 'bottom-center',
            text: sections.headOfficeName,
            clickable: false,
            style: {
              'background-color': 'transparent',
              border: 0,
              fontWeight: 700,
              padding: 0
            }
          }))
        }
        // 区域轮廓
        companyList.push(new AMap.Polygon({
          path: item.geometry.coordinates[0],
          strokeColor: MAP_DISTRICT_COLOR[district],
          fillColor: MAP_DISTRICT_COLOR[district],
          fillOpacity: 0.2,
          zIndex: 1,
          extData: {
            origin: item.properties.centroid,
            // name: district.slice(0, -1), // 筛选掉'区'字
            name: sections.headOfficeName, // 筛选掉'区'字
            areaCnt: areaCnt
          }
        }))
      }
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
    this.subscribe.execute('init', {
      type: 'company',
      target: this.companyGroup
    })

    /* ---------------------------------------注册事件--------------------------------------- */
    // 双击放大当前分公司
    this.companyTextGroup.on('dblclick', e => {
      if (this.contextMenu) {
        this.contextMenu.close()
        this.contextMenuTarget = null
      }
      this.subscribe.execute('dblclick', {
        type: 'text',
        target: e.target
      })
    })
    this.companyTextGroup.on('rightclick', e => {
      this.subscribe.execute('rightclick', {
        type: 'text',
        target: e.target
      })
    })
    this.companyGroup.on('dblclick', e => {
      this.subscribe.execute('dblclick', {
        type: 'company',
        target: e.target
      })
    })

    this.companyGroup.on('click', e => {
      if (this.contextMenu) {
        this.contextMenu.close()
        this.contextMenuTarget = null
      }
    })

    // 右键显示分公司信息
    this.companyGroup.on('rightclick', e => {
      e.originEvent.preventDefault()
      if (this.contextMenu) {
        this.contextMenuTarget = {
          type: 'company',
          target: e.target
        }
        this.contextMenu.close()
        this.contextMenu.open(this.map, e.lnglat)
      }
      this.subscribe.execute('rightclick', {
        type: 'company',
        target: e.target
      })
    })
  }

  /**
   * 根据片区数据初始化一个多边形实例
   */
  initArea() {
    const areaTextGroup = []
    const areas = this.areaList.map(area => {
      const polygon = new AMap.Polygon({
        ...area.setting.area,
        bubble: true,
        extData: area
      })
      // 同时创建中心标题文本
      const bounds = polygon.getBounds()
      if (!bounds) {
        // this.areaGroup.push(polygon)
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
          'font-size': area.setting.area.titleFontSize + 'px',
          'color': area.setting.area.titleColor
        },
        anchor: 'center',
        text: area.name,
        zIndex: 9,
        clickable: false
      })
      title.on('dblclick', e => {
        // 双击放大当前片区
        if (this.contextMenu) {
          this.contextMenu.close()
          this.contextMenuTarget = null
        }
        this.subscribe.execute('dblclick', {
          type: 'text',
          target: e.target
        })
      })
      title.on('rightclick', e => {
        // 双击放大当前片区
        if (this.contextMenu) {
          this.contextMenu.close()
          this.contextMenuTarget = null
        }
        this.subscribe.execute('rightclick', {
          type: 'text',
          target: e.target
        })
      })
      areaTextGroup.push(title)
      // 注册事件
      this.subscribeAreaEvent(polygon)
      return polygon
    })
    this.areaGroup = new AMap.OverlayGroup(areas)
    this.areaTextGroup = new AMap.OverlayGroup(areaTextGroup)
    this.map.add([this.areaGroup, this.areaTextGroup])
    this.subscribe.execute('init', {
      type: 'area',
      target: this.areaGroup
    })
  }

  /**
   * 根据片区数据初始化一个网格点群组
   * @param {*} grids 网格点
   * @param {*} area 片区信息
   */
  initGrid(grids, area) {
    if (!grids.length) return
    let fillColor = BaseSetting.grid.fillColor
    // TODO: 更新点位的时候可能会有问题
    if (area && area.setting && area.setting.grid) {
      fillColor = area.setting.grid.fillColor
      area.setting.grid.cnt = grids.length
    }
    // const icon = getGridIcon(fillColor)
    const gridGroup = grids.map(item => {
      const icon = getGridIcon(`rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`)
      const marker = new AMap.Marker({
        position: bgpsGps([item.longitude, item.latitude]),
        offset: [-8, -16],
        content: icon,
        extData: {
          ...deepClone(item)
        }
      })
      return marker
    })
    this.gridGroup = new AMap.OverlayGroup(gridGroup)
    this.gridGroup.on('rightclick', e => {
      if (this.contextMenu) {
        this.contextMenuTarget = {
          type: 'grid',
          target: e.target
        }
        this.contextMenu.close()
        this.contextMenu.open(this.map, e.lnglat)
      }
      this.subscribe.execute('rightclick', {
        type: 'grid',
        target: e.target
      })
    })
    this.gridGroup.on('click', e => {
      if (this.contextMenu) {
        this.contextMenu.close()
        this.contextMenuTarget = null
      }
    })
    this.gridGroup.on('dblclick', e => {
      this.subscribe.execute('dblclick', {
        type: 'grid',
        target: e.target
      })
    })
    this.subscribe.execute('init', {
      type: 'grid',
      target: this.gridGroup
    })
    this.map.add(this.gridGroup)

    // 如果点位过于密集, 用海量点做渲染
    // const data = grids.map(item => {
    //   item.lnglat = [item.longitude, item.latitude]
    //   return item
    // })
    // const gridGroup = new AMap.MassMarks(data, {
    //   style: {
    //     url: 'https://webapi.amap.com/images/mass/mass1.png',
    //     size: new AMap.Size(16, 16)
    //   }
    // })
    // this.gridGroup = gridGroup
    // this.gridGroup.on('click', e => {
    //   this.subscribe.execute('click', {
    //     type: 'grid',
    //     target: e.data
    //   })
    // })
    // this.gridGroup.setMap(this.map)
  }

  /**
   * 根据网格数据初始化一个楼盘标记点群组
   * @param {*} buildings 楼盘点
   * @param {*} grid 网格信息
   */
  initBuilding(buildings, grid) {
    if (!buildings.length) return
    // TODO: 更新点位的时候可能会有问题
    if (grid && grid.setting && grid.setting.grid) {
      grid.setting.grid.cnt = buildings.length
    }
    const buildingGroup = buildings.map(item => {
      // const icon = getBuildingIcon(`rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`)
      const icon = getBuildingIcon('#617bff')
      const marker = new AMap.Marker({
        position: bgpsGps([item.longitude, item.latitude]),
        offset: [-8, -16],
        content: icon,
        extData: {
          ...deepClone(item)
        }
      })
      return marker
    })
    this.buildingGroup = new AMap.OverlayGroup(buildingGroup)
    this.buildingGroup.on('rightclick', e => {
      if (this.contextMenu) {
        this.contextMenuTarget = {
          type: 'building',
          target: e.target
        }
        this.contextMenu.close()
        this.contextMenu.open(this.map, e.lnglat)
      }
      this.subscribe.execute('rightclick', {
        type: 'building',
        target: e.target
      })
    })
    this.map.add(this.buildingGroup)
    this.subscribe.execute('init', {
      type: 'building',
      target: this.buildingGroup
    })

    // 如果点位过于密集, 用海量点做渲染
    // const data = buildings.map(item => {
    //   item.lnglat = [item.longitude, item.latitude]
    //   return item
    // })
    // const buildingGroup = new AMap.MassMarks(data, {
    //   style: {
    //     url: 'https://webapi.amap.com/images/mass/mass1.png',
    //     size: new AMap.Size(16, 16)
    //   }
    // })
    // this.buildingGroup = buildingGroup
    // this.buildingGroup.on('click', e => {
    //   this.subscribe.execute('click', {
    //     type: 'building',
    //     target: e.data
    //   })
    // })
    // this.buildingGroup.setMap(this.map)
  }

  /**
   * 注册多边形事件监听
   * @param {*} area 实例对象
   */
  subscribeAreaEvent(area) {
    area.on('rightclick', e => {
      const name = e.target.getExtData().name
      if (!this.currentArea || this.currentArea.getExtData().name === name) {
        this.currentArea = e.target
        if (this.contextMenu) {
          this.contextMenuTarget = {
            type: 'area',
            target: e.target
          }
          this.contextMenu.close()
          this.contextMenu.open(this.map, e.lnglat)
        }
      }
      this.subscribe.execute('rightclick', {
        type: 'area',
        target: e.target
      })
    })
    area.on('click', e => {
      const { lnglat: { lng, lat }, target } = e
      if (this.contextMenu) {
        this.contextMenu.close()
        this.contextMenuTarget = null
      }
      // this.subscribe.execute('click', {
      //   type: 'area',
      //   target: event.target
      // })
    })
    area.on('dblclick', e => {
      this.subscribe.execute('dblclick', {
        type: 'area',
        target: e.target
      })
    })
  }

  /**
   * @description 绘制多边形片区
   * @param {*} options
   * @param {*} options.data 片区数据
   * @param {*} options.areaSetting 片区配置
   * @param {*} options.drawn 绘制结束的回调
   */
  drawArea(options) {
    const { data, drawn, areaSetting } = options
    const map = this.map
    // 创建鼠标绘制工具
    map.plugin(['AMap.MouseTool'], () => {
      const mouseTool = new AMap.MouseTool(map)
      mouseTool.polygon({
        ...areaSetting,
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
   * @param {*} options.area 片区对象
   */
  editArea(options) {
    const { area } = options

    // 先获取片区实例对象
    if (area instanceof AMap.Polygon) {
      // 如果是刚绘制好的对象, 插入到组里
      this.areaGroup.addOverlay(area)
      // 注册点击事件(弹窗配置样式)
      this.subscribeAreaEvent(area)
      this.currentArea = area
    } else {
      // 根据name找到当前多边形
      let target = null
      this.areaGroup.eachOverlay(item => {
        if (item.getExtData().name === area.name) {
          target = item
        }
      })
      this.currentArea = target
      if (!target) return
    }
    this.handleAreaTitle()

    // 创建编辑组件
    const polyEditor = new AMap.PolygonEditor(this.map, this.currentArea)
    this.editor = polyEditor
    polyEditor.open()

    // 开启新的操作栈
    this.stack = new Stack(polyEditor, this.currentArea)

    /** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!注意!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * 编辑器开启后需要重新覆盖样式配置, 否则边框是默认的蓝色
     */
    this.currentArea.setOptions(this.currentArea.getExtData().setting.area)

    // 新增节点事件
    polyEditor.on('addnode', event => {
      const area = event.target
      const setting = area.getOptions()
      const path = setting.path
      this.stack.do({ area: { path } }, () => {
        this.handleAreaTitle()
      })
    })

    // 点位变化事件
    polyEditor.on('adjust', event => {
      const area = event.target
      const setting = area.getOptions()
      const path = setting.path
      this.stack.do({ area: { path } }, () => {
        this.handleAreaTitle()
      })
    })

    // 删除节点事件
    polyEditor.on('removenode', event => {
      const area = event.target
      const setting = area.getOptions()
      const path = setting.path
      if (path.length < 3) {
      }
      this.stack.do({ area: { path } }, () => {
        this.handleAreaTitle()
      })
    })

    // 编辑结束事件
    polyEditor.on('end', event => {
      // event.target 即编辑后的片区对象
    })
  }

  /**
   * @description 聚焦当前网格
   * @param {*} name 网格名称
   */
  focusGrid(name) {
    this.gridGroup.eachOverlay(item => {
      const target = item.getExtData()
      if (target.grid === name) {
        // 隐藏所有网格轮廓
        this.gridGroup.hide()
        // 先获取到多边形轮廓
        const fit = this.map.getFitZoomAndCenterByOverlays([item])
        // 缩放比特殊处理
        fit[0] = fit[0] * 0.55
        this.subscribe.execute('focus', {
          type: 'grid',
          target: item,
          fit
        })
      }
    })
  }

  /**
   * @description 聚焦当前片区
   * @param {*} name 片区名称
   */
  focusArea(name) {
    // 先清除楼盘
    this.clearBuilding()
    this.areaGroup.eachOverlay(item => {
      const target = item.getExtData()
      if (target.name === name) {
        // 隐藏所有片区轮廓
        this.areaGroup.hide()
        this.areaTextGroup.hide()
        // 先获取到多边形轮廓
        const path = item.getBounds()
        if (path) {
          const fit = this.map.getFitZoomAndCenterByOverlays([item])
          this.subscribe.execute('focus', {
            type: 'area',
            target: item,
            fit
          })
        }
      }
    })
  }

  /**
   * @description 聚焦当前分公司
   * @param {*} target 实例
   * @param {*} areaList 片区列表
   */
  focusCompany(target, areaList) {
    // 显示当前行政区的片区
    this.updateArea(areaList)
    this.clearBuilding()
    // 隐藏所有行政区轮廓
    this.companyGroup.hide()
    this.companyTextGroup.hide()
    const fit = this.map.getFitZoomAndCenterByOverlays([target])
    this.subscribe.execute('focus', {
      type: 'company',
      fit,
      target
    })
  }

  /**
   * @description 删除当前片区
   * @param {*} name 片区name
   */
  removeArea(name) {
    // 删除文字标题
    this.areaTextGroup.eachOverlay(item => {
      if (item && item.getText() === name) {
        this.areaTextGroup.removeOverlay(item)
      }
    })
    // 删除多边形
    this.areaGroup.eachOverlay(item => {
      if (item && item.getExtData().name === name) {
        this.areaGroup.removeOverlay(item)
        // this.subscribe.execute('remove', {
        //   type: 'area',
        //   target: item,
        // })

        if (this.editor && this.editor.getTarget().getExtData().name === name) {
          this.closeEditor()
        }
      }
    })
  }

  /**
   * @description 更新地区信息(重新绘制当前公司的片区列表)
   * @param {*} areaList
   */
  updateArea(areaList) {
    this.areaList = areaList
    // 先清空之前的网格点和标题
    if (this.gridGroup) {
      this.map.remove(this.gridGroup)
      this.gridGroup.clear && this.gridGroup.clear()
    }
    this.gridGroup = null

    // 先清空之前的片区
    if (this.areaGroup) {
      this.map.remove(this.areaGroup)
    }
    if (this.areaTextGroup) {
      this.map.remove(this.areaTextGroup)
    }
    // 片区实例化及事件监听
    this.initArea()
  }

  /**
   * @description 清空网格点
   */
  clearGrid() {
    if (this.gridGroup) {
      this.map.remove(this.gridGroup)
      this.gridGroup.clear && this.gridGroup.clear()
      this.gridGroup = null
    }
  }

  /**
   * @description 清空楼盘
   */
  clearBuilding() {
    // 先清空之前的网格点
    if (this.buildingGroup) {
      this.map.remove(this.buildingGroup)
      this.buildingGroup.clear && this.buildingGroup.clear()
      this.buildingGroup = null
    }
  }

  /**
   * @description 更新样式配置
   */
  updateStyle(grids, setting) {
    if (!this.currentArea || !(this.currentArea instanceof AMap.Polygon)) return
    this.stack.do(setting, res => {
      const extData = this.currentArea.getExtData()
      extData.setting = res
      this.currentArea.setExtData(extData)
      this.currentArea.setOptions(res.area)
      this.handleAreaTitle()
      // this.updateGrid(grids, extData)
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
      const extData = this.currentArea.getExtData()
      extData.setting = stack
      this.currentArea.setExtData(extData)
      // 路径需单独设置, 否则会出现无效的情况
      this.currentArea.setPath(stack.area.path || [])
      // 需重新设置编辑对象并open打开
      this.editor.setTarget(this.currentArea)
      this.editor.open()
      /** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!注意!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
       * 编辑器开启后需要重新覆盖样式配置, 否则边框是默认的蓝色
       */
      this.currentArea.setOptions(stack.area)
      // const icon = getGridIcon(stack.grid.fillColor)
      // this.gridGroup.setOptions({
      //   content: icon
      // })
      this.handleAreaTitle()
      // 如果之前清除过, 重新渲染
      if (!this.currentArea.getOptions().map) {
        this.map.add(this.areaGroup)
      }
    })
  }

  // 恢复操作
  redoStack() {
    this.stack.redo(stack => {
      const extData = this.currentArea.getExtData()
      extData.setting = stack
      this.currentArea.setExtData(extData)
      // 路径需单独设置, 否则会出现无效的情况
      this.currentArea.setPath(stack.area.path || [])
      // 需重新设置编辑对象并open打开
      this.editor.setTarget(this.currentArea)
      this.editor.open()
      /** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!注意!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
       * 编辑器开启后需要重新覆盖样式配置, 否则边框是默认的蓝色
       */
      this.currentArea.setOptions(stack.area)
      // const icon = getGridIcon(stack.grid.fillColor)
      // this.gridGroup.setOptions({
      //   content: icon
      // })
      this.handleAreaTitle()
    })
  }

  // 循环查找多边形的中心
  findOrigin(bounds) {
    const positionList = ['getCenter', 'getNorthEast', 'getSouthEast', 'getSouthWest', 'getNorthWest']
    for (const position of positionList) {
      let { lng, lat } = bounds[position]()
      if (this.currentArea.contains([lng, lat])) return [lng, lat]
    }
    return bounds.getCenter()
  }

  // 片区中心标题
  handleAreaTitle() {
    if (!this.currentArea || !(this.currentArea instanceof AMap.Polygon)) return
    const data = this.currentArea.getExtData()
    const bounds = this.currentArea.getBounds()
    const position = bounds ? this.findOrigin(bounds) : []
    const style = {
      'background-color': 'transparent',
      'border': 0,
      'font-weight': 700,
      'padding': 0,
      'font-size': data.setting.area.titleFontSize + 'px',
      'color': data.setting.area.titleColor
    }

    // 寻找
    let target = null
    this.areaTextGroup.eachOverlay(item => {
      if (item && item.getText() === data.name) {
        target = item
      }
    })
    if (target) {
      target.setPosition(position)
      target.setStyle(style)
    } else {
      const title = new AMap.Text({
        position,
        style,
        anchor: 'center',
        text: data.name,
        zIndex: 9,
        clickable: false
      })
      this.areaTextGroup.addOverlay(title)
    }
  }

  // 保存片区
  saveEditor() {
    // 判断多边形是否还存在
    const path = this.currentArea.getPath()
    if (!path || !path.length) {
      this.subscribe.execute('saveEditor', {
        type: 'editor',
        target: this.currentArea,
        setting: {
          area: this.currentArea.getOptions()
        }
      })
    } else {
      // 存在则关闭操作栈
      this.stack.finish(setting => {
        this.editor.close()
        this.stack = null
        this.editor = null
        this.currentArea.setOptions(setting.area)
        // 路径需单独设置, 否则会出现无效的情况
        this.currentArea.setPath(setting.area.path || [])
        this.subscribe.execute('saveEditor', {
          type: 'editor',
          target: this.currentArea,
          setting
        })
        this.currentArea = null
      })
    }
  }
  // 取消编辑
  closeEditor() {
    this.stack.clear(defaultSetting => {
      const extData = this.currentArea.getExtData()
      extData.setting = defaultSetting
      // 没有形成图形, 将文字删除
      if (defaultSetting.area.path.length === 0) {
        this.currentArea.destroy()
        this.areaTextGroup.eachOverlay(item => {
          if (item && item.getText() === extData.name) {
            this.areaTextGroup.removeOverlay(item)
          }
        })
      } else {
        this.currentArea.setExtData(extData)
        this.currentArea.setOptions(defaultSetting)
        this.currentArea.setPath(defaultSetting.area.path || [])
        this.handleAreaTitle()
        // 如果之前清除过, 重新渲染
        if (!this.currentArea.getOptions().map) {
          this.map.add(this.areaGroup)
        }
      }
      this.subscribe.execute('closeEditor', {
        type: 'editor',
        target: this.currentArea,
        areaSetting: defaultSetting
      })
      this.editor.close()
      this.stack = null
      this.editor = null
      this.currentArea = null
    })
  }
}
