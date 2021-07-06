<template>
  <div class="dialog" @click.self="close">
    <div class="dialog-container">
      <div class="dialog-title">图表数据</div>
      <div class="content scrollbar">
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
      <div class="close-btn" @click="close">
        <a-icon type="close" />
      </div>
    </div>
  </div>
  <!-- <a-modal
    :visible="true"
    title="图表数据"
    width="750px"
    :footer="null"
    @cancel="close"
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
  </a-modal> -->
</template>
<script>
export default {
  props: {
    chartData: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  methods: {
    close() {
      this.$destroy()
      this.$el.remove()
    }
  }
}
</script>
<style lang="less" scoped>
.dialog {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  .dialog-container {
    width: 500px;
    height: 380px;
    background: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    position: relative;
    .dialog-title {
      width: 100%;
      height: 60px;
      font-size: 18px;
      color: #696969;
      font-weight: 600;
      padding: 16px 50px 0 20px;
      box-sizing: border-box;
    }
    .content {
      height: 320px;
      color: #797979;
      line-height: 26px;
      padding: 0 20px;
      box-sizing: border-box;
      overflow: scroll;
      .chartdata-table {
        height: 100%;
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
    }
    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 18px;
      cursor: pointer;
      color: black;
      &:hover {
        font-weight: 600;
      }
    }
  }
}
.scrollbar {
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.4);
    -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
  }
  &::-webkit-scrollbar-track {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
    background-color: white;
  }
  &::-webkit-scrollbar-track:hover {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
    background-color: rgba(0, 0, 0, 0.01);
  }
}
</style>
