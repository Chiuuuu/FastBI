<template>
  <div
    class="dragArea"
    :class="{'dragable-vaild':type===dragFile || isdrag && type==='tableList'}"
    @drop.stop.prevent="handleDropOnFilesWD($event)"
    @dragover.stop.prevent
    @dragenter="dragenter"
    @dragleave="dragleave"
  >
    <div v-if="fileList.length>0">
      <div
        class="field"
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
          <span ref="itemName" class="field-text" @click="showSelect(item)">{{item.alias}}</span>
        </a-tooltip>
      </div>
    </div>
    <div class="empty" :class="{field:isdrag}">拖入字段</div>

    <a-modal v-model="screenVisible" title="数据筛选" @ok="handleOk">
      <div v-if="currentFile.file==='dimensions'">
        <a-radio-group v-model="currentFile.operation">
          <a-radio :value="'list'">列表</a-radio>
          <a-radio :value="'manual'">手动</a-radio>
        </a-radio-group>
        <div class="pick-checkbox-box hasborder" v-show="currentFile.operation==='list'">
          <input type="text" class="ant-input pick-input" v-model="listValue" placeholder="请输入搜索内容" />
          <button class="ant-btn ant-btn-primary" @click="search">查询</button>
          <br />
          <a-checkbox :checked="checkAll" @change="onCheckAllChange">全选</a-checkbox>
          <a-checkbox-group
            class="f-flexcolumn"
            v-model="currentFile.checkedList"
            :options="currentFile.originList"
            @change="onChange"
          />
        </div>
        <!--手动筛选-->
        <div class="pick-checkbox-box" v-show="currentFile.operation==='manual'">
          <input
            type="text"
            class="ant-input pick-input"
            v-model="manualValue"
            placeholder="请输入搜索内容"
          />
          <button class="ant-btn ant-btn-primary" @click="addManualProperty">添加</button>
          <div class="pick-property" v-for="(item,index) in currentFile.manualList" :key="item">
            <span>{{item}}</span>
            <span class="pick-del" @click="deleteManualProperty(index)">删除</span>
          </div>
        </div>
      </div>
      <!--拖动的是度量-->
      <div v-else>
        <div class="pick-checkbox-box">
          <button class="ant-btn ant-btn-primary" @click="addCondition">添加条件</button>
          <br />
          <div
            :class="['pick-condition-box',{'justify-between':item.condition==='范围'}]"
            v-for="(item,index) in currentFile.conditionList"
            :key="index"
          >
            <a-select
              :class="['pick-select',{'has-margin':item.condition!=='范围'}]"
              v-model="item.condition"
              @change="changeCondition(item)"
            >
              <a-select-option
                v-for="condition in currentFile.conditionOptions"
                :key="condition"
                :value="condition"
              >{{condition}}</a-select-option>
            </a-select>
            <a-input-number
              v-model="item.firKey"
              size="default"
              placeholder="请输入数值"
              class="f-clear-width"
              style="text-overflow: clip;"
            ></a-input-number>
            <span v-show="item.condition==='范围'">-</span>
            <a-input-number
              v-show="item.condition==='范围'"
              v-model="item.secKey"
              size="default"
              placeholder="请输入数值"
              class="f-clear-width"
              style="text-overflow: clip;"
            ></a-input-number>
          </div>
        </div>
      </div>
      <a-radio-group v-model="currentFile.selectType">
        <a-radio :value="'include'">只显示{{dragFile}}</a-radio>
        <a-radio :value="'exclude'">排除</a-radio>
      </a-radio-group>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { deepClone } from '@/utils/deepClone'
import { sum, summary } from '@/utils/summaryList'
import navigateList from '@/config/navigate' // 导航条菜单

