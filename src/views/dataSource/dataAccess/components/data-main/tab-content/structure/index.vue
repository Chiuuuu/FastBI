<template>
  <div class="tab-panel">
    <div class="search_bar">
      <a-radio-group class="search_radio" v-model="tableType" @change="handleTableTypeChange">
        <a-radio-button :value="0">原始表</a-radio-button>
        <a-radio-button :value="1">自定义表</a-radio-button>
      </a-radio-group>
      <a-row type="flex" justify="end" align="middle">
        <!-- <a-col style="margin-right:auto">
          <a-input placeholder="请输入关键词" class="search_input">
            <a-icon slot="prefix" type="search" />
          </a-input>
        </a-col> -->
        <a-col>
          <a-button type="primary" class="select_button" @click="handleGetData" :loading="spinning">刷新数据</a-button>
          <a-button v-show="showExtractBtn" type="primary" style="margin:0 10px;" class="select_button" @click="showExtractLog">抽取记录</a-button>
          <a-button v-show="showExtractBtn" type="primary" class="select_button" @click="handleExtract" :loading="extractSping">全部抽取</a-button>
          <a-button v-show="showExtractBtn" type="primary" style="margin:0 10px;" @click="showSetting('batch')" class="select_button">批量抽取设置</a-button>
        </a-col>
        <!-- <a-col>
          <a-select default-value="全部" class="search_select">
            <a-select-option value="aaa">
              aaa
            </a-select-option>
          </a-select>
        </a-col> -->
      </a-row>
    </div>
    <div class="tab-scroll scrollbar">
      <a-table :row-selection="rowSelection" :columns="columns" :data-source="data"  rowKey='id' :loading='spinning' :pagination='false'>
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
          <a v-if="showExtractBtn" v-on:click="showSetting('single', row)">定时设置</a>
          <span v-else>-</span>
        </span>
      </a-table>
      <a-modal width="920px" title="抽取记录" :bodyStyle="bodyStyle" :visible="visible1" @cancel="handleCloseExtractLog">
        <a-table
          row-key="id"
          size="small"
          :columns="logColumns"
          :data-source="logData"
          :loading="modalSpin"
          :scroll="{ y: 300 }"
        >
          <template #status="text, row">
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
        :row="clickRow"
        @close="visible = false"
        @setRegular="setRegular" />
      <regular-setting
        ref="regular"
        :show="visible2"
        :single="isSingle"
        :row="clickRow"
        :regular-id="regularId"
        :table-list="selectedRows"
        @close="closeRegular" />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import RegularSetting from './regular'
import ExtractSetting from './extract'
import moment from 'moment'

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

const columns = [
  {
    title: '表名',
    dataIndex: 'name',
    ellipsis: true,
    width: 200,
    key: 'name'
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
export default {
  name: 'tabContentStructure',
  components: {
    RegularSetting,
    ExtractSetting
  },
  data() {
    return {
      columns,
      data: [],
      logColumns,
      logData: [],
      bodyStyle: { 'maxHeight': 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      tableType: 0,
      visible: false, // 批量设置定时弹窗
      visible1: false, // 抽取记录弹窗
      visible2: false, // 添加定时任务弹窗
      extractForm: '',
      isSingle: false,
      spinning: true,
      selectedRows: [],
      extractSping: false,
      modalSpin: false,
      clickRow: '',
      regularId: '',
      rowSelection: {
        onSelect: (record, selected, selectedRows) => {
          this.selectedRows = selectedRows
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          this.selectedRows = selectedRows
        }
      }
    }
  },
  computed: {
    ...mapState({
      formInfo: state => state.dataAccess.modelInfo,
      modelId: state => state.dataAccess.modelId,
      databaseId: state => state.dataAccess.databaseId,
      databaseName: state => state.dataAccess.databaseName,
      modelInfo: state => state.dataAccess.modelInfo,
      modelName: state => state.dataAccess.modelName,
      modelType: state => state.dataAccess.modelType,
      showExtractBtn: state => [ 'mysql', 'oracle', 'hive' ].indexOf(state.dataAccess.modelType) > -1
    })
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
    async handleGetData() {
      if (!this.modelType) return
      this.spinning = true
      const modelKey = this.modelType === 'oracle' ? 'sourceOracleName' : 'sourceMysqName'
      let databaseName = this.formInfo ? this.formInfo.databaseName : ''
      // sql, oracle的数据库名称在formInfo里, excel的在dabaseName里
      if (['excel', 'csv'].indexOf(this.modelType) > -1) {
        databaseName = this.databaseName
      }
      const dabaseInfoResult = await this.$server.dataAccess.getTableList({
        databaseName,
        sourceId: this.modelId,
        tableType: this.tableType
      }).finally(() => {
        this.spinning = false
      })
      if (dabaseInfoResult.code === 200) {
        this.data = [].concat(dabaseInfoResult.rows)
        this.$store.dispatch('dataAccess/setReadRows', this.data)
      } else {
        this.data = []
        this.$message.error(dabaseInfoResult.msg)
      }
    },
    handleCloseExtractLog() {
      this.visible1 = false
      this.logData = []
    },
    async showExtractLog() {
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
      const rows = this.selectedRows.map(item => {
        let databaseName = this.formInfo ? this.formInfo.databaseName : ''
        // sql, oracle的数据库名称在formInfo里, excel的在dabaseName里
        if (['excel', 'csv'].indexOf(this.modelType) > -1) {
          databaseName = this.databaseName
        }
        const _item = {
          databaseName,
          sourceId: this.modelId,
          sourceName: this.modelName,
          tableId: item.id,
          tableName: item.name
        }
        return _item
      })
      this.extractSping = true

      const result = await this.$server.dataAccess.actionExtract('/datasource/extract', {
        rows: rows,
        tableList: this.data
      }).finally(() => {
        this.extractSping = false
        this.handleGetData()
      })

      if (result.code === 200) {
        this.$message.success('抽取任务已下达')
      } else {
        this.$message.error(result.msg)
      }
    },
    setting(row) {
      this.$emit('on-change-componet', 'Setting', row)
    },
    showSetting(type, row) {
      this.isSingle = type === 'single'
      if (this.isSingle) {
        this.clickRow = row
        this.visible = true
      } else {
        if (this.selectedRows.length < 1) {
          return this.$message.error('请选择至少一项')
        } else if (this.selectedRows.length > 3) {
          return this.$message.error('一个定时任务最多只能选择3项')
        }
        this.visible2 = true
      }
    },
    closeRegular() {
      this.visible2 = false
      this.regularId = ''
    },
    setRegular(data) {
      if (!data && !this.isSingle && this.selectedRows.length < 1) {
        this.$message.error('请选择至少一项')
      } else {
        if (data) {
          this.regularId = data.id
          // this.$refs.regular.handleGetRegularInfo(data.id)
        }
        this.visible2 = true
      }
    }
  }
}
</script>
