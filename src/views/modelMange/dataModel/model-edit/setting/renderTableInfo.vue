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
    <a-spin :spinning="loading">
      <a-empty v-if="data.length === 0" class="main-empty"></a-empty>
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
              <template v-for="item in columnsList">
                <th :key="item.title">
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
            <tr v-for="(item,index) in data" :key="index">
              <td><div class="txt txt-order">{{index+1}}</div></td>
              <td v-for="(subitem,subIndex) in item" :key="subIndex">
                <div class="txt" :title="subitem">{{subitem}}</div>
              </td>
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
      columnsList: [],
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
      this.loading = true
      const result = await this.$server.dataModel.getTableDetailInfo({
        tableName: this.item.name,
        tableId: this.item.id,
        databaseId: this.item.databaseId
      })

      if (result.code === 200) {
        this.columnsList = result.data.columnNameList
        this.data = result.data.rows
        this.$nextTick(() => {
          this.loading = false
        })
      } else {
        this.$message.error(result.msg, 1).then(() => {
            this.loading = false
        })
      }
    },
    handleClose() {
      this.$emit('close')
    },
    handleAfterClose() {
      this.data = this.$options.data().data
      this.columnsList = this.$options.data().columnsList
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
</style>
