<template>
  <div>
    <div class="search_bar">
      <!-- <a-radio-group class="search_radio" v-model="tableType" @change="handleTableTypeChange">
        <a-radio-button value="1">原始表</a-radio-button>
        <a-radio-button value="2">自定义表</a-radio-button>
      </a-radio-group> -->
      <a-row type="flex" justify="end" align="middle">
        <!-- <a-col style="margin-right:auto">
          <a-input placeholder="请输入关键词" class="search_input">
            <a-icon slot="prefix" type="search" />
          </a-input>
        </a-col> -->
        <a-col>
          <a-button type="primary" class="select_button" @click="handleGetData" :loading="spinning">刷新数据</a-button>
          <a-button type="primary" style="margin:0 10px;" class="select_button" @click="showExtractLog">抽取记录</a-button>
          <a-button type="primary" class="select_button" @click="handleExtract" :loading="extractSping">全部抽取</a-button>
          <a-button type="primary" style="margin:0 10px;" @click="showSetting('batch')" class="select_button">批量抽取设置</a-button>
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
    <div class="table">
      <a-table :row-selection="rowSelection" :columns="columns" :data-source="data"  rowKey='id' :loading='spinning' :pagination='false'>
        <span slot="set" slot-scope="set">
          {{ set ? '是' : '否' }}
        </span>
        <span slot="extracted" slot-scope="extracted">
          {{ extracted ? '是' : '否' }}
        </span>
        <span slot="config" slot-scope="row">
          <a v-on:click="setting(row)">{{row.set ? '字段编辑' : '字段设置' }}</a>
        </span>
        <span slot="regular" slot-scope="row">
          <a v-on:click="showSetting('single', row)">定时设置</a>
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
          <template #state="text, row">
            <span v-if="text === 1">成功</span>
            <span v-else-if="text === 2">失败</span>
            <div v-else-if="text === 3">
              <span>正在抽取中</span>
              <!-- <a-progress :percent="row.progress" /> -->
            </div>
          </template>
        </a-table>
      </a-modal>
      <extract-setting :show="visible" :single="isSingle" :form-data="extractForm" :row="clickRow" @close="visible = false" @setRegular="setRegular" />
      <regular-setting :show="visible2" :show-table="!isSingle" :table-list="selectedRows" :form-data="regularForm" @close="closeRegular" />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import RegularSetting from './regular'
import ExtractSetting from './extract'

const logColumns = [
  {
    title: '抽取任务名称',
    align: 'center',
    dataIndex: 'name'
  },
  {
    title: '抽取开始时间',
    align: 'center',
    width: 150,
    dataIndex: 'starttime'
  },
  {
    title: '耗时',
    align: 'center',
    dataIndex: 'duration'
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '同步的数据量',
    align: 'center',
    dataIndex: 'async'
  },
  {
    title: '报错信息',
    align: 'center',
    dataIndex: 'error'
  },
  {
    title: '关联表同步数量',
    align: 'center',
    dataIndex: 'relation'
  }
]

const columns = [
  {
    title: '表名',
    dataIndex: 'name',
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
    title: '修改时间',
    key: 'gmtModified',
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
      tableType: '1',
      visible: false, // 批量设置定时弹窗
      visible1: false, // 抽取记录弹窗
      visible2: false, // 添加定时任务弹窗
      regularForm: '',
      extractForm: '',
      isSingle: false,
      spinning: true,
      selectedRows: [],
      extractSping: false,
      modalSpin: false,
      clickRow: '',
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
      modelType: state => state.dataAccess.modelType
    })
  },
  methods: {
    handleTableTypeChange(event) {
      this.tableType = event.target.value
    },
    async handleGetData() {
      if (!this.modelType) return
      this.spinning = true
      const modelKey = this.modelType === 'oracle' ? 'sourceOracleName' : 'sourceMysqName'
      // sql, oracle的数据库名称在formInfo里, excel的在dabaseName里
      const databaseName = this.formInfo && this.formInfo.databaseName ? this.formInfo.databaseName : this.databaseName
      const dabaseInfoResult = await this.$server.dataAccess.getTableList({
        databaseName,
        sourceId: this.modelId
      }).finally(() => {
        this.spinning = false
      })
      if (dabaseInfoResult.code === 200) {
        this.data = [].concat(dabaseInfoResult.rows)
        this.$store.dispatch('dataAccess/setReadRows', this.data)
      } else {
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
      const logData = []
      for (let i = 0; i < 30; i++) {
        logData.push({
          id: i + '',
          name: '任务' + i,
          starttime: '2020-10-26 11:11:11',
          duration: '20s',
          state: 1,
          progress: 70,
          async: 20,
          error: 2,
          relation: 10
        })
      }
      setTimeout(() => {
        this.logData = logData
        this.modalSpin = false
      }, 1000)
    },
    async handleExtract() {
      if (this.selectedRows.length === 0) {
        return this.$message.error('请选择至少一项')
      } else if (this.selectedRows.length > 10) {
        return this.$message.error('一次抽取最多只能选择10个')
      }
      const rows = this.selectedRows.map(item => {
        // sql, oracle的数据库名称在formInfo里, excel的在dabaseName里
        const databaseName = this.formInfo && this.formInfo.databaseName ? this.formInfo.databaseName : this.databaseName
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
      })
      // if (this.modelType === 'mysql') {
      //   result = await this.$server.dataAccess.actionExtract('/datasource/mysql/datax/extract', {
      //     rows: rows,
      //     tableList: this.data
      //   }).finally(() => {
      //     this.extractSping = false
      //   })
      // } else if (this.modelType === 'oracle') {
      //   result = await this.$server.dataAccess.actionExtract('/datasource/oracle/datax', {
      //     rows: rows
      //   }).finally(() => {
      //     this.extractSping = false
      //   })
      // }

      if (result.code === 200) {
        this.$message.success('请刷新数据查看状态')
      } else {
        this.$message.error(result.msg)
      }
    },
    setting(row) {
      this.$emit('on-change-componet', 'Setting', row)
    },
    async showSetting(type, row) {
      this.isSingle = type === 'single'
      if (this.isSingle) {
        this.clickRow = row
      } else {
        // if (this.selectedRows.length < 1) {
        //   return this.$message.error('请选择至少一项')
        // }
      }
      this.visible = true
      this.modalSpin = true
      setTimeout(() => {
        this.modalSpin = false
      }, 300)
    },
    closeRegular() {
      this.visible2 = false
    },
    setRegular(form) {
      if (!form && !this.isSingle && this.selectedRows.length < 1) {
        this.$message.error('请选择至少一项')
      } else {
        this.visible2 = true
        this.regularForm = form || ''
      }
    }
  }
}
</script>
