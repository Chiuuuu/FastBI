<template>
  <div class="tab-panel">
    <div class="search_bar">
      <a-radio-group class="search_radio" v-model="tableType" @change="handleTableTypeChange">
        <a-radio-button :value="0">原始表</a-radio-button>
        <a-radio-button :value="1">自定义表</a-radio-button>
      </a-radio-group>
      <a-row type="flex" align="middle">
        <a-col :span="6" style="padding-left:20px">
          <a-input :value="tableKeyword" @change="handleGetTableKeyword" placeholder="请输入表名">
            <a-icon slot="prefix" type="search" />
          </a-input>
        </a-col>
        <a-col :span="4" style="padding-left:10px">
          <a-select v-show="tableType === 0" style="width: 100%;" :value="database" @change="handleChangeDatabase">
            <a-select-option v-for="item in databaseList" :key="item.name" :value="item.name">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="14">
          <a-row type="flex" justify="end" align="middle">
            <a-button type="primary" class="select_button" @click="() => handleGetData()" :loading="spinning">刷新数据</a-button>
            <a-button
              v-if="hasBtnPermissionExtract"
              v-show="showExtractBtn"
              type="primary"
              class="select_button"
              style="margin-left:10px;"
              @click="handleExtract"
              :loading="extractSping">立即抽取</a-button>
            <a-button
              v-if="tableType === 0 && hasBtnPermissionSchedule"
              v-show="showExtractBtn"
              type="primary"
              style="margin-left:10px;"
              @click="showSetting('batch')"
              class="select_button"
            >批量定时抽取</a-button>
            <a-dropdown :trigger="['click']">
              <a-button type="primary" style="margin-left:10px;">更多<a-icon type="down" /></a-button>
              <a-menu slot="overlay">
                <a-menu-item>
                  <span @click="handleSyncTable">同步库表结构</span>
                </a-menu-item>
                <a-menu-item
                  v-if="tableType === 0 && hasBtnPermissionSchedule"
                  v-show="showExtractBtn">
                  <span @click="showExtractLog">定时抽取记录</span>
                </a-menu-item>
                <a-menu-item
                  v-if="tableType === 0 && hasBtnPermissionSchedule"
                  v-show="showExtractBtn">
                  <span @click="showSetting('batchList')">批量任务列表</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="tab-scroll scrollbar">
      <a-table
        rowKey='id'
        :row-selection="rowSelection"
        :pagination="pagination"
        :columns="columns"
        :data-source="data"
        :loading="spinning"
        :scroll="{ y: 'calc(100vh - 440px)', x: 960 }"
        @change="handleChangeTable"
      >
        <span slot="name" slot-scope="text, record">
          <a @click="handleCheckTable($event, record.id)">{{ text }}</a>
        </span>
        <span slot="set" slot-scope="set">
          {{ set ? '是' : '否' }}
        </span>
        <span slot="extracted" slot-scope="extracted">
          {{ extracted ? '是' : '否' }}
        </span>
        <template slot="extractStatus" slot-scope="extractStatus">
          <span v-if="extractStatus === 0">未抽取</span>
          <span v-else-if="extractStatus === 1">抽取中</span>
          <span v-else-if="extractStatus === 2">抽取成功</span>
          <span v-else-if="extractStatus === 3">抽取失败</span>
          <span v-else>未抽取</span>
        </template>
        <span slot="config" slot-scope="row">
          <a v-on:click="setting(row)">{{row.set ? '字段编辑' : '字段设置' }}</a>
        </span>
        <span slot="regular" slot-scope="row">
          <a
            v-if="hasBtnPermissionSchedule"
            v-on:click="showSetting('single', row)"
            >定时设置</a>
          <span v-else>-</span>
        </span>
      </a-table>
      <a-modal width="920px" title="定时抽取记录" :bodyStyle="bodyStyle" :visible="visible1" @cancel="handleCloseExtractLog">
        <a-table
          row-key="id"
          size="small"
          :columns="logColumns"
          :data-source="logData"
          :loading="modalSpin"
          :scroll="{ y: 300 }"
        >
          <template #status="text">
            <span v-if="text === '0'">成功</span>
            <span v-else-if="text === '1'">失败</span>
            <div v-else-if="text === '2'">
              <span>正在抽取中</span>
              <!-- <a-progress :percent="row.progress" /> -->
            </div>
          </template>
          <template #cost="text">
            <span>{{ formatCost(text) }}</span>
          </template>
          <template #startTime="text">
            <span>{{ text | formatTime }}</span>
          </template>
        </a-table>
      </a-modal>
      <extract-setting
        ref="extract"
        :show="visible"
        :rows="clickRows"
        @close="visible = false"
        @setRegular="setRegular" />
      <regular-setting
        ref="regular"
        :show="visible2"
        :rows="clickRows"
        :table-type="tableType"
        :regular-info="regularInfo"
        @close="closeRegular" />
      <table-info
        :table-id="checkTableId"
        :show="visible3"
        @close="visible3 = false"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import RegularSetting from './regular'
