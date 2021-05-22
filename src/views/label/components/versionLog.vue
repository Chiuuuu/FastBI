<template>
  <a-modal
    width="70vw"
    title="标签版本记录"
    :visible="visible"
    :bodyStyle="bodyStyle"
    :footer="null"
    :maskClosable="false"
    :keyboard="false"
    @cancel="handleClose"
  >
    <div class="main main-padding">
      <a-row type="flex" justify="end">
        <a-button v-if="mode === 'list'" type="primary" @click="handleToDiff">对比</a-button>
        <a-button v-else-if="mode === 'diff'" type="default" @click="handleBackToList">返回</a-button>
      </a-row>

      <template v-if="mode === 'list'">
        <a-table
          rowKey="version"
          :columns="listColumn"
          :loading="listLoading"
          :data-source="listData"
          :row-selection="rowSelection"
          :pagination="false"
          :scroll="{ x: 'calc(70vw - 50px)', y: 'calc(100vh - 430px)' }"
        >
          <template #reason="text, record, index">
            <span>{{ text || '/' }}</span>
          </template>
        </a-table>

        <div class="list-pagination">
          <a-pagination
            v-if="listData.length > 0"
            showQuickJumper
            showSizeChanger
            :current="pagination.current"
            :pageSize="pagination.pageSize"
            :total="pagination.total"
            :show-total="total => `共${total}条记录`"
            @change="handlePageChange"
            @showSizeChange="handleSizeChange"
          ></a-pagination>
        </div>
      </template>

      <template v-else-if="mode === 'diff'">
        <!-- <a-table
          rowKey="version"
          :columns="listColumn"
          :loading="listLoading"
          :data-source="diffData"
          :pagination="false"
          :scroll="{ x: 'calc(70vw - 50px)', y: 'calc(100vh - 430px)' }">
        </a-table> -->
        <TextCompare :diff-data="diffData" :list-column="listColumn" />
      </template>
    </div>
  </a-modal>
</template>

<script>
import paginationMixin from '../mixins/pagination'
import TextCompare from './textCompare'

const listColumn = [
  {
    title: '版本号',
    width: 100,
    ellipsis: true,
    dataIndex: 'userVersion'
  },
  {
    title: '标签名称',
    width: 200,
    // ellipsis: true,
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '更新周期',
    width: 200,
    // ellipsis: true,
    dataIndex: 'updateTime',
    scopedSlots: { customRender: 'updateTime' }
  },
  {
    title: '达标模型',
    width: 200,
    // ellipsis: true,
    dataIndex: 'modelName',
    scopedSlots: { customRender: 'modelName' }
  },
  {
    title: '达标规则',
    width: 200,
    // ellipsis: true,
    dataIndex: 'condition',
    scopedSlots: { customRender: 'condition' }
  },
  {
    title: '标签描述',
    width: 300,
    // ellipsis: true,
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '操作人',
    width: 100,
    // ellipsis: true,
    dataIndex: 'modUserName',
    scopedSlots: { customRender: 'modUserName' }
  },
  {
    title: '修改原因',
    width: 300,
    ellipsis: true,
    dataIndex: 'reason',
    scopedSlots: { customRender: 'reason' }
  },
  {
    title: '操作时间',
    dataIndex: 'gmtModified',
    width: 180,
    ellipsis: true
  }
]

