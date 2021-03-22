<template>
  <a-modal
    class="widthModal"
    :visible="isShow"
    :title="item.name"
    width="1000px"
    :afterClose="handleAfterClose"
    @cancel="handleClose"
  >
    <template #footer>
      <a-button key="back" @click="handleClose">
        取消
      </a-button>
    </template>
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
    <a-spin style="padding: 0 50px;" :spinning="loading">
      <a-empty v-if="tableData.length === 0" class="main-empty"></a-empty>
      <div class="table-area" v-else>
        <table class="table">
          <thead>
            <tr>
              <th>
                <div class="txt-wrap">
                  <div class="txt txt-order">序号</div>
                  <div class="hr" data-resize="true"></div>
                </div>
              </th>
              <template v-for="item in currentCol">
                <th :key="item.name">
                  <div class="wrap">
                    <div class="txt" :title="item.name">
                      <span class='txt-title'>{{item.name}}</span>
                    </div>
                  </div>
                </th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in tableData" :key="index">
              <td><div class="txt txt-order">{{index+1}}</div></td>
              <td
                v-for="(col, i) in currentCol"
                :key="i"
                :title="item[col.name]"
              ><div class="txt" :title="item[col.name]">{{ item[col.name] }}</div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: 'renderTableInfo',
  props: {
    isShow: Boolean,
    item: {
        type: Object,
        default: () => {}
    }
  },
  data() {
    return {
      columns: [],
      currentCol: [],
      pageList: [],
      tableData: [],
      colPagination: {
        total: 0,
        size: 50,
        page: 1
      },
      data: [],
      loading: true
    }
  },
  watch: {
    isShow: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.handleGetData()
        }
      }
    }
  },
  methods: {
    /**
     * 获取数据
    */
    async handleGetData() {
      const { size, page } = this.colPagination
      if (this.validPageSection()) {
        this.currentCol = this.columns.slice((page - 1) * size, page * size)
      } else {
        this.loading = true
        const result = await this.$server.dataModel.getTableDetailInfo({
          tableName: this.item.name,
          tableId: this.item.id,
          databaseId: this.item.databaseId,
          current: page,
          columnSize: size
        })

        if (result.code === 200) {
          this.colPagination.total = result.data.total
          this.handleColCache(result.data)
          this.$nextTick(() => {
            this.loading = false
          })
        } else {
          this.$message.error(result.msg, 1).then(() => {
              this.loading = false
          })
        }
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
        this.columns.splice(s, 1, tableDataInfo.columnNameList[s - start])
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
      this.handleGetData()
    },
    handleClose() {
      this.$emit('close')
    },
    handleAfterClose() {
      this.tableData = this.$options.data().tableData
      this.currentCol = this.$options.data().currentCol
      this.columns = this.$options.data().columns
      this.pageList = this.$options.data().pageList
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.widthModal {
  @{deep} .ant-modal-body{
    padding: 0;
  }
}
.table-area {
  overflow: auto;
  height: calc(60vh - 10px);
}
.table {
  table-layout: fixed;
  min-width: 100%;
  white-space: nowrap;
  th {
    background: #fff;
  }
  td {
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
  }
  th,td {
    padding: 0 12px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #efefef;
  }
  .txt-wrap {
    position: relative;
    min-width: 10px;
    width: 30px;
    .hr {
      width: 3px;
      height: 30px;
      border: none;
      cursor: col-resize;
      position: absolute;
      top: 0;
      right: -20px;
    }
  }
  .txt {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 168px;
    white-space: nowrap;
    .txt-title {
      max-width: 100px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: bottom;
    }
  }
  .txt-order {
    width: 50px;
  }
  .menu-left {
    float: left;
    position: relative;
  }
  .wrap .txt {
    width: auto;
  }
  tbody tr:nth-child(odd) {
    background: #f5f5f5;
  }
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