export default {
  props: {
    type: {
      type: String,
      default: ''
    } // 区域类型 维度/度量
  },
  data () {
    return {
      screenVisible: false, // 弹窗显示
      plainOptions: ['Apple', 'Pear', 'Orange', 'a', 'b', 'c', 'd'], // 多选列表
      listValue: '', // 列表模糊查询输入值
      manualValue: '', // 手动输入值
      conditionOptions: ['范围', '大于', '小于', '大于等于', '小于等于', '等于', '不等于'],// 条件选项
      checkAll: false, // 是否全选标识
      currentFile: {}, //当前选中的维度/度量数据
      current: {},
      selected: {},
      isdrag: false, // 是否拖拽中
      fileList: [], // 维度字段数组
      isVaild: false //
    }
  },
  watch: {
    currSelected: {
      handler (val) {
        if (val) {
          // 当前选中的图表数据筛选的数据
          if (val.setting.api_data.pickDatas) {
            this.fileList = deepClone(val.setting.api_data.pickDatas)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['dragFile', 'currentSelected', 'currSelected', 'optionsTabsType', 'dataModel', 'canvasMap']),
    chartType () {
      return this.currSelected ? this.currSelected.setting.type : ''
    }
  },
  methods: {
    ...mapActions(['saveScreenData', 'updateChartData']),
    // 将拖动的维度到所选择的放置目标节点中
    async handleDropOnFilesWD (event) {
      let dataFile = JSON.parse(event.dataTransfer.getData('dataFile'))

      // 验重
      if (this.fileList.includes(item => item.alias === dataFile.alias)) {
        this.$message.error(`${dataFile.alias}已存在`)
        return
      }

      dataFile.showMore = false // 是否点击显示更多

      // 对应的是维度
      if (dataFile.file === 'dimensions') {
        // 获取维度对应字段列表
        let params = { datamodelId: dataFile.modelId, dimensions: [dataFile] }
        //  let res = await fn(dataFile)
        dataFile.originList = this.plainOptions // 维度全字段列表
        dataFile.checkedList = [] // 勾选的字段列表
        dataFile.manualList = [] //手动输入列表
        dataFile.operation = 'list' // 列表/手动,'list'/'manual'
      }
      // 对应的是度量
      else {
        dataFile.conditionList = [] // 条件行
      }
      dataFile.selectType = '' // 只显示、排除,'include'/'exclude'


      // 显示弹窗
      this.currentFile = dataFile
      this.screenVisible = true
      this.isdrag = false
    },
    // 对象数组去重,type表示对象里面的一个属性
    uniqueFun (arr, type) {
      const res = new Map()
      return arr.filter((a) => !res.has(a[type]) && res.set(a[type], 1))
    },
    // 当可拖动的元素进入可放置的目标时
    dragenter (event) {
      event.preventDefault()
      this.isdrag = true
    },
    // 当拖动元素离开可放置目标节点
    dragleave (event) {
      event.preventDefault()
      this.isdrag = false
    },
    // 点击右键显示更多
    showMore (item) {
      item.showMore = true
    },
    // 列表模糊查询
    search () {
      if (!this.listValue) { return }
      this.currentFile.originList.forEach(item => {
        if (item.indexOf(this.listValue) > -1) {
          this.currentFile.checkedList.push(item)
        }
      })
    },
    // 点击再次打开数据筛选弹窗
    showSelect (item) {
      this.currentFile = item
      this.onChange()
      this.screenVisible = true
    },
    // 多选框变化的时候重新判断全选
    onChange () {
      this.checkAll = this.currentFile.checkedList.length === this.currentFile.originList.length; // 判断是否全选
    },
    // 点击全选
    onCheckAllChange (e) {
      this.checkAll = e.target.checked
      this.currentFile.checkedList = e.target.checked ? this.currentFile.originList : []
    },
    // 手动，添加字段
    addManualProperty () {
      // 本身不存在就添加进去
      if (this.manualValue && this.currentFile.manualList.indexOf(this.manualValue) == -1) {
        this.currentFile.manualList.push(this.manualValue)
      } else {
        this.$message.error(`${this.manualValue}已存在`)
      }
    },
    deleteManualProperty (index) {
      this.currentFile.manualList.splice(index, 1)
    },
    // 度量添加条件
    addCondition () {
      this.currentFile.conditionList.push({
        condition: '范围', // 条件选择
        firKey: '', // 
        secKey: '',
      })
    },
    changeCondition (item, value) {
      // 只有范围有两个输入框
      if (value !== '范围') {
        item.secKey = ''
      }
    },
    handleOk () {
      this.fileList.push(this.currentFile)
      this.screenVisible = false

      let dataList = [] // 筛选出来的有效列表
      // 列表
      if (this.currentFile.operation === 'list') {
        // 默认是当前选中的列表
        let dataList = this.currentFile.checkedList
      }
      // 手动
      else {
        // 只有完全匹配才可筛选
        this.currentFile.manualList.forEach(item => {
          if (this.currentFile.originList.indexOf(item) > -1) {
            dataList.push(item)
          }
        })
      }
      // 如果是排除，就取补集
      if (this.currentFile.selectType === 'exclude') {
        dataList = Array.minus(Array.union(this.currentFile.originList, dataList), Array.intersect(this.currentFile.originList, dataList));
      }

      // 刷新图表数据
      this.getData(dataList)
    },
    // 删除当前维度或者度量
    deleteFile (item, index) {
      this.fileList.splice(index, 1)
      this.getData()
      let current = deepClone(this.currSelected)
      // 维度度量删除完以后重置该图表数据
      if (this.chartType === '1' || this.chartType === '2') {
        if (current.setting.api_data.dimensions.length === 0 && current.setting.api_data.measures.length === 0) {
          // 清空modelid
          //   current.packageJson.api_data.modelId = ''
          this.$store.dispatch('SetSelfDataSource', current.setting.api_data)
          // 嵌套饼图apis恢复原始状态
          if (current.setting.chartType === 'v-multiPie') {
            let apis = {
              level: [
                ['1/1', '1/2', '1/3'],
                ['1/4', '1/5']
              ]
            }
            this.$store.dispatch('SetApis', apis)
          }
        }
        // 如果是仪表盘，第二个度量是目标值（进度条最大值）,重置进度条范围
        if (current.setting.chartType === 'v-gauge') {
          current.setting.config.series.max = 100
          this.$store.dispatch('SetSelfProperty', current.setting.config)
        }
      }
      if (this.chartType === '3') {
        if (current.setting.api_data.tableList.length === 0) {
          // current.setting.api_data.modelId = ''
          this.$store.dispatch('SetSelfDataSource', current.setting.api_data)
        }
      }
    },
    // 筛选列表
    pick (resList, dataList) {
      let list = []
      if (dataList.length === 0) { return resList }
      resList.forEach(item => {
        if (dataList.indexOf(item[this.currentFile.alias]) > -1) {
          list.push(item)
        }
      })
      return list
    },
    // 根据维度度量获取数据
    getData (dataList) {
      let selected = this.canvasMap.find(item => item.id === this.currentSelected)

      let apiData = deepClone(this.currSelected.setting.api_data)
      this.$server.screenManage.getData(selected).then(res => {
        if (res.code === 200) {
          //筛选列表
          let showDataList = this.pick(res.rows, dataList)

          if (this.type === 'tableList') {
            let columns = []
            for (let item of this.fileList) {
              columns.push({
                title: item.alias,
                dataIndex: item.alias,
                key: item.alias
              })
            }
            let rows = showDataList
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
                columns.push(m.alias) // 默认columns第二项起为指标
              }
              // 对返回的数据列进行求和
              let total = sum(showDataList, apiData.measures[0].alias)
              let rows = [{
                type: apiData.measures[0].alias,
                value: total
              }]
              apiData.source = {
                columns,
                rows
              }
              // 保存apidata数据
              this.$store.dispatch('SetSelfDataSource', apiData)
              let config = deepClone(this.currSelected.setting.config)
              if (this.currSelected.setting.chartType === 'v-multiPie') {
                config.chartTitle.text = rows[0].value
                this.$store.dispatch('SetSelfProperty', config)
              }
              // 如果是仪表盘，第二个度量是目标值（进度条最大值）
              if (this.currSelected.setting.chartType === 'v-gauge' && apiData.measures[1]) {
                let goalTotal = sum(showDataList, apiData.measures[1].alias)
                config.series.max = goalTotal
                this.$store.dispatch('SetSelfProperty', config)
              }
              //   this.updateChartData()
              return
            }

            let columns = []
            let rows = []
            let dimensionKeys = [] // 度量key
            for (let m of apiData.dimensions) {
              dimensionKeys.push(m.alias)
              columns.push(m.alias) // 默认columns第二项起为指标
            }

            let measureKeys = [] // 度量key
            for (let m of apiData.measures) {
              measureKeys.push(m.alias)
              columns.push(m.alias) // 默认columns第二项起为指标
            }

            // 嵌套饼图设置apis
            if (this.currSelected.setting.chartType === 'v-multiPie') {
              // name是各维度数据拼接，value是分类汇总过的数值
              columns = ['name', 'value']
              let result = showDataList
              let level = []
              // 一个维度是一层饼
              dimensionKeys.forEach(item => {
                // 根据当前维度分类得到的列表
                let list = summary(result, item, measureKeys[0])// 嵌套饼图度量只有一个，直接取第一个数
                rows = rows.concat(list) // 把所有维度分类出来的数组进行拼接（v-charts配置格式要求）

                level.push(list.map(obj => obj.name)) // 按维度分层
              })

              let apis = {
                level
              }
              console.log(apis)
              this.$store.dispatch('SetApis', apis)
            }
            else {
              showDataList.map((item, index) => {
                let obj = {}
                for (let item2 of dimensionKeys) {
                  obj[item2] = item[item2]
                }
                obj[dimensionKeys] = item[dimensionKeys]
                for (let item2 of measureKeys) {
                  obj[item2] = item[item2]
                }
                // if (obj[dimensionKeys]) {
                rows.push(obj)
                // }
              })
              console.log(columns)
              console.log(rows)
            }

            apiData.source = {
              columns,
              rows
            }
            console.log(apiData)
            this.$store.dispatch('SetSelfDataSource', apiData)
          }

          let file = this.fileList.find(item => item.alias === this.currentFile.alias)
          file = this.currentFile
          if (file.file === 'dimensions')
            selected.setting.dataLimit.pickDatas.dimensions = this.fileList
          if (file.file === 'measures')
            selected.setting.dataLimit.pickDatas.measures = this.fileList
          //   this.updateChartData()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style>
</style>
