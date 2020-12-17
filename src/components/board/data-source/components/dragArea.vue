<template>
  <div class="dragArea"
       :class="{'dragable-vaild':type===dragFile || isdrag && type==='tableList'}"
       @drop.stop.prevent="handleDropOnFilesWD($event)"
       @dragover.stop.prevent
       @dragenter="dragenter"
       @dragleave="dragleave">
    <div v-if="fileList.length>0">
      <div
          class="field"
          v-for="(item, index) in fileList"
          :key="index"
          @contextmenu.prevent="showMore(item)">
          <a-dropdown :trigger="['click', 'contextmenu']" v-model="item.showMore">
            <a-icon class="icon-more" type="caret-down" />
            <a-menu slot="overlay" @click="deleteFile(item, index)">
              <a-menu-item key="3">
                移除
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          {{item.name}}
      </div>
    </div>
    <div class="empty"
      :class="{field:isdrag && type===dragFile}"
      >{{emptyText[type]}}</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { deepClone } from '@/utils/deepClone'
import navigateList from '@/config/navigate' // 导航条菜单

export default {
  props: {
    type: {
      type: String,
      default: ''
    } // 区域类型 维度/度量
  },
  data() {
    return {
      emptyText: {
        'dimensions': '拖入维度',
        'measures': '拖入度量',
        'filter': '拖入字段',
        'tableList': '拖入字段'
      },
      isdrag: false, // 是否拖拽中
      fileList: [], // 维度字段数组
      isVaild: false //
    }
  },
  watch: {
    currentSelected: {
      handler (val) {
        if (val) {
          // 当前选中的图表显示维度度量的数据
          this.fileList = []
          // 维度度量都需要
          if (this.chartType === '1') {
            if (this.type === 'dimensions' && val.packageJson.api_data.dimensions) { // 维度
              this.fileList = deepClone(val.packageJson.api_data.dimensions)
            }
            if (this.type === 'measures' && val.packageJson.api_data.measures) { // 度量
              this.fileList = deepClone(val.packageJson.api_data.measures)
            }
          }

          // 只需要度量
          if (this.chartType === '2') {
            if (this.type === 'measures' && val.packageJson.api_data.measures) {
              this.fileList = deepClone(val.packageJson.api_data.measures)
            }
          }

          // 表格不区分维度跟度量
          if (this.chartType === '3') {
            if (this.type === 'tableList' && val.packageJson.api_data.tableList) {
              this.fileList = deepClone(val.packageJson.api_data.tableList)
            }
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['dragFile', 'currentSelected', 'optionsTabsType', 'dataModel']),
    chartType () {
      return this.currentSelected ? this.currentSelected.packageJson.type : ''
    }
  },
  mounted() {
    this.current = deepClone(this.currentSelected)
  },
  methods: {
    ...mapActions(['saveScreenData']),
    // 将拖动的维度到所选择的放置目标节点中
    handleDropOnFilesWD(event) {
      // h5 api
      let dataFile = JSON.parse(event.dataTransfer.getData('dataFile'))
      let apiData = deepClone(this.currentSelected.packageJson.api_data)
      console.log(apiData)
      console.log(dataFile)
      if (apiData.modelId && apiData.modelId !== dataFile.datamodelId) {
        this.$message.error('一个图表只能拖入一个数据模型的字段')
        return false
      }
      dataFile.showMore = false // 是否点击显示更多
      if (this.type === 'dimensions' && this.dragFile === this.type) {
        // 维度暂时只能拉入一个字段
        this.fileList[0] = dataFile
        this.fileList = this.uniqueFun(this.fileList, 'name')
        this.getData()
      }
      // 度量
      if (this.type === 'measures' && this.dragFile === this.type && this.chartType === '1') {
        // 饼图类型只能拉入一个度量
        if (this.currentSelected.packageJson.name === 've-pie') {
          this.fileList[0] = dataFile
        } else {
          this.fileList.push(dataFile)
        }
        this.fileList = this.uniqueFun(this.fileList, 'name')
        this.getData()
      }
      // 表格
      if (this.type === 'tableList') {
        this.fileList.push(dataFile)
        this.fileList = this.uniqueFun(this.fileList, 'name')
        this.getData()
      }
      // 仪表盘/环形图
      if (this.chartType === '2' && this.type === 'measures' && this.dragFile === this.type) {
        if (this.currentSelected.packageJson.name === 've-pie') {
          this.fileList[0] = dataFile
          //如果是仪表盘，需要两个度量
        } else if(this.fileList.length<2){
          this.fileList.push(dataFile)
        }
        this.fileList = this.uniqueFun(this.fileList, 'name')
        this.getData()
      }
      this.isdrag = false
    },
    // 对象数组去重,type表示对象里面的一个属性
    uniqueFun(arr, type) {
      const res = new Map()
      return arr.filter((a) => !res.has(a[type]) && res.set(a[type], 1))
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
      let current = deepClone(this.currentSelected)
      // 维度度量删除完以后重置该图表数据
      if (this.chartType === '1' || this.chartType === '2') {
        if (current.packageJson.api_data.dimensions.length === 0 && current.packageJson.api_data.measures.length === 0) {
          // 清空modelid
          current.packageJson.api_data.modelId = ''
          this.$store.dispatch('SetSelfDataSource', current.packageJson.api_data)
          // 嵌套饼图apis恢复原始状态
          if (current.packageJson.chartType === 'v-multiPie') {
            let apis = {
              level: [
                ['1/1', '1/2', '1/3'],
                ['1/4', '1/5']
              ]
            }
            this.$store.dispatch('SetApis', apis)
          }
        }
        //如果是仪表盘，第二个度量是目标值（进度条最大值）,重置进度条范围
        if (current.packageJson.chartType === 'v-gauge') {
          current.packageJson.config.series.max = 100;
          console.log(current.packageJson.config)
          this.$store.dispatch('SetSelfProperty', current.packageJson.config)
        }
      }
      if (this.chartType === '3') {
        if (current.packageJson.api_data.tableList.length === 0) {
          current.packageJson.api_data.modelId = ''
          this.$store.dispatch('SetSelfDataSource', current.packageJson.api_data)
        }
      }
    },
    // 根据维度度量获取数据
    getData() {
      // 维度
      if (this.type === 'dimensions') {
        this.currentSelected.packageJson.api_data.dimensions = this.fileList
      }
      // 度量
      if (this.type === 'measures') {
        this.currentSelected.packageJson.api_data.measures = this.fileList
      }
      // 表格
      if (this.type === 'tableList') {
        this.currentSelected.packageJson.api_data.tableList = this.fileList
      }
      let apiData = deepClone(this.currentSelected.packageJson.api_data)
      if ((!apiData.modelId || apiData.modelId === '') && this.fileList.length > 0) {
        // modelId 赋值
        apiData.modelId = this.fileList[0].datamodelId
        // this.currentSelected.packageJson.api_data.modelId = this.fileList[0].datamodelId
      }
      if (this.chartType === '1') {
        if (!apiData.dimensions.length || !apiData.measures.length) {
          this.saveScreenData()
          return
        }
      }
      if (this.chartType === '2') {
        if (!apiData.measures.length) {
          this.saveScreenData()
          return
        }
      }
      let params = {
        setting: {
          ...this.currentSelected
        }
      }
      this.$server.screenManage.getData(params).then(res => {
        if (res.code === 200) {
          if (this.type === 'tableList') {
            let columns = []
            // let apiData = this.currentSelected.packageJson.api_data
            for (let item of this.fileList) {
              columns.push({
                title: item.name,
                dataIndex: item.name,
                key: item.name
              })
            }
            let rows = res.rows
            if (rows.length > 10) {
              rows.length = 10
            }
            apiData.source = {
              columns,
              rows
            }
            this.$store.dispatch('SetSelfDataSource', apiData)
          } else {
            // 仪表盘/环形图 只显示度量
            if (this.chartType === '2') {
              let columns = ['type', 'value'] // 维度固定
              for (let m of apiData.measures) {
                columns.push(m.name) // 默认columns第二项起为指标
              }
              let rows = [{
                type: apiData.measures[0].name,
                value: res.rows[0] ? res.rows[0][apiData.measures[0].name] : 0
              }]
              apiData.source = {
                columns,
                rows
              }
              // 保存apidata数据
              this.$store.dispatch('SetSelfDataSource', apiData)
              let config = deepClone(this.currentSelected.packageJson.config)
              if (this.currentSelected.packageJson.chartType === 'v-multiPie') {
                config.chartTitle.text = rows[0].value
                this.$store.dispatch('SetSelfProperty', config)
              }
              //如果是仪表盘，第二个度量是目标值（进度条最大值）
              if (this.currentSelected.packageJson.chartType === 'v-gauge' && apiData.measures[1]) {
                config.series.max = res.rows[0][apiData.measures[1].name];
                this.$store.dispatch('SetSelfProperty', config)
              }
              this.saveScreenData()
              return
            }

            let columns = []
            let dimensionKeys = apiData.dimensions[0].name // 维度key
            columns[0] = dimensionKeys // 默认columns第一项为维度
            let measureKeys = [] // 度量key
            for (let m of apiData.measures) {
              measureKeys.push(m.name)
              columns.push(m.name) // 默认columns第二项起为指标
            }
            let rows = []
            let level1 = []
            let level2 = []
            res.rows.map((item, index) => {
              let obj = {}
              obj[dimensionKeys] = item[dimensionKeys]
              for (let item2 of measureKeys) {
                obj[item2] = item[item2]
              }
              if (obj[dimensionKeys]) {
                rows.push(obj)
              }
            })
            apiData.source = {
              columns,
              rows
            }
            console.log(apiData)
            // 嵌套饼图设置apis
            if (this.currentSelected.packageJson.chartType === 'v-multiPie') {
              console.log(columns)
              rows.map((item, index) => {
                if (index < 2) {
                  level1.push(item[columns[0]])
                } else {
                  level2.push(item[columns[0]])
                }
              })
              let apis = {
                level: [level1, level2]
              }
              console.log(apis)
              this.$store.dispatch('SetApis', apis)
            }
            this.$store.dispatch('SetSelfDataSource', apiData)
          }
          this.saveScreenData()
        }
      })
    }
  }
}
</script>

<style>

</style>