import ExtractSetting from './extract'
import TableInfo from './table-info'
import moment from 'moment'
import { checkActionPermission, hasPermission } from '@/utils/permission'
import debounce from 'lodash/debounce'
const logColumns = [
  {
    title: '抽取任务名称',
    align: 'center',
    ellipsis: true,
    width: 200,
    dataIndex: 'taskName'
  },
  {
    title: '表名',
    align: 'center',
    ellipsis: true,
    width: 200,
    dataIndex: 'tableName'
  },
  {
    title: '抽取开始时间',
    align: 'center',
    width: 150,
    dataIndex: 'startTime',
    scopedSlots: { customRender: 'startTime' }
  },
  {
    title: '耗时',
    align: 'center',
    width: 100,
    dataIndex: 'cost',
    scopedSlots: { customRender: 'cost' }
  },
  {
    title: '状态',
    align: 'center',
    width: 80,
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  // {
  //   title: '报错信息',
  //   align: 'center',
  //   dataIndex: 'errMsg'
  // },
  {
    title: '关联表同步数量',
    width: 120,
    align: 'center',
    dataIndex: 'relateTableNum'
  }
]

export default {
  name: 'tabContentStructure',
  components: {
    RegularSetting,
    ExtractSetting,
    TableInfo
  },
  data() {
    return {
      // hasBtnPermission: false,
      columns: [],
      data: [],
      pagination: {
        current: 1,
        pageSize: 30,
        total: 0
      },
      databaseList: [],
      database: '',
      tableKeyword: '',
      logColumns,
      logData: [],
      bodyStyle: { 'maxHeight': 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      tableType: 0,
      visible: false, // 批量设置定时弹窗
      visible1: false, // 抽取记录弹窗
      visible2: false, // 添加定时任务弹窗
      visible3: false, // 查看表信息
      extractForm: '',
      spinning: true,
      selectedRows: [],
      selectedRowKeys: [],
      extractSping: false,
      modalSpin: false,
      clickRows: [],
      regularInfo: {},
      checkTableId: '' // 查看数据的表id
    }
  },
  computed: {
    ...mapState({
      formInfo: state => state.dataAccess.modelInfo,
      modelId: state => state.dataAccess.modelId,
      databaseName: state => state.dataAccess.databaseName,
      modelInfo: state => state.dataAccess.modelInfo,
      modelName: state => state.dataAccess.modelName,
      modelType: state => state.dataAccess.modelType,
      privileges: state => state.common.privileges,
      showExtractBtn: state => [ 'mysql', 'oracle', 'hive' ].indexOf(state.dataAccess.modelType) > -1
    }),
    rowSelection() {
      return {
        fixed: true,
        selectedRowKeys: this.selectedRowKeys,
        onSelect: (record, selected, selectedRows) => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedRows = selectedRows
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedRowKeys = selectedRows.map(item => item.id)
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedRows = selectedRows
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedRowKeys = selectedRows.map(item => item.id)
        }
      }
    },
    hasBtnPermissionExtract() {
      return hasPermission(this.privileges, this.$PERMISSION_CODE.OPERATOR.extract)
    },
    hasBtnPermissionSchedule() {
      return hasPermission(this.privileges, this.$PERMISSION_CODE.OPERATOR.schedule)
    }
  },
  filters: {
    formatTime(v) {
      return moment(v).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    formatCost(v, notCapital) {
      if (v === 0) {
        return notCapital ? '' : '0s'
      } else if (v < 60) {
        return v + 's'
      } else if (v < 3600 && v >= 60) {
        let min = Math.floor(v / 60)
        return `${min}min${this.formatCost(v % 60, true)}`
      } else if (v >= 3600) {
        let h = Math.floor(v / 3600)
        return `${h}h${this.formatCost(v % 3600, true)}`
      }
    },
    handleTableTypeChange(event) {
      this.handleGetData()
    },
    // 同步库库表结构
    handleSyncTable() {
      this.$message.success('库表同步成功')
      this.handleGetData()
    },
    handleGetTableKeyword: debounce(function(e) {
      this.tableKeyword = e.target.value.trim()
      this.selectedRowKeys = []
      this.selectedRows = []
      this.handleGetData()
    }, 400),
    handleChangeDatabase(value) {
      this.database = value
      this.$store.commit('dataAccess/SET_DATABASENAME', value)
      this.handleGetData()
    },
    async handleGetDatabase() {
      const result = await this.$server.dataAccess.getDatabaseList({
        datasourceId: this.modelId
      })
      if (result.code === 200) {
        this.databaseList = [].concat(result.rows)
        if (this.databaseName) {
          this.database = this.databaseName
        } else {
          this.database = this.formInfo ? this.formInfo.databaseName : ''
        }
      } else {
        this.databaseList = []
        this.$message.error(result.msg)
      }
    },
    handleColumns() {
      // 定时权限决定表头是否显示
      const columns = [
        {
          title: '表名',
          dataIndex: 'name',
          ellipsis: true,
          width: 200,
          key: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '是否设置过字段',
          dataIndex: 'set',
          key: 'set',
          slots: { title: 'set' },
          scopedSlots: { customRender: 'set' }
        },
        {
          title: '是否抽取过',
          dataIndex: 'extracted',
          key: 'extracted',
          slots: { title: 'extracted' },
          scopedSlots: { customRender: 'extracted' }
        },
        {
          title: '抽取状态',
          dataIndex: 'extractStatus',
          key: 'extractStatus',
          slots: { title: 'extractStatus' },
          scopedSlots: { customRender: 'extractStatus' }
        },
        {
          title: '修改时间',
          key: 'gmtModified',
          width: 200,
          dataIndex: 'gmtModified'
        },
        {
          title: '字段配置',
          key: 'config',
          scopedSlots: { customRender: 'config' }
        },
        {
          title: '定时配置',
          key: 'regular',
          scopedSlots: { customRender: 'regular' }
        }
      ]

      if (!this.hasBtnPermissionSchedule || ['excel', 'csv'].indexOf(this.modelType) > -1) {
        columns.pop()
      }
      this.columns = columns
    },
    handleChangeTable(pagination) {
      this.handleGetData(pagination)
    },
    async handleGetData(pagination) {
      if (!this.modelType) return
      this.handleColumns()
      this.spinning = true
      let databaseName
      if (this.databaseName) {
        databaseName = this.databaseName
      } else {
        databaseName = this.formInfo ? this.formInfo.databaseName : ''
      }
      // sql, oracle的数据库名称在formInfo里, excel的在dabaseName里
      if (['excel', 'csv'].indexOf(this.modelType) > -1) {
        databaseName = this.databaseName
      }
      const params = {
        databaseName,
        keyword: this.tableKeyword,
        sourceId: this.modelId,
        tableType: this.tableType,
        pageSize: this.pagination.pageSize,
        current: pagination ? pagination.current : this.$options.data().pagination.current
      }
      const dabaseInfoResult = await this.$server.dataAccess.getTableList(params)
        .finally(() => {
          this.spinning = false
        })
      if (dabaseInfoResult.code === 200) {
        this.data = [].concat(dabaseInfoResult.rows)
        this.$store.dispatch('dataAccess/setReadRows', this.data)
        this.pagination.total = dabaseInfoResult.total
        this.pagination.current = params.current
      } else {
        this.data = []
        this.$message.error(dabaseInfoResult.msg)
      }
    },
    handleCheckTable(e, id) {
      this.checkTableId = id
      this.visible3 = true
    },
    handleCloseExtractLog() {
      this.visible1 = false
      this.logData = []
    },
    async showExtractLog() {
      if (this.data.length < 1) {
        return this.$message.error('当前数据库暂无数据')
      }
      this.visible1 = true
      this.modalSpin = true
      this.$server.dataAccess.getExtractLogList(this.data[0].id)
        .then(res => {
          if (res.code === 200) {
            this.logData = res.rows
          } else {
            this.$message.error(res.msg)
          }
        })
        .finally(() => {
          this.modalSpin = false
        })
    },
    async handleExtract() {
      if (this.selectedRows.length === 0) {
        return this.$message.error('请选择至少一项')
      } else if (this.selectedRows.length > 10) {
        return this.$message.error('一次抽取最多只能选择10个')
      }
      // 源表抽取
      let result
      if (this.tableType === 0) {
        const rows = this.selectedRows.map(item => {
          // let databaseName = this.formInfo ? this.formInfo.databaseName : ''
          // // sql, oracle的数据库名称在formInfo里, excel的在dabaseName里
          // if (['excel', 'csv'].indexOf(this.modelType) > -1) {
          //   databaseName = this.databaseName
          // }
          const _item = {
            databaseName: this.database,
            sourceId: this.modelId,
            sourceName: this.modelName,
            tableId: item.id,
            tableName: item.name
          }
          return _item
        })
        this.extractSping = true
        result = await this.$server.dataAccess.actionExtract('/datasource/extract', {
          rows: rows,
          tableList: this.data
        }).finally(() => {
          this.extractSping = false
          this.handleGetData()
        })
      } else if (this.tableType === 1) { // 自定义表抽取
        this.extractSping = true
        result = await this.$server.dataAccess.actionCustomExtract(this.selectedRows.map(item => item.id)).finally(() => {
          this.extractSping = false
          this.handleGetData()
        })
      }
      if (result.code === 200) {
        if (result.data) {
          if (result.data.length && result.data.length < this.selectedRows.length) {
            this.$message.info(`抽取任务已下达 \n ${result.msg}`, 5)
          } else if (result.data.length && result.data.length === this.selectedRows.length) {
            this.$message.error('所选表格不是orc格式, 无法抽取')
          }
        } else {
          this.$message.success('抽取任务已下达')
        }
      } else {
        this.$message.error(result.msg)
      }
    },
    setting(row) {
      this.$emit('on-change-componet', 'Setting', row)
    },
    showSetting(type, row) {
      if (type === 'single') {
        this.clickRows = new Array(row)
        this.visible = true
      } else if (type === 'batch') {
        if (this.selectedRows.length < 2) {
          return this.$message.error('请选择至少2项')
        } else if (this.selectedRows.length > 10) {
          return this.$message.error('最多只能选择10项')
        }
        this.clickRows = this.selectedRows
        this.visible2 = true
      } else if (type === 'batchList') {
        if (this.data.length < 1) {
          return this.$message.error('当前数据库暂无数据')
        }
        this.clickRows = this.data[0].databaseId
        this.visible = true
      }
    },
    closeRegular() {
      this.visible2 = false
      this.regularInfo = {}
    },
    setRegular(data) {
      if (data) {
        this.regularInfo = data
      } else {
        this.regularInfo = {}
      }
      this.visible2 = true
    }
  }
}
</script>
