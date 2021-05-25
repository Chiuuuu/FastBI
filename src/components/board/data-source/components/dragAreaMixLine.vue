<template>
  <!-- 柱状折线图折线度量 -->
  <div
    class="dragArea"
    :class="{
      'dragable-vaild': isdrag
    }"
    @drop.stop.prevent="handleDropOnFilesWD($event)"
    @dragover.stop.prevent
    @dragenter="dragenter"
    @dragleave="dragleave"
  >
    <div v-if="fileList.length > 0">
      <div
        :class="['field', { error: item.status === 1 }]"
        v-for="(item, index) in fileList"
        :key="index"
        @contextmenu.prevent="showMore(item)"
      >
        <a-dropdown :trigger="['click', 'contextmenu']" v-model="item.showMore">
          <a-icon class="icon-more" type="caret-down" />
          <a-menu slot="overlay" @click="deleteFile(item, index)">
            <a-menu-item key="3">移除</a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-tooltip :title="item.alias">
          <span ref="itemName" class="field-text">{{ item.alias }}</span>
        </a-tooltip>
      </div>
    </div>
    <div class="empty" :class="{ field: isdrag }">
      拖入度量
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { deepClone } from '@/utils/deepClone'
import { sum, summary } from '@/utils/summaryList'
import navigateList from '@/config/navigate' // 导航条菜单

export default {
  data() {
    return {
      current: {},
      selected: {},
      isdrag: false, // 是否拖拽中
      fileList: [], // 维度字段数组
      isVaild: false //
    }
  },
  inject: ['errorFile'],
  watch: {
    currSelected: {
      handler(val) {
        if (val) {
          // 当前选中的图表显示维度度量的数据
          this.fileList = []
          if (val.setting.api_data.mixMeasures) {
            // 度量
            this.fileList = deepClone(val.setting.api_data.mixMeasures)
          }
        }
      },
      deep: true,
      immediate: true
    },
    errorFile: {
      handler(val) {
        if (val) {
          if (this.fileList) {
            // 度量
            this.fileList.forEach(file => {
              let measure = val.mixMeasures.find(
                item => item.alias === file.alias
              )
              if (measure && measure.status === 1) {
                file.status = measure.status
              }
            })
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters([
      'dragFile',
      'currentSelected',
      'currSelected',
      'optionsTabsType',
      'dataModel',
      'canvasMap'
    ])
  },
  methods: {
    ...mapActions(['saveScreenData', 'updateChartData']),
    // 将拖动的维度到所选择的放置目标节点中
    handleDropOnFilesWD(event) {
      // h5 api
      let dataFile = JSON.parse(event.dataTransfer.getData('dataFile'))
      if (
        this.currSelected.datamodelId &&
        this.currSelected.datamodelId !== '0' &&
        this.currSelected.datamodelId !== dataFile.datamodelId
      ) {
        this.$message.error('一个图表只能拖入一个数据模型的字段')
        this.isdrag = false
        return false
      }
      if (this.currSelected.setting.api_data.measures.length === 0) {
        this.$message.error('请先拖入柱状数据')
        this.isdrag = false
        return false
      }
      if (
        this.currSelected.setting.api_data.measures.some(
          item => item.alias === dataFile.alias
        )
      ) {
        this.$message.error('数据重复')
        this.isdrag = false
        return false
      }
      dataFile.showMore = false // 是否点击显示更多
      this.fileList.push(dataFile)
      this.fileList = this.uniqueFun(this.fileList, 'alias')
      this.getData()
      this.isdrag = false
    },
    // 对象数组去重,type表示对象里面的一个属性
    uniqueFun(arr, type) {
      const res = new Map()
      return arr.filter(a => !res.has(a[type]) && res.set(a[type], 1))
    },
    // 当可拖动的元素进入可放置的目标时
    dragenter(event) {
      event.preventDefault()
      this.isdrag = true
    },
    // 当拖动元素离开可放置目标节点
    dragleave(event) {
      event.preventDefault()
      this.isdrag = false
    },
    // 点击右键显示更多
    showMore(item) {
      item.showMore = true
    },
    // 删除当前维度或者度量
    deleteFile(item, index) {
      this.fileList.splice(index, 1)
      this.getData()
    },
    // 根据维度度量获取数据
    getData() {
      let selected = this.canvasMap.find(
        item => item.id === this.currentSelected
      )
      // 混合折线度量
      selected.setting.api_data.mixMeasures = this.fileList

      if (
        (!selected.datamodelId || selected.datamodelId === '0') &&
        this.fileList.length > 0
      ) {
        // modelId 赋值
        selected.datamodelId = this.fileList[0].datamodelId
        selected.setting.api_data.modelId = parseInt(
          this.fileList[0].datamodelId
        )
      }
      this.updateChartData()

      let data = this.currSelected.setting.api_data
      if (
        data.dimensions.length === 0 &&
        data.measures.length === 0 &&
        data.mixMeasures.length === 0
      ) {
        selected.datamodelId = 0
        selected.setting.api_data.modelId = 0
        selected.setting.isEmpty = false
        this.updateChartData()
        return
      }
      if (
        data.dimensions.some(item => item.status === 1) ||
        data.measures.some(item => item.status === 1) ||
        data.mixMeasures.some(item => item.status === 1)
      ) {
        return
      }

      let params = deepClone(selected)
      // 折线度量合到度量做请求
      params.setting.api_data.measures = params.setting.api_data.measures.concat(
        params.setting.api_data.mixMeasures
      )
      let apiData = deepClone(this.currSelected.setting.api_data)
      this.$server.screenManage.getData(params).then(res => {
        res.rows = res.rows.filter(item => !Object.values(item).includes(null))
        selected.setting.isEmpty = false
        // 数据源被删掉
        if (res.code === 500 && res.msg === 'IsChanged') {
          selected.setting.isEmpty = true
          this.updateChartData()
          return
        }
        if (res.code === 200) {
          let columns = []
          let rows = []
          let dimensionKeys = [] // 度量key
          for (let m of apiData.dimensions) {
            dimensionKeys.push(m.alias)
            columns.push(m.alias) // 默认columns第二项起为指标
          }

          let measureKeys = [] // 度量key
          for (let m of apiData.measures.concat(apiData.mixMeasures)) {
            measureKeys.push(m.alias)
            columns.push(m.alias) // 默认columns第二项起为指标
          }
          res.rows.map((item, index) => {
            let obj = {}
            for (let item2 of dimensionKeys) {
              obj[item2] = item[item2]
            }
            obj[dimensionKeys] = item[dimensionKeys]
            for (let item2 of measureKeys) {
              obj[item2] = item[item2]
            }
            rows.push(obj)
          })
          apiData.source = {
            columns,
            rows
          }
          this.$store.dispatch('SetSelfDataSource', apiData)
          // 数据显示为折线
          this.currSelected.setting.apis.showLine = this.fileList.map(
            item => item.alias
          )
          // 折线作为坐标
          this.currSelected.setting.apis.axisSite.right = this.currSelected.setting.apis.showLine
          this.updateChartData()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style></style>
