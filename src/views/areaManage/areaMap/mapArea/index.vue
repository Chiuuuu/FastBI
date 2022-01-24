<template>
  <a-spin
    :spinning="spinning || selectLoading"
    tip="地图加载中"
    id="map"
    class="map-area"
    @contextmenu.prevent
  >
    <!-- 地图载体(修改了id记得修改AreaInfo里的挂载函数) -->
    <div id="mapArea" style="width:100%;height:100%" @contextmenu.prevent></div>

    <!-- 片区搜索下拉框 -->
    <div class="map-area-searchbar">
      <a-button
        type="primary"
        class="searchbar-btn"
        icon="search"
        @click="showSearch = !showSearch"
      ></a-button>
      <div :class="['bar-select', { show: showSearch }]">
        <a-select
          style="width: 80px"
          v-model="searchType"
          :getPopupContainer="getPopupContainer"
          @change="selected = undefined"
        >
          <a-select-option value="company">分公司</a-select-option>
          <a-select-option value="area">片区</a-select-option>
          <a-select-option value="grid">网格</a-select-option>
        </a-select>

        <a-select
          class="area"
          :value="selected"
          placeholder="输入关键字搜索"
          show-search
          allowClear
          :filter-option="filterOption"
          :getPopupContainer="getPopupContainer"
          @change="handleSearch"
          @pressEnter="handleSearch"
        >
          <a-spin v-if="selectLoading" slot="notFoundContent" size="small" />
          <!-- 分公司选项 -->
          <template v-if="searchType === 'company'">
            <a-select-option
              v-for="(item, index) in companyList"
              :key="index"
              :value="item.headOfficeName"
              >{{ item.headOfficeName }}</a-select-option
            >
          </template>
          <!-- 片区选项 -->
          <template v-else-if="searchType === 'area'">
            <a-select-option
              v-for="(item, index) in areaList"
              :key="index"
              :value="item.section"
              :disabled="validDrawn(item.section)"
              >{{ item.section }}</a-select-option
            >
          </template>
          <!-- 网格选项 -->
          <template v-else-if="searchType === 'grid'">
            <a-select-option
              v-for="(item, index) in gridList"
              :key="index"
              :value="item.grid"
              >{{ item.grid }}</a-select-option
            >
          </template>
        </a-select>
      </div>
    </div>

    <!-- 右侧操作栏 -->
    <div
      v-if="mode === 'edit' && floor === 1 && !this.$parent.fullScreen"
      class="map-area-toolbar"
    >
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
        <a-button size="small" @click="handleStyleEdit">样式</a-button>
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
              :value="item.section"
              >{{ item.section }}</a-select-option
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

          <!-- 选择编辑片区样式 -->
          <a-select
            v-else-if="visibleType === 'style'"
            v-model="form.selectId"
            style="width: 100%"
            show-search
            placeholder="请选择需要编辑样式的已绘制片区"
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
      selected: undefined,
      mapInstance: null, // 地图编辑器实例
      currentArea: {}, // 当前配置的片区
      companyList: [], // 行政区(分公司)列表
      areaList: [], // 片区列表
      drawnList: [], // 已绘制片区列表
      gridList: [], // 网格列表
      buildingList: [], // 楼盘列表

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

      infoType: 'area', // | grid 查看数据类型
      infoData: {}, // 查看信息的对象

      focusTarget: {}, // 下钻对象(用于init事件初始化后继续下钻)
      floor: 0, // 当前显示层级(控制'返回上一层'按钮) 0: company | 1: area | 2: grid | 3: building
      floorZoomAndCenter: [
        {
          zoom: MapSetting.zoom,
          center: MapSetting.center
        }
      ]
    }
  },
  computed: {
    undrawList() {
      return this.areaList.filter(
        item => !this.drawnList.some(n => n.name === item.section)
      )
    }
  },
  watch: {
    '$parent.fullScreen'() {
      this.showInfo = false
      // if (this.mapInstance) {
      //   this.mapInstance.updateContextMenu(this.handleContextMenu())
      // }
    },
    floor() {
      this.showInfo = false
      // 每次层级变化,重新渲染右键
      // this.mapInstance.updateContextMenu(this.handleContextMenu())
    }
  },
  async mounted() {
    await this.handleGetCompanyList()
    await this.getAreaSettingList()
    this.initMapInstance()
  },
  methods: {
    getPopupContainer() {
      return document.querySelector('#map')
    },
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
        // 平铺树结构, 形成下拉框筛选项
        let gridList = []
        this.areaList = res.data.reduce((prev, next) => {
          const headOfficeName = next.headOfficeName
          const sectionList = next.section || []
          const res = sectionList.reduce(
            (p, n) =>
              p.concat(
                n.grid.map(g => ({
                  grid: g,
                  section: n.sectionName,
                  headOfficeName
                }))
              ),
            []
          )
          gridList = gridList.concat(res)
          return prev.concat(
            sectionList.map(item => ({
              headOfficeName,
              section: item.sectionName
            }))
          )
        }, [])
        this.gridList = gridList
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    // 获取片区列表
    async handleGetAreaList(name) {
      this.selectLoading = true
      this.areaList = []
      const res = await this.$server.mapArea
        .getAreaList({ name })
        .finally(() => {
          this.selectLoading = false
        })
      if (res && res.code === 200) {
        this.areaList = res.data.map(item => ({
          section: item,
          headOfficeName: name
        }))
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    // 获取已绘制的片区
    async getAreaSettingList(name = '') {
      this.spinning = true
      const res = await this.$server.mapArea
        .getAreaSettingList({
          name
        })
        .catch(() => {
          return 'error'
        })
        .finally(() => {
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
    async getGridList(params) {
      if (!params) {
        params = {
          section: this.currentArea.name
        }
      }
      this.spinning = true
      const res = await this.$server.mapArea.getGridList(params).finally(() => {
        this.spinning = false
      })
      if (res && res.code === 200) {
        return res.data
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    // 获取网格楼盘
    async getBuildingList(params) {
      if (!params) {
        params = {
          grid: this.currentArea.name
        }
      }
      this.spinning = true
      const res = await this.$server.mapArea
        .getBuildingList(params)
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
      const res = await this.$server.mapArea
        .addAreaSetting({
          name,
          setting
        })
        .catch(() => {
          return 'error'
        })
        .finally(() => {
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
      const res = await this.$server.mapArea
        .updateAreaSetting({
          id,
          name,
          setting
        })
        .catch(() => {
          return 'error'
        })
        .finally(() => {
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
      const res = await this.$server.mapArea
        .deleteAreaSetting(id)
        .finally(() => {
          this.spinning = false
        })
      if (res && res.code === 200) {
        this.$message.success('删除成功')
        this.mapInstance.removeArea(this.currentArea.name)
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
      if (
        self.floor === 1 &&
        self.mode === 'edit' &&
        !self.$parent.fullScreen
      ) {
        contextMenu = [
          {
            text: '查看信息',
            callback: async ({ type, target }) => {
              self.infoType = type
              if (type === 'company') {
                const data = target.getExtData()
                // 增城从化特殊处理(需调接口获取网格数量)
                const noSectionList = ['从化', '增城', '花都']
                if (noSectionList.includes(data.name) && !data.areaCnt) {
                  self.gridList =
                    (await self.getGridList({
                      headOffice: data.name
                    })) || []
                  data.areaCnt = self.gridList.length
                }
                self.infoType = 'company'
                self.infoData = data
              }
              if (type === 'area') {
                const name = target.getExtData().name
                const data = self.drawnList.find(item => item.name === name)
                if (data) {
                  self.infoData = data
                } else {
                  self.infoData = self.currentArea
                }
              }
              if (type === 'grid') {
                self.infoType = 'grid'
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
              self.gridList = await self.getGridList()
              if (self.gridList.length) {
                self.mapInstance.initGrid(self.gridList, self.currentArea)
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
                  // self.currentArea.setting.area = deepClone(
                  //   BaseSetting.area
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
                const noSectionList = ['从化', '增城', '花都']
                if (noSectionList.includes(data.name) && !data.areaCnt) {
                  self.gridList =
                    (await self.getGridList({
                      headOffice: data.name
                    })) || []
                  data.areaCnt = self.gridList.length
                }
                self.infoType = 'company'
                self.infoData = data
              }
              if (type === 'area') {
                const name = target.getExtData().name
                const data = self.drawnList.find(item => item.name === name)
                if (data) {
                  self.infoData = data
                } else {
                  self.infoData = self.currentArea
                }
              }
              if (type === 'grid') {
                self.infoType = 'grid'
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

      /* ---------------------------------订阅相关事件----------------------------------- */

      // 右击事件(右击查看当前对象信息)
      this.mapInstance.subscribe.on('rightclick', async ({ type, target }) => {
        // 右键文字标题, 聚焦当前区域
        if (type === 'text') {
          const text = target.getText()
          let group = null
          // 判断层级
          if (this.floor === 0) {
            group = this.mapInstance.companyGroup
            type = 'company'
          } else if (this.floor === 1) {
            group = this.mapInstance.areaGroup
            type = 'area'
          } else if (this.floor === 2) {
            group = this.mapInstance.gridGroup
            type = 'grid'
          } else if (this.floor === 3) {
            group = this.mapInstance.buildingGroup
            type = 'building'
          }
          if (!group) return
          group.eachOverlay(item => {
            if (text === item.getExtData().name) {
              target = item
            }
          })
          if (!target) return
        }
        this.handleCheckInfo(type, target)
      })

      // 双击事件(双击后下钻对应层级, 触发下钻事件)
      this.mapInstance.subscribe.on('dblclick', ({ type, target }) => {
        if (this.showEdit) {
          return this.$message.error('请先结束当前片区编辑')
        }
        // 双击行政区, 显示片区
        if (type === 'company') {
          this.handleFocusCompany(target)
        }

        // 双击片区, 显示网格点
        if (type === 'area') {
          this.handleFocusArea(target.getExtData().name)
        }

        // 双击网格, 显示楼盘标记点
        if (type === 'grid') {
          this.handleFocusGrid(target.getExtData().grid)
        }

        // 双击文字标题, 聚焦当前区域
        if (type === 'text') {
          const text = target.getText()
          // 判断层级
          if (this.floor === 0) {
            this.searchType = 'company'
          } else if (this.floor === 1) {
            this.searchType = 'area'
          } else if (this.floor === 2) {
            this.searchType = 'grid'
          }
          this.handleSearch(text)
        }
      })

      // 下钻事件
      this.mapInstance.subscribe.on('focus', async ({ type, target, fit }) => {
        // 公司->片区
        if (type === 'company') {
          this.mapInstance.map.setZoomAndCenter(...fit)
          this.floorZoomAndCenter[1] = {
            zoom: fit[0],
            center: fit[1]
          }
          if (this.floor === 2) {
            this.floorZoomAndCenter[2] = {
              zoom: fit[0],
              center: fit[1]
            }
          }
        }
        // 片区->网格
        if (type === 'area') {
          const name = target.getExtData().name
          this.gridList =
            (await this.getGridList({
              section: name
            })) || []
          if (this.gridList.length) {
            this.mapInstance.map.setZoomAndCenter(...fit)
            this.mapInstance.initGrid(this.gridList, this.currentArea)
            this.floorZoomAndCenter[2] = {
              zoom: fit[0],
              center: fit[1]
            }
          }
        }
        // 网格->楼盘
        if (type === 'grid') {
          const name = target.getExtData().grid
          const headOffice = this.getParentName(name, 'grid', 'company')
          this.buildingList =
            (await this.getBuildingList({
              grid: name,
              headOffice: headOffice ? headOffice.headOfficeName : ''
            })) || []
          if (this.buildingList.length) {
            this.mapInstance.map.setZoomAndCenter(...fit)
            this.mapInstance.initBuilding(this.buildingList, this.currentArea)
          }
        }
      })

      // 初始化完成
      this.mapInstance.subscribe.on('init', ({ type }) => {
        // if (type === 'area' && this.focusTarget.type === 'grid') {
        if (type === this.focusTarget.type) {
          const name = this.focusTarget.name
          this.focusTarget = {}
          this.handleSearch(name)
        }
      })

      // 保存编辑
      this.mapInstance.subscribe.on('saveEditor', async ({ setting }) => {
        const { path } = setting.area
        if (!path || !path.length) {
          return this.$message.error('请至少绘制3个点')
        }
        // 备份网格点个数, 存在前端setting大文本, 不然需要调一次后端接口获取
        const gridLen = this.currentArea.setting.grid.cnt
        this.currentArea.setting = setting
        this.currentArea.setting.grid.cnt = gridLen
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
          this.mapInstance.clearGrid()
        }
      })

      // 关闭|取消编辑
      this.mapInstance.subscribe.on('closeEditor', ({ setting }) => {
        this.showEdit = false
        this.disabledToolbar = false
        this.mapInstance.clearGrid()
      })
      // this.mapInstance.subscribe.on(
      //   'remove',
      //   ({ type, target, areaSetting }) => {
      // if (type === 'area') {
      //   const name = target.getExtData().name
      //   this.areaList.forEach(item => {
      //     if (item.name === name) {
      //       item.setting.area = areaSetting
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
    async backFloor() {
      let index = --this.floor
      // 针对没有片区的分公司, 直接回到首层
      if (!this.areaList.length && this.floor === 1) {
        index = --this.floor
      }
      if (index === 0) {
        // 行政区层
        // 清空下拉框
        this.selected = undefined
        // 重新绘制行政区轮廓
        this.handleGetCompanyList()
        this.getAreaSettingList()
        this.mapInstance.updateArea([])
        this.mapInstance.companyGroup.show()
        this.mapInstance.companyTextGroup.show()

        // 中心点及缩放比
        this.floorZoomAndCenter = this.$options.data().floorZoomAndCenter
        this.mapInstance.map.setZoomAndCenter(
          this.floorZoomAndCenter[0].zoom,
          this.floorZoomAndCenter[0].center
        )

        // 手动清空片区标题
        this.mapInstance.areaTextGroup.hide()
      } else if (index === 1) {
        // 片区层
        this.selected = undefined
        // 重新绘制片区层
        this.mapInstance.updateArea(this.drawnList)
        this.mapInstance.map.setZoomAndCenter(
          this.floorZoomAndCenter[1].zoom,
          this.floorZoomAndCenter[1].center
        )
        this.currentArea = {}
        if (this.drawnList.length) {
          const name = this.drawnList[0].name
          const headOffice = this.getParentName(name, 'area', 'company')
          this.gridList =
            (await this.getGridList({
              headOffice: headOffice ? headOffice.headOfficeName : ''
            })) || []
        }
      } else if (index === 2) {
        // 网格层
        this.selected = undefined
        // 重新绘制片区层
        this.mapInstance.gridGroup && this.mapInstance.gridGroup.show()
        this.mapInstance.clearBuilding()
        if (this.floorZoomAndCenter[2]) {
          this.mapInstance.map.setZoomAndCenter(
            this.floorZoomAndCenter[2].zoom,
            this.floorZoomAndCenter[2].center
          )
        } else {
          this.backFloor()
        }
      }
    },
    // 右键查看信息
    async handleCheckInfo(type, target) {
      if (type === 'company') {
      } else if (type === 'area') {
        // 右键查看片区信息
      } else if (type === 'grid') {
        // 右键查看网格信息
      } else if (type === 'building') {
        // 右键查看楼盘信息
      }
      const data = target.getExtData()
      // 增城从化特殊处理(需调接口获取网格数量)
      const noSectionList = ['从化', '增城', '花都']
      if (noSectionList.includes(data.name)) {
        this.gridList =
          (await this.getGridList({ headOffice: data.name })) || []
        data.areaCnt = this.gridList.length
      }
      this.infoType = type
      this.infoData = data
      this.showInfo = true
    },
    // 编辑样式
    handleStyleEdit() {
      this.showSetting = true
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
      this.mapInstance.clearGrid()
    },
    // 弹窗确认
    handleOk() {
      this.$refs.form.validate(async ok => {
        console.log(this.areaList, this.form)
        debugger
        if (ok) {
          const target = this.areaList.find(
            item => item.section === this.form.selectId
          )
          if (!target) return
          const name = target.section
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
            this.mapInstance.drawArea({
              data,
              areaSetting: setting.area,
              drawn: area => {
                // 小于3个顶点不构成片区
                const options = area.getOptions()
                if (options.path && options.path.length < 3) {
                  this.handleCancelDraw()
                  return
                }
                // 绘制完成, 进入当前片区的编辑模式
                this.mapInstance.mouseTool.close()
                this.showCancelDraw = false
                this.handleOpenEditor(area)
              }
            })
            this.handleCancelModal()
            this.gridList =
              (await this.getGridList({
                section: name
              })) || []
            if (this.gridList.length) {
              this.mapInstance.initGrid(this.gridList, this.currentArea)
            }
          } else if (this.visibleType === 'edit') {
            // 编辑片区
            this.disabledToolbar = true
            this.handleOpenEditor()
            this.gridList = (await this.getGridList()) || []
            if (this.gridList.length) {
              this.mapInstance.initGrid(this.gridList, this.currentArea)
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
    handleOpenEditor(area) {
      this.showEdit = true
      this.mapInstance.editArea({
        area: area || this.currentArea
      })
    },
    // 点击取消编辑
    handleCloseEdit() {
      this.mapInstance.closeEditor()
      const name = this.currentArea.name
      const newArea = this.drawnList.find(item => item.name === name)
      if (!newArea) {
        this.mapInstance.removeArea(name)
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
      // this.gridList =
      //   (await this.getGridList({
      //     section: this.currentArea.name
      //   })) || []
      this.mapInstance.updateStyle(this.gridList, setting)
    },
    // 聚焦行政区(分公司)
    async handleFocusCompany(target) {
      // 获取该分公司的片区列表
      const name = target.getExtData().name
      const company = this.companyList.find(
        item => item.headOfficeName === name
      )
      if (!company) return
      await this.handleGetAreaList(company.headOfficeName)
      this.gridList =
        (await this.getGridList({
          headOffice: company.headOfficeName
        })) || []
      // 如果该公司下有片区, 则渲染片区
      if (this.areaList.length) {
        const res = await this.getAreaSettingList(company.headOfficeName)
        this.floor = 1
        if (res !== 'error') {
          this.mapInstance.focusCompany(target, this.drawnList)
        }
      } else {
        if (this.gridList.length === 0) {
          this.$message.warning('该分公司无片区、网格与楼盘信息')
        }
        // 没有片区, 直接渲染网格点
        this.drawnList = []
        this.floor = 2
        this.mapInstance.focusCompany(target, this.drawnList)
        if (this.gridList.length) {
          this.mapInstance.initGrid(this.gridList, this.currentArea)
        }
      }
    },
    // 聚焦片区
    async handleFocusArea(name) {
      this.floor = 2
      this.currentArea = this.drawnList.find(item => item.name === name)
      this.mapInstance.focusArea(name)
    },
    // 聚焦网格
    handleFocusGrid(name) {
      this.floor = 3
      this.mapInstance.focusGrid(name)
    },
    // 搜索相应层级下钻
    async handleSearch(name) {
      if (this.showEdit) {
        return this.$message.error('请先结束当前片区编辑')
      }
      this.selected = name
      // 搜索分公司, 下钻到片区
      if (this.searchType === 'company') {
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
      } else if (this.searchType === 'area') {
        // 搜索片区, 下钻到网格
        if (!name) return
        // 聚焦片区
        if (this.floor === 1) {
          await this.handleFocusArea(name)
          return
        }
        // 找到片区归属分公司的id
        const company = this.getParentName(name, 'area')
        if (!company) return
        let companyName = company.headOfficeName
        let target = null
        this.mapInstance.companyGroup.eachOverlay(item => {
          if (companyName === item.getExtData().name) {
            target = item
          }
        })
        if (!target) return
        this.focusTarget = {
          type: 'area',
          name
        }
        await this.handleFocusCompany(target)
      } else if (this.searchType === 'grid') {
        // 搜索片区, 下钻到网格
        if (!name) return
        // 判断当前层级, 递归下钻
        if (this.floor === 2) {
          this.handleFocusGrid(name)
          return
        } else if (this.floor === 1) {
          // 向上找到片区
          const area = this.getParentName(name, 'grid', 'area')
          if (!area) return
          this.focusTarget = {
            type: 'grid',
            name
          }
          await this.handleFocusArea(area.section)
          return
        }
        // 向上找到片区
        const area = this.getParentName(name, 'grid', 'area')
        if (!area) return
        // 找到片区归属分公司的id
        const company = this.getParentName(area.section, 'area')
        if (!company) return
        let companyName = company.headOfficeName
        let target = null
        this.mapInstance.companyGroup.eachOverlay(item => {
          if (companyName === item.getExtData().name) {
            target = item
          }
        })
        if (!target) return
        this.focusTarget = {
          type: 'area',
          name
        }
        await this.handleFocusCompany(target)
      }
    },
    /**
     * @description 根据名称向上查找父节点名称
     * @param name 名称
     * @param node 当前节点
     * @param parent 需要查找的父节点
     */
    getParentName(name, node, parent) {
      // 网格层向上查找(片区or公司)
      if (node === 'grid') {
        const grid = this.gridList.find(item => item.grid === name)
        if (!grid) return
        const area = this.areaList.find(item => item.section === grid.section)
        if (parent === 'area') {
          return area
        } else if (parent === 'company') {
          if (grid.headOffice) {
            grid.headOfficeName = grid.headOffice
            return grid
          }
          return area ? this.getParentName(area.section, 'area') : null
        }
      } else if (node === 'area') {
        // 片区层向上查找, 只有公司层
        for (const company of this.companyList) {
          if (company.section.some(item => item.sectionName === name)) {
            return company
          }
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
  width: 242px;
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