export default {
  name: 'versionLog',
  mixins: [paginationMixin],
  components: {
    TextCompare
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    rowSelection() {
      return {
        // fixed: true, // 高度不统一, 暂时先屏蔽
        selectedRowKeys: this.selectedRowKeys,
        onSelect: this.handleRowSelection,
        onSelectAll: this.handleRowSelectionAll
      }
    }
  },
  data() {
    return {
      mode: 'list',
      bodyStyle: { padding: '0', width: '70vw', height: 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      listLoading: false,
      listColumn,
      listData: [],
      selectedRows: [],
      selectedRowKeys: [],
      diffData: []
    }
  },
  mounted() {
    this.handleGetData()
  },
  methods: {
    // 达标规则字段格式化
    formatCondition(record) {
      const { pivotType, field, conditionType, conditionValue } = record
      const role = pivotType === 1 ? '维度' : '度量'
      let condition = ''
      switch (conditionType) {
        case 0:
          condition = '包含' + conditionValue
          break
        case 1:
          condition = '不包含' + conditionValue
          break
        case 2: { // 范围
          const value = conditionValue.split(',')
          condition = value[0] + '————' + value[1]
          break
        }
        case 3:
          condition = '大于' + conditionValue
          break
        case 4:
          condition = '小于' + conditionValue
          break
        case 5:
          condition = '大于等于' + conditionValue
          break
        case 6:
          condition = '小于等于' + conditionValue
          break
        case 7:
          condition = '等于' + conditionValue
          break
        case 8:
          condition = '不等于' + conditionValue
          break
        default:
          condition = '-'
          break
      }
      record.condition = `${role}【${field}】满足条件：${condition}`
    },
    handleRowSelection(record, selected, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRows.map(item => item.version)
      if (!selected) {
        for (let i = 0; i < this.diffData.length; i++) {
          const item = this.diffData[i]
          if (item.version === record.version) {
            this.diffData.splice(i, 1)
            break
          }
        }
      } else {
        if (!this.diffData.some(item => item.version === record.version)) {
          this.diffData.push(record)
          this.diffData = this.diffData.sort((a, b) => a.version - b.version)
        }
      }
    },
    handleRowSelectionAll(selected, selectedRows, changeRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRows.map(item => item.version)
      if (!selected) {
        changeRows.map(item => {
          for (let i = 0; i < this.diffData.length; i++) {
            const element = this.diffData[i]
            if (element.version === item.version) {
              this.diffData.splice(i, 1)
              break
            }
          }
        })
      } else {
        changeRows.map(item => {
          if (!this.diffData.some(d => d.version === item.version)) {
            this.diffData.push(item)
          }
        })
      }
    },
    handleClose() {
      this.diffData = []
      this.selectedRows = []
      this.selectedRowKeys = []
      this.handleResetForm()
      this.$emit('close')
    },
    // 进入对比界面
    handleToDiff() {
      if (this.diffData.length !== 2) {
        return this.$message.error('请选择2项记录进行对比')
      }
      this.mode = 'diff'
      this.listData = []
      // this.$nextTick(() => {
      //   this.handleGetCompareData()
      // })
    },
    // 返回列表
    handleBackToList() {
      this.mode = 'list'
      this.listData = []
      this.$nextTick(() => {
        this.handleGetData()
      })
    },
    // 切换页时渲染上次已勾选项
    renderSelectRows() {
      this.selectedRows = []
      this.selectedRowKeys = []
      this.listData.map(item => {
        if (this.diffData.some(key => key.version === item.version)) {
          this.selectedRows.push(item)
          this.selectedRowKeys.push(item.version)
        }
      })
    },
    async handleGetData() {
      this.listLoading = true

      const params = {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        id: this.rowData.id
      }
      const result = await this.$server.label.getLabelVersionList(params)
        .finally(() => {
          this.listLoading = false
        })
      if (result.code === 200) {
        this.listData = [].concat(result.rows.map(item => {
          // 在这直接新建一个属性condition, 以免后面都要format
          this.formatCondition(item)
          switch (item.updateTime) {
            case 0:
              item.updateTime = '每天'
              break
            case 1:
              item.updateTime = '每周'
              break
            case 2:
              item.updateTime = '每月'
              break
            case 3:
              item.updateTime = '不更新'
              break
            default:
              break
          }
          return item
        }))
        this.renderSelectRows()

        Object.assign(this.pagination, {
          current: params.current,
          total: result.total
        })
      } else {
        this.$message.error(result.msg || '请求错误')
      }
    },
    async handleGetCompareData() {
      this.listLoading = true

      const params = this.diffData.map(item => {
        return {
          id: item.id,
          version: item.version
        }
      })
      const result = await this.$server.label.actionLabelCompare(params)
        .finally(() => {
          this.listLoading = false
        })
      if (result.code === 200) {
        this.listData = [].concat(result.rows)
      } else {
        this.$message.error(result.msg || '请求错误')
      }
    },
    handleResetForm() {
      this.form = this.$options.data().form
      this.$refs.form && this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../common");
</style>
