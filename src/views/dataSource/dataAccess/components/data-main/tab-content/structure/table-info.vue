<template>
  <a-modal
    title="查看表信息"
    width="920px"
    :bodyStyle="bodyStyle"
    :footer="null"
    :visible="show"
    @cancel="$emit('close')"
  >
    <a-button
      class="arrow arrow-left"
      :disabled="this.colPagination.page === 1"
      type="default"
      icon="left"
      @click="handleChangePage('minus')"
    />
    <a-button
      class="arrow arrow-right"
      :disabled="this.colPagination.page * this.colPagination.size >= this.colPagination.total"
      type="default"
      icon="right"
      @click="handleChangePage('add')"
    />
    <a-spin style="padding: 0 20px" :spinning="spinning">
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
            <td
              v-for="(col, i) in columns"
              :key="i"
              :title="item[col['COLUMN_NAME']]"
            >{{ item[col['COLUMN_NAME']] }}</td>
          </tr>
        </tbody>
      </table>
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
      bodyStyle: { height: 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      columns: [],
      tableData: [],
      pageList: {},
      colPagination: {
        total: 0,
        size: 50,
        page: 1
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
        this.colPagination = this.$options.data().colPagination
        this.handleGetTableInfo()
      } else {
        this.columns = []
        this.tableData = []
        this.pageList = {}
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
      if (this.pageList[params.page]) {
        this.spinning = false
        this.columns = this.pageList[params.page].headers
        this.tableData = this.pageList[params.page].rows
      } else {
        this.$server.dataAccess
          .getTableInfo(params)
          .then((res) => {
            if (res.code === 200) {
              this.pageList[params.page] = res.tableDataInfo
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
      }
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
  td,
  th {
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
.arrow {
  position: absolute;
  z-index: 2001;
  top: 50%;
}
.arrow-left {
  left: 10px;
}
.arrow-right {
  right: 10px;
}
</style>
