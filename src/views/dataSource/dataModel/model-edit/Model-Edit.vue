<template>
  <div class="Model-Edit">
    <div class="left">
      <!-- <div class="menu_title">
        <span>数据接入</span>
      </div>
      <div class="selector">
        <a-select default-value="银行账户" style="width: 94%;">
          <a-select-option value="SQL Server">
            SQL Server
          </a-select-option>
        </a-select>
      </div>
      <a-divider /> -->
      <div class="menu_search">
        <span class="search_span">数据库</span>
      </div>
      <a-select
        v-if="databaseName !== ''"
        class="menu_select"
        :default-value="databaseName"
        @change="handleChangeDatabase"
      >
        <a-select-option :value="databaseName">{{ databaseName }}</a-select-option>
      </a-select>
      <a-divider />
      <div class="menu_search">
        <span class="search_span">表</span>
        <!-- <a-input placeholder="请输入关键词搜索" class="search_input">
          <a-icon slot="prefix" type="search" />
        </a-input> -->
      </div>
      <edit-left
        ref="editLeftRef"
        @on-left-drag-leave="handleLeftDragLeave"
      ></edit-left>
      <!-- <a-divider /> -->
      <!-- <div v-if="isDatabase" class="SQL-View">
        <div class="menu_search">
          <span class="search_span">自定义SQL视图</span>
          <a-icon class="view-icon" type="plus-square" @click="handleAddSQL('new')" />
        </div>
        <div class="sheet_list">
          <a-dropdown class="sheet_list_item" :trigger="['contextmenu']">
            <div>
              银行账户
              </div>
            <a-menu slot="overlay">
              <a-menu-item v-on:click="check">
                查看表
              </a-menu-item>
              <a-menu-item @click="handleAddSQL('edit')">
                编辑
              </a-menu-item>
              <a-menu-item>
                删除
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div> -->
    </div>
    <div class="right">
      <div class="header" v-if="model==='edit'">
        <span class="data_con">{{detailInfo.name}}</span>
      </div>
      <div class="data_con_add" v-else-if="model === 'add'">
        <a-form :form="modelForm" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
          <a-form-item label="数据模型名称">
            <a-input
              v-decorator="['name', { rules: [{ required: true, message: '请输入名称!' }] }]"
            />
          </a-form-item>
        </a-form>
      </div>
      <!-- <div class="description">
        <span class="d-s">描述： {{detailInfo.description}}<a-icon type="edit" v-on:click="open"/></span>
      </div> -->
      <a-divider />
      <div class="draw_board">
        <edit-right-top ref='rightTopRef' :detailInfo="detailInfo"></edit-right-top>
      </div>
      <a-divider />
      <div class="detail">
        <div class="detail_header">
          <span>数据模型详情</span>
          <div class="detail_btn">
            <!-- <a-button v-on:click="check">查看宽表</a-button> -->
            <!-- <a-button v-on:click="batch">批量编辑字段</a-button> -->
          </div>
        </div>
        <div class="detail_main">
          <div class="dimensionality">
            <span class="dim_span">维度</span>
            <div class="dim_operation">
              <!-- <a v-on:click="dim_mea('维度')" style="color:#627CFF;line-height:38px">新建计算维度</a> -->
              <a-divider type="vertical" />
              <!-- <a v-on:click="geography" style="color:#627CFF;">设置地理位置</a> -->
            </div>
            <div class="dim_menu">
              <a-menu mode="inline" v-for="(value, name) in dimensions" :key="name" :default-open-keys="[name]" :inline-collapsed="false">
                <a-sub-menu :key="name">
                  <span slot="title"><span>{{value[0].tableName}}</span></span>
                  <a-menu-item v-for="item in value" :key="item.id" :class="{ 'line-through': !item.visible }">
                    <img
                      src="@/assets/images/icon_dimension.png"
                      style="width:15px;height:15px"
                    />
                    {{item.name}}
                  </a-menu-item>
                </a-sub-menu>
              </a-menu>
            </div>
          </div>
          <div class="measurement">
            <span class="mea_span">度量</span>
            <div class="mea_operation">
              <!-- <a v-on:click="dim_mea('度量')" style="color:#627CFF;margin-right:20px;line-height:38px">新建计算度量</a> -->
            </div>
            <div class="mea_menu">
              <a-menu mode="inline" v-for="(value, name) in measures" :key="name" :default-open-keys="[name]" :inline-collapsed="false">
                <a-sub-menu :key="name">
                  <span slot="title"><span>{{value[0].tableName}}</span></span>
                  <a-menu-item v-for="item in value" :key="item.id" :class="{ 'line-through': !item.visible }">
                    <img
                      src="@/assets/images/icon_measure.png"
                      style="width:15px;height:15px"
                    />
                    {{item.name}}
                  </a-menu-item>
                </a-sub-menu>
              </a-menu>
            </div>
          </div>
        </div>
      </div>
      <!-- 动态弹窗组件 -->
      <component
        v-bind:is="modalName"
        :is-show="visible"
        :compute-type="computeType"
        :tables="dimensions"
        :sql-form="sqlForm"
        :description="detailInfo.description"
        @close="close"
      />
      <div class="submit_btn">
        <a-button>保存并新建报告</a-button>
        <a-button type="primary" @click="handleSave">保 存</a-button>
        <a-button v-on:click="exit">退 出</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EditLeft from './edit-left'
