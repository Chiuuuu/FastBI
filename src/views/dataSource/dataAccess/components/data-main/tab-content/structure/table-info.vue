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
      <a-row type="flex" justify="space-between" align="middle">
        <a-col v-if="colPagination.page !== 1" :span="1">
          <a-button type="default" icon="left" @click="handleChangePage('minus')" />
        </a-col>
        <a-col :span="autoSpan">
          <table class="check-table">
            <thead>
              <tr>
                <th>序号</th>
                <th v-for="(item, index) in columns" :key="index" :title="item['COLUMN_NAME']">
                  {{ item['COLUMN_NAME'] }}
                  <span class="type">{{ item['TYPE_NAME'] | formatType }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tableData" :key="index">
                <td>{{ index + 1 }}</td>
                <td v-for="(col, i) in columns" :key="i" :title="item[col['COLUMN_NAME']]">{{ item[col['COLUMN_NAME']] }}</td>
              </tr>
            </tbody>
          </table>
        </a-col>
        <a-col v-if="colPagination.page * colPagination.size < colPagination.total" :span="1">
          <a-button type="default" icon="right" @click="handleChangePage('add')" />
        </a-col>
      </a-row>
      <a-empty class="table-empty" v-if="tableData.length === 0"></a-empty>
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
      tableData: [],
      colPagination: {
        total: 0,
        size: 50,
        page: 1
      }
    }
  },
  computed: {
    autoSpan() {
      const left = this.colPagination.page !== 1
      const right = this.colPagination.page * this.colPagination.size < this.colPagination.total
      if (left && right) {
        return 22
      } else if (left || right) {
        return 23
      } else {
        return 24
      }
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
        this.colPagination = {
          total: 0,
          size: 50,
          page: 1
        }
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
      const params = {
        id: this.tableId,
        size: this.colPagination.size,
        page: this.colPagination.page
      }
      this.$server.dataAccess.getTableInfo(params)
        .then(res => {
          if (res.code === 200) {
            this.columns = res.tableDataInfo.headers
            this.tableData = res.tableDataInfo.rows
            this.colPagination.total = res.total
          } else {
            this.$message.error(res.msg)
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    handleChangePage(type) {
      if (type === 'add') {
        this.colPagination.page++
      } else if (type === 'minus') {
        this.colPagination.page--
      }
      this.handleGetTableInfo()
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
  .table-empty {
    padding: 20px 0;
    margin: 0;
    border-right: 1px solid #e8e8e8;
    border-left: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }
</style>
