<template>
  <a-spin :spinning="spinning || selectLoading" tip="地图加载中" class="map-area">
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
          :value="companyName"
          placeholder="输入关键字搜索"
          show-search
          allowClear
          :filter-option="filterOption"
          @change="handleSearch"
          @pressEnter="handleSearch"
        >
          <a-spin v-if="selectLoading" slot="notFoundContent" size="small" />
          <a-select-option
            v-for="(item, index) in companyList"
            :key="index"
            :value="item.headOfficeName"
            >{{ item.headOfficeName }}</a-select-option
          >
        </a-select>
        <a-select
          v-if="searchType === 'area'"
          class="area"
          :value="areaName"
          placeholder="输入关键字搜索"
          show-search
          allowClear
          :filter-option="filterOption"
          @change="handleSearch"
          @pressEnter="handleSearch"
        >
          <a-spin v-if="selectLoading" slot="notFoundContent" size="small" />
          <a-select-option
            v-for="(item, index) in areaList"
            :key="index"
            :value="item"
            :disabled="validDrawn(item)"
            >{{ item }}</a-select-option
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
              v-for="(item, index) in undrawList"
              :key="index"
              :value="item"
              >{{ item }}</a-select-option
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
              :value="item.name"
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
              :value="item.name"
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
      selectLoading: false,
      mapInstance: null, // 地图编辑器实例
      currentArea: {}, // 当前配置的片区
      companyName: undefined,
      areaName: undefined,
      companyList: [], // 行政区(分公司)列表
      areaList: [], // 片区列表
      drawnList: [], // 已绘制片区列表
      markerList: [], // 网格列表

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
    undrawList() {
      // if (!this.mapInstance || !this.mapInstance.polygonList) return []
      // const list = []
      // this.mapInstance.polygonList.eachOverlay(item => {
      //   if (!item.getBounds()) {
      //     const id = item.getExtData().id
      //     const target = this.areaList.find(a => a.id === id)
      //     target && list.push(target)
      //   }
      // })
      // return list
      return this.areaList.filter(item => !this.drawnList.some(n => n.name === item))
    }
  },
  watch: {
    '$parent.fullScreen'() {
      if (this.mapInstance) {
        this.mapInstance.updateContextMenu(this.handleContextMenu())
      }
    },
    floor() { // 每次层级变化,重新渲染右键
      this.mapInstance.updateContextMenu(this.handleContextMenu())
    }
  },
  async mounted() {
    await this.handleGetCompanyList()
    await this.getAreaSettingList()
    this.initMapInstance()
  },
  methods: {
    // 获取分公司列表
    async handleGetCompanyList() {
      this.selectLoading = true
      this.companyList = []
      this.areaList = []
      const res = await this.$server.mapArea.getCompanyList().finally(() => {
        this.selectLoading = false
      })
      if (res && res.code === 200) {
        this.companyList = res.data
        this.areaList = res.data.reduce((prev, next) => {
          return prev.concat(next.sections)
        }, [])
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    // 获取片区列表
    async handleGetAreaList(name) {
      this.selectLoading = true
      this.areaList = []
      const res = await this.$server.mapArea.getAreaList({ name }).finally(() => {
        this.selectLoading = false
      })
      if (res && res.code === 200) {
        this.areaList = res.data
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    // 获取已绘制的片区
    async getAreaSettingList(name = '') {
      this.spinning = true
      const res = await this.$server.mapArea.getAreaSettingList({
        name
      }).catch(() => {
        return 'error'
      }).finally(() => {
        this.spinning = false
      })
      if (res && res.code === 200) {
        this.drawnList = res.data
      } else {
        this.$message.error(res.msg || '请求错误')
        return 'error'
      }
    },
    // 获取片区网格点位
    async getMarkerList(params) {
      if (!params) {
        params = {
          section: this.currentArea.name
        }
      }
      this.spinning = true
      const res = await this.$server.mapArea.getMarkerList(params)
      .finally(() => {
        this.spinning = false
      })
      if (res && res.code === 200) {
        return res.data
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    // 添加绘制的片区
    async addAreaSetting() {
      if (!this.currentArea || !this.currentArea.name) return
      this.spinning = true
      const { name, setting } = this.currentArea
      const res = await this.$server.mapArea.addAreaSetting({
        name,
        setting
      }).catch(() => {
        return 'error'
      }).finally(() => {
        this.spinning = false
      })
      if (res && res.code === 200) {
        this.$message.success('保存成功')
        const id = res.msg
        this.drawnList.push({
          id,
          name,
          setting
        })
        return id
      } else {
        this.$message.error(res.msg || '请求错误')
        return 'error'
      }
    },
    // 更新绘制的片区
    async updateAreaSetting() {
      if (!this.currentArea || !this.currentArea.id) return
      this.spinning = true
      const { id, name, setting } = this.currentArea
      const res = await this.$server.mapArea.updateAreaSetting({
        id,
        name,
        setting
      }).catch(() => {
        return 'error'
      }).finally(() => {
        this.spinning = false
      })
      if (res && res.code === 200) {
        this.$message.success('保存成功')
      } else {
        this.$message.error(res.msg || '请求错误')
        return 'error'
      }
    },
    // 删除绘制的片区
    async deleteAreaSetting(id) {
      this.spinning = true
      const res = await this.$server.mapArea.deleteAreaSetting(id)
      .finally(() => {
        this.spinning = false
      })
      if (res && res.code === 200) {
        this.$message.success('删除成功')
        this.mapInstance.removePolygon(this.currentArea.name)
        for (let i = 0; i < this.drawnList.length; i++) {
          const item = this.drawnList[i]
          if (item.id === id) {
            this.drawnList.splice(i, 1)
            this.currentArea = {}
            break
          }
        }
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    handleContextMenu() {
      const self = this
      let contextMenu = []
      if (self.floor === 1 && self.mode === 'edit' && !self.$parent.fullScreen) {
        contextMenu = [
          {
            text: '查看信息',
            callback: async ({ type, target }) => {
              self.infoType = type
              if (type === 'company') {
                const data = target.getExtData()
                // 增城从化特殊处理(需调接口获取网格数量)
                if ((data.name === '从化' || data.name === '增城') && !data.areaCnt) {
                  self.markerList = await self.getMarkerList({
                    headOffice: data.name
                  }) || []
                  data.areaCnt = self.markerList.length
                }
                self.infoType = 'company'
                self.infoData = data
              }
              if (type === 'polygon') {
                const name = target.getExtData().name
                const data = self.drawnList.find(item => item.name === name)
                if (data) {
                  self.infoData = data
                } else {
                  self.infoData = self.currentArea
                }
              }
              if (type === 'marker') {
                self.infoType = 'marker'
                const data = target.getExtData()
                self.infoData = data
              }
              self.showInfo = true
            }
          },
          {
            text: '编辑片区',
            callback: async function({ type, target }) {
              const name = target.getExtData().name
              if (self.showEdit) {
                return self.$message.error('请先结束当前片区编辑')
              }
              self.currentArea = self.drawnList.find(item => item.name === name)
              self.handleOpenEditor(target)
              self.disabledToolbar = true
              self.markerList = await self.getMarkerList()
              if (self.markerList.length) {
                self.mapInstance.initMarkers(self.markerList, self.currentArea)
              }
            }
          },
          {
            text: '配置样式',
            callback({ type, target }) {
              const name = target.getExtData().name
              if (self.showEdit && name !== self.currentArea.name) {
                return self.$message.error('请先结束当前片区编辑')
              }
              const data = self.drawnList.find(item => item.name === name)
              if (data) {
                self.currentArea = data
              }
              self.showSetting = true
            }
          },
          {
            text: '移除片区',
            callback({ type, target }) {
              const name = target.getExtData().name
              if (self.showEdit) {
                return self.$message.error('请先结束当前片区编辑')
              }
              const data = self.drawnList.find(item => item.name === name)
              if (data) {
                self.currentArea = data
              }
              self.$confirm({
                title: '确认提示',
                content: '移除片区将会删除当前片区数据，确定要移除吗',
                onOk: () => {
                  // self.currentArea.setting.polygon = deepClone(
                  //   BaseSetting.polygon
                  // )
                  self.showEdit = false
                  self.deleteAreaSetting(self.currentArea.id)
                }
              })
            }
          }
        ]
      } else {
        contextMenu = [
          {
            text: '查看信息',
            callback: async ({ type, target }) => {
              self.infoType = type
              if (type === 'company') {
                const data = target.getExtData()
                // 增城从化特殊处理(需调接口获取网格数量)
                if ((data.name === '从化' || data.name === '增城') && !data.areaCnt) {
                  self.markerList = await self.getMarkerList({
                    headOffice: data.name
                  }) || []
                  data.areaCnt = self.markerList.length
                }
                self.infoType = 'company'
                self.infoData = data
              }
              if (type === 'polygon') {
                const name = target.getExtData().name
                const data = self.drawnList.find(item => item.name === name)
                if (data) {
                  self.infoData = data
                } else {
                  self.infoData = self.currentArea
                }
              }
              if (type === 'marker') {
                self.infoType = 'marker'
                const data = target.getExtData()
                self.infoData = data
              }
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
        contextMenu: this.handleContextMenu(),
        companyList: this.companyList
      })

      // 订阅相关事件
      this.mapInstance.subscribe.on('click', async ({ type, target }) => {
        if (type === 'company') {
          const data = target.getExtData()
          // 增城从化特殊处理(需调接口获取网格数量)
          if (data.name === '从化' || data.name === '增城') {
            this.markerList = await this.getMarkerList({
              headOffice: data.name
            }) || []
            data.areaCnt = this.markerList.length
          }
          this.infoType = 'company'
          this.infoData = data
          this.showInfo = true
        }
        if (type === 'area') {
          this.infoType = 'area'
          const data = target.getExtData()
          this.infoData = data
          // const data = target
          // this.infoData = data
          this.showInfo = true
        }
        if (type === 'marker') {
          this.infoType = 'marker'
          const data = target.getExtData()
          this.infoData = data
          // const data = target
          // this.infoData = data
          this.showInfo = true
        }
      })
      this.mapInstance.subscribe.on('dblclick', ({ type, target }) => {
        if (this.showEdit) {
          return this.$message.error('请先结束当前片区编辑')
        }
        // 双击行政区, 显示片区
        if (type === 'company') {
          this.handleFocusCompany(target)
        }

        // 双击片区, 显示网格点
        if (type === 'polygon') {
          this.handleFocusPolygon(target.getExtData().name)
        }
      })
      this.mapInstance.subscribe.on('focus', async ({ type, target, fit }) => {
        // 聚焦公司
        if (type === 'company') {
          this.mapInstance.map.setZoomAndCenter(...fit)
          this.floorZoomAndCenter = {
            zoom: fit[0],
            center: fit[1]
          }
        }
        // 聚焦片区
        if (type === 'polygon') {
          const name = target.getExtData().name
          this.markerList = await this.getMarkerList({
            section: name
          }) || []
          if (this.markerList.length) {
            this.mapInstance.map.setZoomAndCenter(...fit)
            this.mapInstance.initMarkers(this.markerList, this.currentArea)
          }
        }
      })
      this.mapInstance.subscribe.on('saveEditor', async ({ setting }) => {
        const { path } = setting.polygon
        if (!path || !path.length) {
          return this.$message.error('请至少绘制3个点')
        }
        // 备份网格点个数, 存在前端setting大文本, 不然需要调一次后端接口获取
        const markerLen = this.currentArea.setting.marker.cnt
        this.currentArea.setting = setting
        this.currentArea.setting.marker.cnt = markerLen
        let res = null
        if (this.currentArea.id) {
          res = await this.updateAreaSetting()
        } else {
          res = await this.addAreaSetting()
        }
        if (res !== 'error') {
          if (!this.currentArea.id) {
            this.currentArea.id = res
          }
          this.currentArea = {}
          this.showEdit = false
          this.disabledToolbar = false
          this.mapInstance.updateMarkers()
        }
      })
      this.mapInstance.subscribe.on('closeEditor', ({ setting }) => {
        this.showEdit = false
        this.disabledToolbar = false
        this.mapInstance.updateMarkers()
      })
      // this.mapInstance.subscribe.on(
      //   'remove',
      //   ({ type, target, polygonSetting }) => {
          // if (type === 'polygon') {
          //   const name = target.getExtData().name
          //   this.areaList.forEach(item => {
          //     if (item.name === name) {
          //       item.setting.polygon = polygonSetting
          //     }
          //   })
          // }
        // }
      // )
    },
    // 判断片区是否已绘制
    validDrawn(item) {
      return !this.drawnList.some(n => n.name === item)
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
      // 针对没有片区的分公司, 直接回到首层
      if (!this.areaList.length && this.floor === 1) {
        index = --this.floor
      }
      if (index === 0) { // 行政区层
        // 清空下拉框
        this.companyName = undefined
        this.areaName = undefined
        // 重新绘制行政区轮廓
        this.handleGetCompanyList()
        this.getAreaSettingList()
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
        this.areaName = undefined
        // 重新绘制片区层
        this.mapInstance.updateArea(this.drawnList)
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
      this.mapInstance.updateMarkers()
    },
    // 弹窗确认
    handleOk() {
      this.$refs.form.validate(async (ok) => {
        if (ok) {
          const name = this.areaList.find(
            item => item === this.form.selectId
          )
          this.currentArea = this.drawnList.find(item => item.name === name)
          // 绘制片区确认
          if (this.visibleType === 'draw') {
            this.currentArea = {
              name,
              setting: deepClone(BaseSetting)
            }
            // 绘制新片区
            this.showCancelDraw = true
            this.disabledToolbar = true
            const setting = deepClone(BaseSetting)
            const data = {
              name,
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
            this.handleCancelModal()
            this.markerList = await this.getMarkerList({
              section: name
            }) || []
            if (this.markerList.length) {
              this.mapInstance.initMarkers(this.markerList, this.currentArea)
            }
          } else if (this.visibleType === 'edit') {
            // 编辑片区
            this.disabledToolbar = true
            this.handleOpenEditor()
            this.markerList = await this.getMarkerList() || []
            if (this.markerList.length) {
              this.mapInstance.initMarkers(this.markerList, this.currentArea)
            }
            this.handleCancelModal()
          } else if (this.visibleType === 'delete') {
            // 删除片区
            this.deleteAreaSetting(this.currentArea.id)
            this.handleCancelModal()
          }
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
      const name = this.currentArea.name
      const newPolygon = this.drawnList.find(item => item.name === name)
      if (!newPolygon) {
        this.mapInstance.removePolygon(name)
      }
    },
    // 点击保存编辑
    handleSaveEdit() {
      this.mapInstance.saveEditor()
    },
    // 保存片区样式
    async handleSaveSetting(setting) {
      if (!this.mapInstance.editor) {
        this.handleOpenEditor()
        this.disabledToolbar = true
      }
      this.currentArea.setting = setting
      this.markerList = await this.getMarkerList({
        section: this.currentArea.name
      }) || []
      this.mapInstance.updateStyle(this.markerList, setting)
    },
    // 聚焦行政区(分公司)
    async handleFocusCompany(target) {
      // 获取该分公司的片区列表
      const name = target.getExtData().name
      const company = this.companyList.find(item => item.headOfficeName === name)
      if (!company) return
      await this.handleGetAreaList(company.headOfficeName)
      // 如果该公司下有片区, 则渲染片区
      if (this.areaList.length) {
        const res = await this.getAreaSettingList(company.headOfficeName)
        if (res !== 'error') {
          this.mapInstance.focusCompany(target, this.drawnList)
        }
        this.floor = 1
      } else {
        // 没有片区, 直接渲染网格点
        this.drawnList = []
        this.mapInstance.focusCompany(target, this.drawnList)
        this.markerList = await this.getMarkerList({
          headOffice: company.headOfficeName
        }) || []
        if (this.markerList.length) {
          this.mapInstance.initMarkers(this.markerList, this.currentArea)
        }
        this.floor = 2
      }
    },
    // 聚焦多边形
    handleFocusPolygon(name) {
      this.floor = 2
      this.currentArea = this.drawnList.find(item => item.name === name)
      this.mapInstance.focusPolygon(name)
    },
    async handleSearch(name) {
      if (this.showEdit) {
        return this.$message.error('请先结束当前片区编辑')
      }
      if (this.searchType === 'area') {
        this.areaName = name
        this.companyName = undefined
        if (!name) return
        // 聚焦片区
        if (this.floor === 1) {
          this.handleFocusPolygon(name)
          return
        }
        // 找到片区归属分公司的id
        const company = this.getCompanyByAreaName(name)
        if (!company) return
        let companyName = company.headOfficeName
        let target = null
        this.mapInstance.companyGroup.eachOverlay(item => {
          if (companyName === item.getExtData().name) {
            target = item
          }
        })
        if (!target) return
        await this.handleFocusCompany(target)
        this.handleFocusPolygon(name)
      } else if (this.searchType === 'company') {
        this.companyName = name
        this.areaName = undefined
        if (!name) return
        // 聚焦分公司
        let target = null
        this.mapInstance.companyGroup.eachOverlay(item => {
          if (name === item.getExtData().name) {
            target = item
          }
        })
        if (target) {
          this.handleFocusCompany(target)
        }
      }
    },
    // 根据片区id获取分公司id
    getCompanyByAreaName(name) {
      for (const company of this.companyList) {
        if (company.sections.some(item => item === name)) {
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
