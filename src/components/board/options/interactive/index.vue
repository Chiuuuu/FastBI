<template>
  <!--互动-->
  <div class="data-Interactive">
    图表联动
    <div class="empty" @click="openBindWindow">创建图表联动</div>
    点击时进行图表联动
    <a-checkbox v-model="clickLink" @click.native="openLink" />

    <!--创建联动弹窗-->
    <a-modal v-model="visible" title="图表联动" @ok="setLinkage">
      <input
        type="text"
        :class="['ant-input', 'pick-input']"
        v-model="keyword"
        placeholder="请输入搜索内容"
      />
      <button class="ant-btn ant-btn-primary pick-btn" @click="search">
        搜索
      </button>
      <div class="pick-checkbox-box">
        <b-scrollbar style="height:100%;">
          <a-checkbox :checked="checkAll" @change="onCheckAllChange"
            >全选</a-checkbox
          >
          <div class="data-title">{{ currentData || '没有符合的结果' }}</div>
          <a-checkbox-group
            class="f-flexcolumn"
            v-model="bindList"
            @change="onChange"
          >
            <a-checkbox
              style="margin-top:5px"
              v-for="chart in chartList"
              :key="chart.id"
              :value="chart.id"
              :disabled="checkHaveBind() || checkBeBinded(chart)"
            >
              {{ chart.setting.config.title.content }}
              <span v-show="checkBeBinded(chart)">已存在于联动路径中</span>
              <span v-show="checkHaveBind">已被创建联动</span>
            </a-checkbox>
          </a-checkbox-group>
          <a-checkbox default-checked disabled
            >{{
              currSelected.setting.config.title.content
            }}（当前报表）</a-checkbox
          >
        </b-scrollbar>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      clickLink: false,
      visible: false,
      checkAll: false, // 是否全选标识
      keyword: '', // 搜索关键字
      bindList: [], // 绑定列表
      chartList: []
    }
  },
  mounted() {
    this.chartList = this.toBindList
    debugger
  },
  computed: {
    ...mapGetters([
      'currentSelected',
      'currSelected',
      'screenId',
      'canvasMap',
      'selectedModelList'
    ]),
    // 拖入一个维度的进入联动选择列
    toBindList() {
      //   let list = []
      //   this.canvasMap.forEach(item => {
      //     // 排除当前图表，用了同模型的图表都添加进选择列
      //     if (
      //       item.id !== this.currentSelected &&
      //       item.datamodelId === this.currSelected.datamodelId
      //     ) {
      //       list.push({
      //         label: item.setting.config.title.content,
      //         value: item.id
      //       })
      //     }
      //   })
      return this.canvasMap.filter(
        item =>
          item.id !== this.currentSelected &&
          item.datamodelId === this.currSelected.datamodelId
      )
    },
    // 当前图表对应的模型
    currentData() {
      // 没有使用数据文件
      if (
        !this.currSelected.datamodelId ||
        this.currSelected.datamodelId === '0'
      ) {
        return ''
      }
      // 找到当前使用的数据信息
      let obj = this.selectedModelList.find(
        item => item.tableId === this.currSelected.datamodelId
      )
      return obj.resourceName
    }
  },
  methods: {
    ...mapActions(['saveScreenData', 'updateChartData', 'refreshScreen']),
    openBindWindow() {
      this.bindList = []
      let apiData = this.currSelected.setting.api_data
      if (apiData.interactive && apiData.interactive.bindedList) {
        this.bindedList = apiData.interactive.bindedList
      }
      this.visible = true
    },
    // 模糊查询
    search() {
      if (!this.keyword) {
        this.chartList = this.toBindList
        return
      }
      this.chartList = this.toBindList.filter(
        item => item.indexOf(this.keyword) > -1
      )
    },
    // 点击全选
    onCheckAllChange(e) {
      this.checkAll = e.target.checked
      this.bindList = e.target.checked ? this.currentFile.originList : []
    },
    // 多选框变化的时候重新判断全选
    onChange() {
      this.checkAll = this.chartList.length === this.toBindList.length // 判断是否全选
    },
    // 是否开启图表联动
    openLink() {
      this.clickLink = !this.clickLink
      let apiData = this.currSelected.setting.api_data
      apiData.interactive = { clickLink: this.clickLink }
      this.$store.dispatch('SetSelfDataSource', apiData)
    },
    // 检查可选图表是否已经绑定当前图表
    checkBeBinded(chart) {
      let apiData = this.currSelected.setting.api_data
      if (apiData.interactive && apiData.interactive.beBinded === chart.id) {
        return true
      }
      return false
    },
    // 检查可选图表是否已经被其他图表绑定
    checkHaveBind() {
      let apiData = this.currSelected.setting.api_data
      if (
        apiData.interactive &&
        apiData.interactive.beBinded !== this.currentSelected
      ) {
        return true
      }
      return false
    },
    // 设置图表联动
    setLinkage() {
      //  保存被选中图表的联动列表
      let apiData = this.currSelected.setting.api_data
      apiData.interactive.bindedList = this.bindList
      this.$store.dispatch('SetSelfDataSource', apiData)

      // 锁定被关联的列表
      for (let id of this.bindList) {
        let chart = this.canvasMap.find(item => item.id === id)
        chart.beBinded = this.currentSelected
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import './screen-interactive.less';
</style>
