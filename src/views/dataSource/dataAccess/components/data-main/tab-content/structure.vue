<template>
  <div>
    <div class="search_bar">
      <a-row type="flex" justify="end" align="middle">
        <!-- <a-col style="margin-right:auto">
          <a-input placeholder="请输入关键词" class="search_input">
            <a-icon slot="prefix" type="search" />
          </a-input>
        </a-col> -->
        <a-col>
          <a-button type="primary" style="margin:0 10px;" class="select_button" @click="handleExtract" :loading="extractSping">全部抽取</a-button>
          <a-button type="primary" class="select_button" @click="handleGetData" :loading="spinning">刷新数据</a-button>
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
          <a v-on:click="setting(row)">{{row.set ? '编辑' : '设置' }}</a>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
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
  }
]

export default {
  name: 'tabContentStructure',
  data() {
    return {
      columns,
      data: [],
      spinning: true,
      selectedRows: [],
      extractSping: false,
      rowSelection: {
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows)
          this.selectedRows = selectedRows
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows)
          this.selectedRows = selectedRows
        }
      }
    }
  },
  computed: {
    ...mapState({
      formInfo: state => state.dataAccess.modelInfo,
      modelId: state => state.dataAccess.modelId,
      databaseid: state => state.dataAccess.databaseid,
      modelInfo: state => state.dataAccess.modelInfo,
      modelType: state => state.dataAccess.modelType
    })
  },
  methods: {
    handleChangeType(stringBoolean) {
      return stringBoolean === 1
    },
    async handleGetData() {
      if (!this.modelType) return
      this.spinning = true
      const modelKey = this.modelType === 'oracle' ? 'sourceOracleName' : 'sourceMysqName'
      const dabaseInfoResult = await this.$server.dataAccess.getTableList({
        databaseName: this.formInfo.databaseName,
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
    async handleExtract() {
      if (this.selectedRows.length === 0) {
        return this.$message.error('请选择至少一项')
      } else if (this.selectedRows.length > 10) {
        return this.$message.error('一次抽取最多只能选择10个')
      }
      const rows = this.selectedRows.map(item => {
        const _item = {
          databaseName: this.modelInfo.databaseName,
          sourceId: this.modelId,
          sourceName: this.formInfo.name,
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
    }
  }
}
</script>
