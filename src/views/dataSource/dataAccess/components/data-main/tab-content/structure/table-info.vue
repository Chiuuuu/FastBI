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
      type="primary"
      icon="left"
      @click="handleChangePage('minus')"
    />
    <a-button
      class="arrow arrow-right"
      :disabled="this.colPagination.page * this.colPagination.size >= this.colPagination.total"
      type="primary"
      icon="right"
      @click="handleChangePage('add')"
    />
    <a-spin style="padding: 0 50px" :spinning="spinning">
      <div class="table-area scrollbar">
        <table class="check-table">
          <thead>
            <tr>
              <th>序号</th>
              <th v-for="(item, index) in currentCol" :key="index" :title="item['COLUMN_NAME']">
                {{ item['COLUMN_NAME'] }}
                <span class="type">{{ item['TYPE_NAME'] | formatType }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
              <td>{{ index + 1 }}</td>
              <td
                v-for="(col, i) in currentCol"
                :key="i"
                :title="item[col['COLUMN_NAME']]"
              >{{ item[col['COLUMN_NAME']] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
      bodyStyle: { height: 'calc(100vh - 240px)', 'overflow-y': 'auto', padding: '0' },
      columns: [],
      currentCol: [],
      tableData: [],
      pageList: [],
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
        this.pageList = []
      }
    }
  },
  methods: {
    handleGetTableInfo() {
      const { size, page } = this.colPagination
      if (this.validPageSection()) {
        this.currentCol = this.columns.slice((page - 1) * size, page * size)
      } else {
        this.spinning = true
        const params = {
          id: this.tableId,
          size: size,
          page: page
        }
        this.$server.dataAccess
          .getTableInfo(params)
          .then((res) => {
            if (res.code === 200) {
              this.colPagination.total = res.total
              this.handleColCache(res.tableDataInfo)
            } else {
              this.$message.error(res.msg)
            }
          })
          .finally(() => {
            this.spinning = false
          })
      }
    },
    /**
     * 考虑到今后有可能有跳页和改变size的情况, 先实现一个方法缓存记录
     * 设置一个长度为total的数组, 请求的区间缓存到数组, 下请求前做校验
     */
    handleColCache(tableDataInfo) {
      const { size, page, total } = this.colPagination
      const start = size * (page - 1)
      const end = size * page > total ? total - 1 : size * page - 1
      if (this.pageList.length < 1) {
        this.pageList.length = total
        this.columns.length = total
      }
      // 将当前区间数据写入缓存
      for (let s = start; s <= end; s++) {
        this.pageList.splice(s, 1, s)
        this.columns.splice(s, 1, tableDataInfo.headers[s - start])
      }
      if (this.tableData.length > 0) {
        this.tableData.map((item, index) => {
          return Object.assign(item, tableDataInfo.rows[index])
        })
      } else {
        this.tableData = tableDataInfo.rows
      }
      this.currentCol = this.columns.slice((page - 1) * size, page * size)
    },
    // 校验当前缓存区间
    validPageSection() {
      const { size, page, total } = this.colPagination
      const start = size * (page - 1)
      const end = size * page > total ? total - 1 : size * page - 1
      if (total < 1) return false
      // 遍历当前区间是否存在缓存
      for (let s = start; s <= end; s++) {
        if (this.pageList[s] === undefined) {
          return false
        }
      }
      return true
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
.table-area {
  overflow: auto;
  height: calc(100vh - 240px);
}
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
  height: 100px;
  width: 23px;
}
.arrow-left {
  left: 10px;
}
.arrow-right {
  right: 10px;
}
</style>
