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
          if (this.type === 'dimensions' && val.packageJson.api_data.dimensions) { // 维度
            this.fileList = deepClone(val.packageJson.api_data.dimensions)
          }
          if (this.type === 'measures' && val.packageJson.api_data.measures) { // 度量
            this.fileList = deepClone(val.packageJson.api_data.measures)
          }
          if (this.type === 'tableList' && val.packageJson.api_data.tableList) { // 表格不区分维度度量
            this.fileList = deepClone(val.packageJson.api_data.tableList)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['dragFile', 'currentSelected', 'optionsTabsType'])
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
      dataFile.showMore = false // 是否点击显示更多
      if (this.type === 'dimensions' && this.dragFile === this.type) {
        // 维度暂时只能拉入一个字段
        this.fileList[0] = dataFile
        this.fileList = this.uniqueFun(this.fileList, 'name')
        this.getData()
      }
      if (this.type === 'measures' && this.dragFile === this.type) {
        this.fileList.push(dataFile)
        this.fileList = this.uniqueFun(this.fileList, 'name')
        this.getData()
      }
      if (this.type === 'tableList') {
        this.fileList.push(dataFile)
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
      let current = deepClone(this.currentSelected)
      // 维度度量删除完以后重置该图表数据
      if (current.packageJson.api_data.dimensions.length === 0 && current.packageJson.api_data.measures.length === 0) {
        let canvasMaps = navigateList[0].children
        for (let maps of canvasMaps) {
          if (maps.name === current.name) {
            let apiData = {
              ...maps.api_data
            }
            this.$store.dispatch('SetSelfDataSource', apiData)
            // this.currentSelected.packageJson.api_data.source = maps.packageJson.api_data.source
            this.saveScreenData()
          }
        }
      }
      this.getData()
    },
    // 根据维度度量获取数据
    getData() {
      for (let item of this.fileList) {
        item.defaultAggregator = 'SUM'
      }
      if (this.type === 'dimensions') {
        this.currentSelected.packageJson.api_data.dimensions = this.fileList
      }
      if (this.type === 'measures') {
        this.currentSelected.packageJson.api_data.measures = this.fileList
      }
      if (this.type === 'tableList') {
        this.currentSelected.packageJson.api_data.tableList = this.fileList
      }
      let apiData = deepClone(this.currentSelected.packageJson.api_data)
      if (apiData.dimensions.length === 0 || apiData.measures.length === 0) {
        return
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
            this.currentSelected.packageJson.api_data.source = {
              columns,
              rows
            }
          } else {
            let columns = []
            // let apiData = this.currentSelected.packageJson.api_data
            let dimensionKeys = apiData.dimensions[0].name // 维度key
            columns[0] = dimensionKeys // 默认columns第一项为维度
            let measureKeys = [] // 度量key
            for (let m of apiData.measures) {
              measureKeys.push(m.name)
              columns.push(m.name) // 默认columns第二项起为指标
            }
            let rows = []
            res.rows.map((item, index) => {
              let obj = {}
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
