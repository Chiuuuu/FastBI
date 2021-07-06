<template>
  <a-modal
    :visible="show"
    title="图表数据"
    width="750px"
    :footer="null"
    @cancel="$emit('cancel')"
    :getContainer="getContainer"
  >
    <div style="width:100%">
      <table class="chartdata-table">
        <tr class="table-tr">
          <th
            class="table-td"
            v-for="(value, index) in chartData.columns"
            :key="index"
          >
            {{ value }}
          </th>
        </tr>
        <tr
          class="table-tr"
          v-for="(row, index) in chartData.rows"
          :key="index"
        >
          <td class="table-td" v-for="(value, key) in row" :key="key">
            {{ value }}
          </td>
        </tr>
      </table>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    chartData: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  inject:{
    dvScreenDom:{
      default:''
    }
  },
  methods:{
    // 全屏下，内容挂在dvScreen元素下（screen.vue）可显示，默认挂在body下
    getContainer(e){
      return this.dvScreenDom ? this.dvScreenDom() : document.body;
    }
  }
}
</script>
<style lang="less" scoped>
.chartdata-table {
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0px;
  overflow: scroll;
  border-left: 1px solid black;
  border-top: 1px solid black;
  .table-td {
    padding: 10px;
    text-align: center;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
  }
}
</style>
