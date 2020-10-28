<template>
  <a-modal
    class="widthModal"
    :visible="isShow"
    title="查看宽表"
    width="1000px"
    okText="导出宽表"
    :destroyOnClose="true"
    :okButtonProps="{
      props: { disabled: data.length > 0 ? false : true },
    }"
    @ok="handleExport"
    @cancel="handleClose"
  >
    <a-spin :spinning="loading">
      <a-empty v-if="data.length === 0" class="main-empty">
        <span slot="description">此宽表无数据</span>
      </a-empty>
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
              <template v-for="item in columns">
                <th :key="item.title">
                  <div class="wrap">
                    <!-- <div class="menu-left">
                      <i class="u-icn u-icn-string"></i>
                    </div> -->
                    <div class="txt" :title="item.title">{{item.title}}</div>
                  </div>
                </th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in data" :key="index">
              <td><div class="txt txt-order">{{index+1}}</div></td>
              <td v-for="subitem in columnsList" :key="subitem.name">
                <div class="txt" :title="item[subitem.name]">{{item[subitem.name]}}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
const columns = [
  {
    title: '序号',
    width: 20,
    dataIndex: 'order_name1',
    key: 'order_name1'
  },
  {
    title: '产品ID',
    width: 25,
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '产品名称',
    dataIndex: 'create_time1',
    key: 'create_time1',
    width: 40
  },
  {
    title: '发货日期',
    dataIndex: 'order_name2',
    key: 'order_name2',
    width: 40
  },
  {
    title: '国家',
    dataIndex: 'order_time2',
    key: 'order_time2',
    width: 20
  },
  {
    title: '地区',
    dataIndex: 'id1',
    key: 'id1',
    width: 20
  }
]

export default {
  props: {
    isShow: Boolean,
    detailInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      columns: [],
      columnsList: [],
      data: [],
      loading: true
    }
  },
  watch: {
    isShow:{
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
     * 重置data数据
    */
    handleResetData() {
      Object.assign(this.$data, this.$options.data())
    },
    /**
     * 获取数据
    */
    async handleGetData() {
      this.handleResetData()

      // 设置表头
      this.handleFormatTableColumn();
      const result = await this.$server.dataModel.getWidthTableInfo(this.detailInfo)
      this.columnsList = result.data.columnNameList
      this.data = result.data.rows
      this.$nextTick(()=> {
        this.loading = false
      })
    },
    /**
     * 表格column处理
     */
    handleFormatTableColumn() {
      this.columns = []
      // 注意先执行维度的
      this.handleDoWithColumn(this.$parent.dimensions)
      this.handleDoWithColumn(this.$parent.measures)
    },
    /**
     * 处理表头
    */
    handleDoWithColumn(obj) {
      if (obj) {
        Object.keys(obj).map(key => {
          const keyArry = obj[key]
          keyArry.forEach((item, index) => {
            this.columns.push({
              title: item.alias
            })
          })
        })
      }
    },
    handleExport() {
      this.handleClose()
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.widthModal {
  /deep/.ant-modal-body{
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
</style>
