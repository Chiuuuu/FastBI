<template>
  <a-modal
    title="查看表信息"
    width="920px"
    :bodyStyle="bodyStyle"
    :footer="null"
    :visible="show"
    @cancel="$emit('close')"
  >
    <a-spin :spinning="spinning">
      <table class="check-table">
        <thead>
          <tr>
            <th>序号</th>
            <th v-for="(item, index) in columns" :key="index">
              {{ item['COLUMN_NAME'] }}
              <span class="type">{{ item['TYPE_NAME'] | formatType }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <td>{{ index + 1 }}</td>
            <td v-for="(col, i) in columns" :key="i">{{ item[col['COLUMN_NAME']] }}</td>
          </tr>
        </tbody>
      </table>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: 'tableInfo',
  props: {
    show: Boolean,
    tableId: String
  },
  data() {
    return {
      spinning: false,
      bodyStyle: { 'maxHeight': 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      columns: [],
      tableData: []
    }
  },
  filters: {
    formatType: function(value) {
      switch (value) {
        case 'BIGINT':
          return '整数'
        case 'TIMESTAMP':
          return '日期时间'
        case 'DATE':
          return '日期'
        case 'DOUBLE':
          return '小数'
        case 'VARCHAR':
          return '字符串'
        default:
          return '字符串'
      }
    }
  },
  watch: {
    show(newValue, oldValue) {
      if (newValue) {
        this.handleGetTableInfo()
      } else {
        this.columns = []
        this.tableData = []
      }
    }
  },
  methods: {
    handleGetTableInfo() {
      this.spinning = true
      this.$server.dataAccess.getTableInfo(this.tableId)
        .then(res => {
          if (res.code === 200) {
            this.columns = res.headers
            this.tableData = res.rows
          } else {
            this.$message.error(res.msg)
          }
        })
        .finally(() => {
          this.spinning = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .check-table {
    width: 100%;
    border: 1px solid #e8e8e8;
    td, th {
      font-size: 14px;
      height: 21px;
      padding: 8px;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    th {
      background: #f8f8fa;
    }
    tr {
      border-top: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
    }
    .type {
      font-size: 12px;
      color: #9c9c9c;
      font-weight: normal;
    }
  }
</style>
