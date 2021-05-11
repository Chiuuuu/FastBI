<template>
  <!--互动-->
  <div class="data-Interactive">
    <div class="empty" style="cursor: pointer" @click="openBindWindow">
      创建合并
    </div>

    <!--创建联动弹窗-->
    <a-modal v-model="visible" title="合并" @ok="mergeData">
      <input
        type="text"
        :class="['ant-input', 'pick-input']"
        v-model="keyword"
        placeholder="请输入搜索内容"
      />
      <button class="ant-btn ant-btn-primary pick-btn" @click="search">
        搜索
      </button>
      <!--模型列表多选-->
      <div class="pick-checkbox-box">
        <b-scrollbar style="height:100%;">
          <div class="data-title">{{ currentData || '没有符合的结果' }}</div>
          <a-radio-group class="f-flexcolumn" v-model="mergeId">
            <div
              class="f-flexcolumn"
              v-for="chart in chartList"
              :key="chart.id"
            >
              <a-radio style="margin-top:5px" :value="chart.id">
                {{ chart.setting.config.title.content }}
              </a-radio>
            </div>
          </a-radio-group>
          <a-radio style="margin-top:5px" default-checked disabled
            >{{
              currSelected.setting.config.title.content
            }}（当前报表）</a-radio
          >
        </b-scrollbar>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
export default {
  data() {
    return {
      visible: false,
      checkAll: false, // 是否全选标识
      keyword: '', // 搜索关键字
      mergeId: '', // 绑定的图表id
      chartList: []
    }
  },
  computed: {
    ...mapGetters([
      'currentSelected',
      'currSelected',
      'canvasMap',
      'selectedModelList'
    ]),
    // 拖入一个维度的进入联动选择列
    toBindList() {
      // 排除当前图表id
      let excludeId = this.currentSelected
      let list = this.canvasMap.filter(item => {
        let canBind =
          item.id !== excludeId && // 排除当前图表
          item.setting.api_data.source && // 有数据的图表
          item.setting.api_data.dimensions[0].alias ===
            this.currSelected.setting.api_data.dimensions[0].alias // 相同维度
        // 柱状图折线图相互合并
        if (this.currSelected.setting.chartType === 'v-line') {
          return canBind && item.setting.chartType === 'v-histogram'
        } else {
          return canBind && item.setting.chartType === 'v-line'
        }
      })
      return list
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
        item => item.modelid === this.currSelected.datamodelId
      )
      return obj.modelname
    }
  },
  methods: {
    ...mapActions(['updateChartData']),
    openBindWindow() {
      // 获取可选列表
      this.chartList = this.toBindList
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
    // 合并数据
    async mergeData() {
      if (!this.mergeId) {
        this.$message.error('请选择合并图表')
        return
      }

      let apiData = this.currSelected.setting.api_data
      let chart = this.toBindList.find(item => item.id === this.mergeId)
      let chartApiData = chart.setting.api_data

      // 度量不能重复合并
      let testMeasureList = apiData.measures.concat(chartApiData.measures)
      let uniqList = _.uniqBy(testMeasureList, 'alias')
      if (uniqList.length !== testMeasureList.length) {
        this.$message.error('包含相同度量不能合并')
        return
      }

      // 合并度量
      // 柱状图+折线图
      if (this.currSelected.setting.chartType === 'v-histogram') {
        apiData.mixMeasures = chartApiData.measures
      }
      // 折线图+柱状图
      if (this.currSelected.setting.chartType === 'v-line') {
        apiData.mixMeasures = apiData.measures
        apiData.measures = chartApiData.measures
      }

      // 合并数据
      apiData.source.rows.forEach((row, i) => {
        row = Object.assign({}, row, chartApiData.source.rows[i])
        this.$set(apiData.source.rows, i, row)
      })
      // 添加合并度量
      apiData.source.columns = apiData.source.columns.concat(
        chartApiData.source.columns
      )
      apiData.source.columns = [...new Set(apiData.source.columns)]

      // 添加折线显示配置
      let showLine = apiData.mixMeasures.map(item => item.alias)
      this.currSelected.setting.apis.showLine = showLine
      this.$store.dispatch('SetApis', this.currSelected.setting.apis)

      // 生成混合图
      this.$set(this.currSelected.setting, 'chartType', 'v-histogramAndLine')
      this.$set(this.currSelected, 'name', '混合折线图')
      this.$set(this.currSelected.setting, 'name', 've-histogram')

      // 保存合并图表
      this.updateChartData()
      this.visible = false
    }
  }
}
</script>