import EditRightTop from './edit-right-top'
import SqlSetting from './setting/sql-setting'
import CheckTable from './setting/check-table'
import DescribeSetting from './setting/describe-setting'
import BatchSetting from './setting/batch-setting'
import GeoSetting from './setting/geo-setting'
import ComputeSetting from './setting/compute-setting'
import { Node, conversionTree } from '../util'
import groupBy from 'lodash/groupBy'

const setting = [
  {
    key: '1',
    last_name: 'authorityEntityType'
  }
]

export default {
  components: {
    EditLeft,
    EditRightTop,
    SqlSetting, // 添加SQL语句
    CheckTable, // 查看宽表
    DescribeSetting, // 设置描述
    BatchSetting, // 批量设置字段
    GeoSetting, // 设置地理位置
    ComputeSetting // 设置维度度量
  },
  provide() {
    return {
      nodeStatus: this.globalStatus
    }
  },
  data() {
    return {
      modelForm: this.$form.createForm(this, { name: 'modelForm' }),
      spinning: false,
      detailInfo: '',
      isDatabase: true, // 是否是SQL数据源, 控制自定义SQL渲染
      sqlForm: {},
      globalStatus: {
        dragType: '',
        dragNode: {},
        dropNode: {},
        event: null
      },
      measures: '',
      dimensions: '',
      setting,
      activeIndex: 0,
      current: ['mail'],
      openKeys: ['sub1'],
      modalName: '',
      visible: false, // 设置弹窗(描述, 宽表, 批量, 地理, 维度度量)
      rules: {
        Function: [
          {
            required: true,
            message: '请选择关联方式'
          }
        ]
      },
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 14
      },
      computeType: '', // 新建计算字段类型(维度, 度量)
      formLayout: ' horizontal ',
      dataSource: [
        {
          key: '0',
          name: 'Edward King 0',
          age: '32',
          address: 'London, Park Lane no. 0'
        },
        {
          key: '1',
          name: 'Edward King 1',
          age: '32',
          address: 'London, Park Lane no. 1'
        }
      ],
      count: 2,
      c: [
        {
          title: '表1',
          dataIndex: 'table1',
          width: '30%',
          scopedSlots: {
            customRender: 'table1'
          }
        },
        {
          title: '连接',
          dataIndex: 'link',
          scopedSlots: {
            customRender: 'link'
          }
        },
        {
          title: '表2',
          dataIndex: 'table2',
          scopedSlots: {
            customRender: 'table2'
          }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: {
            customRender: 'operation'
          }
        }
      ],
      databaseList: [] // 数据库列表
    }
  },
  computed: {
    ...mapState({
      modelId: state => state.dataModel.modelId, // 选中的菜单id
      addModelId: state => state.dataModel.addModelId, // 新增的模型id
      parentId: state => state.dataModel.parentId, // 选中的文件夹id
      datasource: state => state.dataModel.datasource, // 数据源
      datasourceId: state => state.dataModel.datasourceId // 数据源
    }),
    model() {
      return this.$route.query.type
    },
    databaseName() {
      return this.databaseList.length > 0 ? this.databaseList[0].name : ''
    }
  },
  mounted() {
    if (this.model === 'add') {
      this.handleGetAddModelDatamodel()
    } else if (this.model === 'edit') {
      this.handleGetData(this.$route.query.modelId)
    }
  },
  beforeDestroy() {
    this.$store.dispatch('dataModel/setAddModelId', -1)
  },
  methods: {
    /**
     * 新增时获取空模型
     */
    async handleGetAddModelDatamodel() {
      const result = await this.$server.dataModel.getAddModelDatamodel()
      if (result.code === 200) {
        this.detailInfo = result.data
        // this.$store.dispatch('dataModel/setModelId', result.data.id)
        this.$store.dispatch('dataModel/setAddModelId', result.data.id)
        this.$nextTick(() => {
          this.handleGetDatabase()
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    /**
     * 根据数据源获取数据库(暂时只支持显示第一个库)
     */
    async handleGetDatabase() {
      const len = this.detailInfo.config.tables ? this.detailInfo.config.tables.length : 0
      let tableId = ''
      if (len > 0) {
        tableId = this.detailInfo.config.tables[len - 1].tableId
      }
      const result = await this.$server.dataModel.getDataBaseDataInfoList(this.$route.query.datasourceId, tableId)

      if (result.code === 200) {
        this.databaseList = result.data
        if (this.databaseList.length && this.databaseList.length > 0) {
          this.$refs.editLeftRef.handleGetMenuList(result.data[0].id)
          this.$store.dispatch('dataModel/setDatabaseId', result.data[0].id)
        }
        // this.handleDimensions()
        // this.handleMeasures()
      } else {
        this.$message.error(result.msg)
      }
    },
    /**
     * 切换数据库
     */
    async handleChangeDatabase(value) {
      // this.$refs.editLeftRef.handleGetMenuList(value)
      // this.$store.dispatch('dataModel/setDatabaseId', value)
      // this.detailInfo.config.tables = []
      // this.detailInfo.pivotSchema.dimensions = []
      // this.detailInfo.pivotSchema.measures = []
    },
    /**
     * 表格column处理
     */
    handleFormatTableColumn() {

    },
    /**
     * 维度数据处理
    */
    handleDimensions() {
      console.log(groupBy(this.detailInfo.pivotSchema.dimensions, 'tableNo'))
      this.dimensions = groupBy(this.detailInfo.pivotSchema.dimensions, 'tableNo')
    },
    /**
     * 度量数据处理
    */
    handleMeasures() {
      console.log(groupBy(this.detailInfo.pivotSchema.measures, 'tableNo'))
      this.measures = groupBy(this.detailInfo.pivotSchema.measures, 'tableNo')
    },
    /**
     * 编辑时获取模型数据
    */
    async handleGetData(id) {
      this.spinning = true
      const result = await this.$server.dataModel.getDataModelDetailInfo(id)
        .finally(() => {
          this.spinning = false
        })

      if (result.code === 200) {
        this.$message.success('获取数据成功')
        this.detailInfo = result.data
        this.handleDimensions()
        this.handleMeasures()
        this.$nextTick(() => {
          this.handleGetDatabase()
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    handleLeftDragLeave() {
      this.$refs.rightTopRef.handleMapRemoveClass()
    },
    check() {
      this.visible = true
      this.modalName = 'check-table'
    },
    open() {
      this.visible = true
      this.modalName = 'describe-setting'
    },
    geography() {
      this.visible = true
      this.modalName = 'geo-setting'
    },
    batch() {
      this.visible = true
      this.modalName = 'batch-setting'
    },
    dim_mea(type) {
      this.visible = true
      this.modalName = 'compute-setting'
      this.computeType = type
    },
    handleAddSQL(type, item) {
      if (type === 'new') {
        this.sqlForm = {
          name: '',
          content: ''
        }
      } else if (type === 'edit') {
        if (item) {
          this.sqlForm = {
            name: item.name,
            content: item.content
          }
        }
      }
      this.visible = true
      this.modalName = 'sql-setting'
    },
    close() {
      this.visible = false
    },
    exit() {
      this.$router.go(-1)
    },
    async handleSave() {
      let formAllRight = true
      if (this.model === 'add') {
        this.modelForm.validateFields((err, values) => {
          if (!err) {
            this.detailInfo.name = values.name
            formAllRight = true
          } else {
            formAllRight = false
          }
        })
      }
      if (!formAllRight) return
      if (formAllRight && this.detailInfo.config.tables.length === 0) {
        this.$message.error('请关联左侧表')
        return
      }

      this.detailInfo.config.tables.map(table => {
        table.alias = table.name
        table.joinType = 1
      })
      const result = await this.$server.dataModel.saveModel({
        ...this.detailInfo,
        parentId: this.parentId
      })

      if (result.code === 200) {
        if (this.model === 'add') {
          await this.handleSaveModelSourceId()
        }
        this.$message.success({
          content: this.model === 'add' ? '保存成功' : '编辑成功',
          duration: 0.5
        }).then(() => {
          this.$store.commit('dataModel/SET_MODELID', result.data.id)
          this.exit()
        })
      } else {
        this.$message.error(result.msg)
      }
      this.$store.dispatch('dataModel/setParentId', '')
    },
    /**
     * 保存模型后再保存关联的数据源信息
     */
    async handleSaveModelSourceId() {
      this.$server.dataModel.saveDatasource({
        sourceDatasourceList: new Array(this.datasource),
        dataModelId: this.model === 'add' ? this.addModelId : this.modelId
      })
    }
  }
}
</script>

<style lang="styl" scope>
@import "./Model-Edit.styl";
</style>
