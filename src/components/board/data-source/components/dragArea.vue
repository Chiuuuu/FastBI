<template>
  <div class="dragArea"
       :class="{'dragable-vaild':type===dragFile}"
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
          {{item.field}}
      </div>
    </div>
    <div class="empty"
      :class="{field:isdrag && type===dragFile}"
      >{{emptyText[type]}}</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
        'dimension': '拖入维度',
        'measure': '拖入度量',
        'filter': '拖入字段'
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
          if (val.packageJson.api_data.dimensions || val.packageJson.api_data.measures) {
            if (this.type === 'dimension') {
              this.fileList = val.packageJson.api_data.dimensions
            } else {
              this.fileList = val.packageJson.api_data.measures
            }
          } else {
            this.fileList = []
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
  methods: {
    // 将拖动的维度到所选择的放置目标节点中
    handleDropOnFilesWD(event) {
      // h5 api
      let dataFile = JSON.parse(event.dataTransfer.getData('dataFile'))
      dataFile.showMore = false // 是否点击显示更多
      if (this.type === 'dimension') {
        // 维度暂时只能拉入一个字段
        this.fileList[0] = dataFile
      } else {
        if (this.fileList.length < 2) {
          this.fileList.push(dataFile)
        }
        // else {
        //   this.fileList[1] = dataFile
        // }
      }
      this.fileList = this.uniqueFun(this.fileList, 'field')
      // let apiData = {
      //   [this.type]: this.fileList
      // }
      // this.$store.dispatch('SetSelfDataSource', apiData)
      this.getData()
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
    },
    // 根据维度度量获取数据
    getData() {
      console.log(this.currentSelected)
      for (let item of this.fileList) {
        item.defaultAggregator = 'SUM'
      }
      if (this.type === 'dimension') {
        // for (let item of this.fileList) {
        //   dimensionKeys.push(item.field)
        // }
        this.currentSelected.packageJson.api_data.dimensions = this.fileList
      } else {
        this.currentSelected.packageJson.api_data.measures = this.fileList
      }
      let params = {
        setting: {
          ...this.currentSelected
        }
      }
      this.$server.screenManage.getData(params).then(res => {
        if (res.data.code === 200) {
          // let columns = []
          let apiData = this.currentSelected.packageJson.api_data
          let dimensionKeys = apiData.dimensions[0].field // 维度key
          let measureKeys = [] // 度量key
          for (let m of apiData.measures) {
            measureKeys.push(m.field)
          }
          let rows = []
          console.log(measureKeys)
          res.data.rows.map((item, index) => {
            let obj = {}
            obj[dimensionKeys] = item[dimensionKeys]
            obj[measureKeys[index]] = item[measureKeys[index]]
            rows.push(obj)
              // rows.push(
              //   { [dimensionKeys]: item[dimensionKeys], [measureKeys[index]]: item[measureKeys[index]] }
              // )
          })

          console.log(rows)
        }
      })
    }
  }
}
</script>

<style>

</style>