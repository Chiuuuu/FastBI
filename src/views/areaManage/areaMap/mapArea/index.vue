<template>
  <a-spin :spinning="spinning" tip="地图加载中" class="map-area">
    <!-- 地图载体(修改了id记得修改AreaInfo里的挂载函数) -->
    <div id="mapArea" style="width:100%;height:100%"></div>

    <!-- 片区搜索下拉框 -->
    <div class="map-area-searchbar">
      <a-button
        class="searchbar-btn"
        icon="search"
        @click="showSearch = !showSearch"
      ></a-button>
      <div :class="['bar-select', { show: showSearch }]">
        <a-select style="width: 80px" v-model="searchType">
          <a-select-option value="company">分公司</a-select-option>
          <a-select-option value="area">片区</a-select-option>
        </a-select>

        <a-select
          v-if="searchType === 'company'"
          class="area"
          :value="companyId"
          placeholder="输入关键字搜索"
          show-search
          allowClear
          :filter-option="filterOption"
          @change="handleSearch"
          @pressEnter="handleSearch"
        >
          <a-select-option
            v-for="item in companyList"
            :key="item.id"
            :value="item.id"
            >{{ item.name }}</a-select-option
          >
        </a-select>
        <a-select
          v-if="searchType === 'area'"
          class="area"
          :value="areaId"
          placeholder="输入关键字搜索"
          show-search
          allowClear
          :filter-option="filterOption"
          @change="handleSearch"
          @pressEnter="handleSearch"
        >
          <a-select-option
            v-for="item in areaList"
            :key="item.id"
            :value="item.id"
            :disabled="validDrawn(item)"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </div>
    </div>

    <!-- 右侧操作栏 -->
    <div v-if="mode === 'edit' && floor === 1" class="map-area-toolbar">
      <a-tooltip title="绘制片区">
        <a-button
          icon="block"
          :disabled="disabledToolbar"
          @click="handleOpenModal('draw')"
        />
      </a-tooltip>
      <a-tooltip title="编辑片区">
        <a-button
          icon="edit"
          :disabled="disabledToolbar"
          @click="handleOpenModal('edit')"
        />
      </a-tooltip>
      <a-tooltip title="删除片区">
        <a-button
          icon="delete"
          :disabled="disabledToolbar"
          @click="handleOpenModal('delete')"
        />
      </a-tooltip>

      <!-- 编辑模式的操作栈按钮 -->
      <div
        v-if="mapInstance"
        :class="['edit-toolbar', { show: showEdit }]"
        show-search
        :filter-option="filterOption"
      >
        <a-button
          :disabled="!mapInstance.stack || mapInstance.stack.stack.length === 0"
          size="small"
          @click="mapInstance.undoStack()"
          >撤销</a-button
        >
        <a-button
          :disabled="!mapInstance.stack || mapInstance.stack.log.length === 0"
          size="small"
          @click="mapInstance.redoStack()"
          >恢复</a-button
        >
        <a-button size="small" @click="handleCloseEdit">取消</a-button>
        <a-button size="small" @click="handleSaveEdit">保存</a-button>
      </div>
    </div>

    <a-button
      class="map-area-back"
      type="primary"
      v-show="floor > 0 && !disabledToolbar"
      @click="backFloor"
      >返回上一层</a-button
    >
    <a-button
      class="map-area-back"
      type="primary"
      v-show="showCancelDraw"
      @click="handleCancelDraw"
      >取消绘制</a-button
    >

    <!-- 弹窗选择目标片区(绘制, 编辑, 删除) -->
    <a-modal
      :visible="visible"
      title="选择片区"
      @cancel="handleCancelModal"
      @ok="handleOk"
    >
      <a-form-model
        ref="form"
        :model="form"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 20 }"
        :rules="{ selectId: [{ required: true, message: '请选择目标片区' }] }"
      >
        <a-form-model-item label="片区名称" prop="selectId">
          <!-- 选择绘制片区 -->
          <a-select
            v-if="visibleType === 'draw'"
            v-model="form.selectId"
            style="width: 100%"
            show-search
            placeholder="请选择需要绘制的片区"
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="item in undrawList"
              :key="item.id"
              :value="item.id"
              >{{ item.name }}</a-select-option
            >
          </a-select>

          <!-- 选择编辑片区 -->
          <a-select
            v-else-if="visibleType === 'edit'"
            v-model="form.selectId"
            style="width: 100%"
            show-search
            placeholder="请选择需要编辑的已绘制片区"
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="item in drawnList"
              :key="item.id"
              :value="item.id"
              >{{ item.name }}</a-select-option
            >
          </a-select>

          <!-- 选择删除片区 -->
          <a-select
            v-else-if="visibleType === 'delete'"
            v-model="form.selectId"
            style="width: 100%"
            show-search
            placeholder="请选择需要删除的已绘制片区"
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="item in drawnList"
              :key="item.id"
              :value="item.id"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 弹窗配置片区样式 -->
    <AreaInfo :type="infoType" :data="infoData" :show.sync="showInfo" />
    <AreaSetting
      :data="currentArea"
      :show.sync="showSetting"
      @save="handleSaveSetting"
    />
  </a-spin>
</template>

<script>
import MapEditor from './utils/mapApi'
import AreaSetting from './modals/setting.vue'
import AreaInfo from './modals/info.vue'
import { BaseSetting, MapSetting } from './utils/baseSetting'
import { deepClone } from '@/utils/deepClone'
import mockData from './utils/mock'

export default {
  name: 'mapArea',
  components: {
    AreaSetting,
    AreaInfo
  },
  props: {
    mode: {
      type: String,
      default: 'preview'
    }
  },
  data() {
    return {
      spinning: false,
      mapInstance: null, // 地图编辑器实例
      currentArea: {}, // 当前配置的片区
      markers: [],
      companyId: undefined,
      areaId: undefined,
      companyList: [], // 行政区(分公司)列表
      areaList: [], // 片区列表

      searchType: 'company', // 搜索下拉框类别(分公司 | 片区)
      showSearch: false, // 搜索下拉框
      showEdit: false, // 操作栏
      showSetting: false, // 弹窗配置片区样式
      showInfo: false, // 弹窗配置片区样式
      showCancelDraw: false, // 取消绘制 按钮
      disabledToolbar: false, // 禁用操作栏

      visible: false, // 弹窗选择片区
      visibleType: '', // 控制下拉框类别(绘制,编辑,删除)
      form: {
        selectId: undefined
      },

      infoType: 'polygon', // | marker 查看数据类型
      infoData: {}, // 查看信息的对象

      floor: 0, // 当前显示层级(控制'返回上一层'按钮) 0: company | 1: polygon | 2: marker
      floorZoomAndCenter: {
        zoom: MapSetting.zoom,
        center: MapSetting.center
      }
    }
  },
  computed: {
    drawnList() {
      if (!this.mapInstance || !this.mapInstance.polygonList) return []
      const list = []
      this.mapInstance.polygonList.eachOverlay(item => {
        if (item.getBounds()) {
          const id = item.getExtData().id
          const target = this.areaList.find(a => a.id === id)
          target && list.push(target)
        }
      })
      return list
    },
    undrawList() {
      if (!this.mapInstance || !this.mapInstance.polygonList) return []
      const list = []
      this.mapInstance.polygonList.eachOverlay(item => {
        if (!item.getBounds()) {
          const id = item.getExtData().id
          const target = this.areaList.find(a => a.id === id)
          target && list.push(target)
        }
      })
      return list
    }
  },
  watch: {
    '$parent.fullScreen'() {
      if (this.mapInstance) {
        this.mapInstance.updateContextMenu(this.handleContextMenu())
      }
    }
  },
  mounted() {
    this.companyList = mockData
    this.areaList = mockData.reduce(
      (pre, next) => pre.concat(next.areaList),
      []
    )
    this.initMapInstance()
  },
  methods: {
    handleContextMenu() {
      const self = this
      let contextMenu = []
      if (this.mode === 'edit' && !this.$parent.fullScreen) {
        contextMenu = [
          {
            text: '查看信息',
            callback(polygon) {
              const id = polygon.getExtData().id
              self.infoType = 'polygon'
              self.infoData = self.areaList.find(item => item.id === id)
              self.showInfo = true
            }
          },
          {
            text: '编辑片区',
            callback(polygon) {
              const id = polygon.getExtData().id
              if (self.showEdit && id !== self.currentArea.id) {
                return self.$message.error('请先结束当前片区编辑')
              }
              self.currentArea = self.areaList.find(item => item.id === id)
              self.handleOpenEditor(polygon)
              self.mapInstance.initMarkers(self.currentArea)
              self.disabledToolbar = true
            }
          },
          {
            text: '配置样式',
            callback(polygon) {
              const id = polygon.getExtData().id
              if (self.showEdit && id !== self.currentArea.id) {
                return self.$message.error('请先结束当前片区编辑')
              }
              self.currentArea = self.areaList.find(item => item.id === id)
              self.showSetting = true
            }
          },
          {
            text: '移除片区',
            callback(polygon) {
              const id = polygon.getExtData().id
              if (self.showEdit && id !== self.currentArea.id) {
                return self.$message.error('请先结束当前片区编辑')
              }
              self.currentArea = self.areaList.find(item => item.id === id)
              self.$confirm({
                title: '确认提示',
                content: '移除片区将会删除当前片区数据，确定要移除吗',
                onOk: () => {
                  self.currentArea.setting.polygon = deepClone(
                    BaseSetting.polygon
                  )
                  self.mapInstance.removePolygon(id)
                  this.showEdit = false
                }
              })
            }
          }
        ]
      } else {
        contextMenu = [
          {
            text: '查看信息',
            callback: (polygon) => {
              const id = polygon.getExtData().id
              self.infoType = 'polygon'
              self.infoData = self.areaList.find(item => item.id === id)
              self.showInfo = true
            }
          }
        ]
      }
      return contextMenu
    },
    // 初始化地图实例
    initMapInstance() {
      this.mapInstance = new MapEditor({
        container: 'mapArea',
        mapOptions: Object.assign({}, MapSetting),
        contextMenu: this.handleContextMenu()
      })

      // 订阅相关事件
      this.mapInstance.subscribe.on('click', ({ type, target }) => {
        if (type === 'marker') {
          const data = target.getExtData()
          const id = data.id
          const parentId = data.parentId
          this.infoType = 'marker'
          const area = this.areaList.find(item => item.id === parentId)
          const marker = area.setting.marker.list.find(item => item.id === id)
          this.infoData = marker
          this.showInfo = true
        }
      })
      this.mapInstance.subscribe.on('dblclick', ({ type, target }) => {
        if (this.showEdit) {
          return this.$message.error('请先结束当前片区编辑')
        }
        const fit = this.mapInstance.map.getFitZoomAndCenterByOverlays([target])
        this.mapInstance.map.setZoomAndCenter(...fit)
        // 双击行政区, 显示片区
        if (type === 'company') {
          this.spinning = true
          setTimeout(() => {
            this.spinning = false
          }, 500)
          this.handleFocusCompany(target)
        }

        // 双击片区, 显示标记点
        if (type === 'polygon') {
          this.handleFocusPolygon(target.getExtData().id)
        }
      })
      this.mapInstance.subscribe.on('saveEditor', ({ setting }) => {
        this.currentArea.setting.polygon = setting.polygon
        this.currentArea = {}
        this.showEdit = false
        this.disabledToolbar = false
        this.mapInstance.updataMarkers()
      })
      this.mapInstance.subscribe.on('closeEditor', ({ setting }) => {
        this.showEdit = false
        this.disabledToolbar = false
        this.mapInstance.updataMarkers()
      })
      this.mapInstance.subscribe.on(
        'remove',
        ({ type, target, polygonSetting }) => {
          if (type === 'polygon') {
            const id = target.getExtData().id
            this.areaList.forEach(item => {
              if (item.id === id) {
                item.setting.polygon = polygonSetting
              }
            })
          }
        }
      )
    },
    // 判断片区是否已绘制
    validDrawn(item) {
      if (!this.mapInstance || !this.mapInstance.polygonList) return false
      let target = null
      this.mapInstance.polygonList.eachOverlay(p => {
        if (p.getExtData().id === item.id) {
          target = p
        }
      })
      // console.log(item.name, !target || !target.getBounds())
      return !target || !target.getBounds()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 返回上一层
    backFloor() {
      let index = --this.floor
      if (index === 0) { // 行政区层
        // 清空下拉框
        this.companyId = undefined
        this.areaId = undefined
        // 重新绘制行政区轮廓
        this.areaList = mockData.reduce(
          (pre, next) => pre.concat(next.areaList),
          []
        )
        this.mapInstance.updateArea([])
        this.mapInstance.companyGroup.show()
        this.mapInstance.companyTextGroup.show()

        // 中心点及缩放比
        this.floorZoomAndCenter = this.$options.data().floorZoomAndCenter
        this.mapInstance.map.setZoomAndCenter(
          this.floorZoomAndCenter.zoom,
          this.floorZoomAndCenter.center
        )

        // 手动清空片区标题
        this.mapInstance.clearPolygonTitle()
      } else if (index === 1) { // 片区层
        this.areaId = undefined
        // 重新绘制片区层
        this.mapInstance.updateArea(this.areaList)
        this.mapInstance.map.setZoomAndCenter(
          this.floorZoomAndCenter.zoom,
          this.floorZoomAndCenter.center
        )
        this.currentArea = {}
      }
    },
    // 打开弹窗
    handleOpenModal(type) {
      this.visible = true
      this.visibleType = type
    },
    // 关闭弹窗
    handleCancelModal() {
      this.visible = false
      this.visibleType = ''
      this.form.selectId = undefined
    },
    // 取消绘制
    handleCancelDraw() {
      this.currentArea = {}
      this.mapInstance.mouseTool && this.mapInstance.mouseTool.close(true)
      this.showCancelDraw = false
      this.disabledToolbar = false
      this.mapInstance.updataMarkers()
    },
    // 弹窗确认
    handleOk() {
      this.$refs.form.validate(ok => {
        if (ok) {
          this.currentArea = this.areaList.find(
            item => item.id === this.form.selectId
          )
          const backup = deepClone(this.currentArea)
          if (this.visibleType === 'draw') {
            const setting = {
              polygon: deepClone(BaseSetting.polygon),
              marker: backup.setting.marker
            }
            // 绘制新片区
            this.showCancelDraw = true
            this.disabledToolbar = true
            const data = {
              ...backup,
              setting
            }
            this.mapInstance.drawPolygon({
              data,
              polygonSetting: setting.polygon,
              drawn: polygon => {
                // 小于3个顶点不构成片区
                const options = polygon.getOptions()
                if (options.path && options.path.length < 3) {
                  this.handleCancelDraw()
                  return
                }
                // 绘制完成, 进入当前片区的编辑模式
                this.mapInstance.mouseTool.close()
                this.showCancelDraw = false
                this.handleOpenEditor(polygon)
              }
            })
            this.mapInstance.initMarkers(this.currentArea)
          } else if (this.visibleType === 'edit') {
            // 编辑片区
            this.disabledToolbar = true
            this.handleOpenEditor()
            this.mapInstance.initMarkers(this.currentArea)
          } else if (this.visibleType === 'delete') {
            this.mapInstance.removePolygon(this.currentArea.id)
          }
          this.handleCancelModal()
        }
      })
    },
    // 开启编辑器
    handleOpenEditor(polygon) {
      this.showEdit = true
      this.mapInstance.editPolygon({
        polygon: polygon || this.currentArea
      })
    },
    // 点击取消编辑
    handleCloseEdit() {
      this.mapInstance.closeEditor()
    },
    // 点击保存编辑
    handleSaveEdit() {
      this.mapInstance.saveEditor()
    },
    // 保存片区样式
    handleSaveSetting(setting) {
      if (!this.mapInstance.editor) {
        this.handleOpenEditor()
        this.mapInstance.initMarkers(this.currentArea)
        this.disabledToolbar = true
      }
      this.currentArea.setting = setting
      this.mapInstance.updateStyle(setting)
    },
    // 聚焦行政区(分公司)
    handleFocusCompany(target) {
      this.floor = 1
      // 获取该分公司的片区列表
      const company = this.companyList.find(
        item => item.id === target.getExtData().id
      )
      if (!company) return
      this.areaList = company.areaList
      this.mapInstance.focusCompany(target, this.areaList, fit => {
        this.mapInstance.map.setZoomAndCenter(...fit)
        this.floorZoomAndCenter = {
          zoom: fit[0],
          center: fit[1]
        }
      })
    },
    // 聚焦多边形
    handleFocusPolygon(id) {
      this.floor = 2
      this.currentArea = this.areaList.find(item => item.id === id)
      this.mapInstance.focusPolygon(id, this.currentArea)
    },
    handleSearch(id) {
      if (this.showEdit) {
        return this.$message.error('请先结束当前片区编辑')
      }
      if (this.searchType === 'area') {
        this.areaId = id
        this.companyId = undefined
        if (!id) return
        // 聚焦片区
        if (this.floor === 1) {
          this.handleFocusPolygon(id)
          return
        }
        // 找到片区归属分公司的id
        const company = this.getCompanyIdByAreaId(id)
        if (!company) return
        const companyId = company.id
        let target = null
        this.mapInstance.companyGroup.eachOverlay(item => {
          if (item.getExtData().id === companyId) {
            target = item
          }
        })
        if (!target) return
        this.handleFocusCompany(target)
        this.handleFocusPolygon(id)
      } else if (this.searchType === 'company') {
        this.companyId = id
        this.areaId = undefined
        if (!id) return
        // 聚焦分公司
        let target = null
        this.mapInstance.companyGroup.eachOverlay(item => {
          if (item.getExtData().id === id) {
            target = item
          }
        })
        if (target) {
          this.handleFocusCompany(target)
        }
      }
    },
    // 根据片区id获取分公司id
    getCompanyIdByAreaId(id) {
      for (const company of this.companyList) {
        if (company.areaList.some(item => item.id === id)) {
          return company
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.bar-select {
  display: flex;
  justify-content: flex-end;
  overflow: hidden;
  width: 0;
  position: absolute;
  right: 31px;
  top: 0;
  transition: width 0.3s ease-in;
  @{deep} .ant-select-arrow {
    display: none;
  }
  &.show {
    @{deep} .ant-select-arrow {
      display: inline-block;
    }
    width: 280px;
    .area {
      width: 200px;
    }
  }
  .area {
    width: 0;
    transition: width 0.3s ease-in;
  }
}
.edit-toolbar {
  display: none;
  width: 200px;
  position: absolute;
  right: 31px;
  top: 32px;
  text-align: right;
  &.show {
    display: block;
  }
}
.map-area-searchbar {
  position: absolute;
  right: 20px;
  top: 20px;

  .searchbar-btn {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 101;
  }
}
.map-area-toolbar {
  position: absolute;
  top: 72px;
  right: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  width: 32px;
  height: 96px;
  background: #fff;
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;

  .icon {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
  }
}
.map-area-back {
  position: absolute;
  right: 20px;
  bottom: 20px;
}
.map-area-cancel-draw {
  position: absolute;
  right: 20px;
  bottom: 50px;
}
</style>
