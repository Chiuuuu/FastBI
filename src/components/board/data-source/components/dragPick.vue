<template>
  <div
    class="dragArea"
    :class="{
      'dragable-vaild': type === dragFile || (isdrag && type === 'tableList')
    }"
    @drop.stop.prevent="handleDropOnFilesWD($event)"
    @dragover.stop.prevent
    @dragenter="dragenter"
    @dragleave="dragleave"
  >
    <div v-if="fileList.length > 0">
      <div
        :class="['field', { error: item.status === 1 || item.isChanged }]"
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
          <span ref="itemName" class="field-text" @click="showSelect(item)">{{
            item.alias
          }}</span>
        </a-tooltip>
      </div>
    </div>
    <div class="empty" :class="{ field: isdrag }">拖入字段</div>

    <a-modal v-model="screenVisible" title="数据筛选">
      <template slot="footer">
        <a-button key="cancel" @click="screenVisible = false">
          取消
        </a-button>
        <a-button key="submit" type="primary" @click="handleOk">
          确定
        </a-button>
      </template>
      <div v-if="currentFile.dataTypeIsText">
        <a-radio-group
          v-model="currentFile.operation"
          @change="isEmpty = false"
        >
          <a-radio :value="'list'">列表</a-radio>
          <!-- <a-radio :value="'manual'">手动</a-radio> -->
        </a-radio-group>
        <br />
        <a-input
          v-show="currentFile.operation === 'list'"
          v-model="listValue"
          class="pick-search-area"
          style="margin: 10px 0"
          placeholder="请输入搜索的关键词(如: A,B,C)"
          @keyup.enter.stop="search"
        >
          <a-button
            style="height: 30px"
            type="primary"
            slot="addonAfter"
            @click="search"
            >查询</a-button
          >
        </a-input>
        <a-input
          v-show="currentFile.operation === 'manual'"
          v-model="manualValue"
          class="pick-search-area"
          style="margin: 10px 0"
          placeholder="请输入条件名称"
          @keyup.enter.stop="addManualProperty"
        >
          <a-button
            style="height: 30px"
            type="primary"
            slot="addonAfter"
            @click="addManualProperty"
            >查询</a-button
          >
        </a-input>
        <div
          class="pick-checkbox-box hasborder"
          v-show="currentFile.operation === 'list'"
        >
          <b-scrollbar style="height:100%;">
            <a-checkbox
              v-if="currentFile && currentFile.searchList && currentFile.searchList.length > 0"
              :checked="currentFile.checkedList.length === currentFile.searchList.length"
              :indeterminate="
                currentFile.checkedList.length > 0 &&
                  currentFile.checkedList.length < currentFile.searchList.length
              "
              @change="onCheckAllChange"
              >全选</a-checkbox
            >
            <a-checkbox-group
              class="f-flexcolumn"
              v-model="currentFile.checkedList"
              :options="currentFile.searchList"
              @change="onChange"
            />
          </b-scrollbar>
        </div>
        <!--手动筛选-->
        <div
          class="pick-checkbox-box"
          v-show="currentFile.operation === 'manual'"
        >
          <b-scrollbar style="height:100%;">
            <div
              class="pick-property"
              v-for="(item, index) in currentFile.manualList"
              :key="item"
            >
              <span>{{ item }}</span>
              <icon-font
                class="pick-del"
                @click="deleteManualProperty(index)"
                type="icon-guanbi"
              />
              <!-- <span class="pick-del" @click="deleteManualProperty(index)"
                >删除</span
              > -->
            </div>
          </b-scrollbar>
        </div>
      </div>
      <!--拖动的是度量-->
      <div v-else>
        <button class="ant-btn ant-btn-primary" @click="addCondition">
          添加条件
        </button>
        <div class="pick-checkbox-box" style="margin:0;padding:0">
          <b-scrollbar style="height:100%;">
            <br />
            <div
              :class="['pick-condition-box']"
              v-for="(item, index) in currentFile.conditionList"
              :key="index"
            >
              <a-select
                :class="['pick-select', 'has-margin']"
                v-model="item.condition"
                @change="changeCondition(item)"
              >
                <a-select-option
                  v-for="option in conditionOptions"
                  :key="option.label"
                  :value="option.op"
                  >{{ option.label }}</a-select-option
                >
              </a-select>
              <a-input-number
                v-model="item.firstValue"
                size="default"
                placeholder="请输入数值"
                class="inputnumber"
                style="text-overflow: clip;"
              ></a-input-number>
              <span class="symbol" v-show="item.condition === 'range'">-</span>
              <a-input-number
                v-show="item.condition === 'range'"
                v-model="item.secondValue"
                size="default"
                placeholder="请输入数值"
                class="inputnumber"
                style="text-overflow: clip;"
              ></a-input-number>
              <icon-font
                @click="delectCondition(index)"
                class="icon"
                type="icon-guanbi"
              />
              <!-- <a-icon
                @click="delectCondition(index)"
                class="icon"
                type="close"
              /> -->
            </div>
          </b-scrollbar>
        </div>
      </div>
      <a-radio-group v-model="currentFile.type">
        <a-radio :value="1">只显示{{ dragFile }}</a-radio>
        <a-radio :value="2">排除</a-radio>
      </a-radio-group>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { deepClone } from '@/utils/deepClone'
import { sum, summary } from '@/utils/summaryList'
import TreeGroupBy from '@/components/board/options/treemap/tree-groupby'
import navigateList from '@/config/navigate' // 导航条菜单
import _ from 'lodash'
import { Loading } from 'element-ui'
import { Icon } from 'ant-design-vue'
import handleReturnChartData from '@/utils/handleReturnChartData'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2276651_kjhn0ldks1j.js'
}) // 引入iconfont
export default {
  props: {
    type: {
      type: String,
      default: ''
    } // 区域类型 维度/度量
  },
  data() {
    return {
      isExist: false,
      screenVisible: false, // 弹窗显示
      listValue: '', // 列表模糊查询输入值
      manualValue: '', // 手动输入值
      conditionOptions: [
        { label: '范围', op: 'range' },
        { label: '大于', op: 'more' },
        { label: '小于', op: 'less' },
        { label: '大于等于', op: 'moreOrEqual' },
        { label: '小于等于', op: 'lessOrEqual' },
        { label: '等于', op: 'equal' },
        { label: '不等于', op: 'notEqual' }
      ], // 条件选项
      checkAll: false, // 是否全选标识
      currentFile: {}, // 当前选中的维度/度量数据
      current: {},
      isdrag: false, // 是否拖拽中
      fileList: [], // 维度字段数组
      isVaild: false, //
      isEmpty: false // 控制输入框边框样式，空输入变红
    }
  },
  inject: ['errorFile'],
  components: {
    IconFont
  },
  watch: {
    currSelected: {
      handler(val) {
        if (val) {
          this.fileList = []
          // 当前选中的图表数据筛选的数据
          if (
            val.setting.api_data.options &&
            val.setting.api_data.options.fileList
          ) {
            this.fileList = deepClone(val.setting.api_data.options.fileList)
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
            let list = val.dimensions.concat(val.measures)
            this.fileList.forEach(file => {
              let li = list.find(item => item.alias === file.alias)
              if (li && li.status === 1) {
                file.status = li.status
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
    ]),
    isNoSelectData() {
      if (
        this.currentFile.dataTypeIsText &&
        ((this.currentFile.operation === 'list' &&
          this.currentFile.checkedList.length === 0) ||
          (this.currentFile.operation === 'manual' &&
            this.currentFile.manualList.length === 0))
      ) {
        return true
      }
      return false
    }
  },
  methods: {
    ...mapActions(['updateChartData']),
    // 将拖动的维度到所选择的放置目标节点中
    async handleDropOnFilesWD(event) {
      this.isExist = false
      this.listValue = ''
      let dataFile = JSON.parse(event.dataTransfer.getData('dataFile'))
      // 验重
      if (this.fileList.some(item => dataFile.alias === item.alias)) {
        this.$message.error(`${dataFile.alias}已存在`)
        this.isdrag = false
        return
      }
      // 记录字段是否文本
      const dataType = dataFile.dataType
      dataFile.dataTypeIsText =
        dataType !== 'BIGINT' && dataType !== 'DECIMAL' && dataType !== 'DOUBLE'
      // 文本类型
      if (dataFile.dataTypeIsText) {
        await this.initTextData(dataFile)
      } else {
        // 数值类型,通过验证初始化条件列表
        dataFile.conditionList = []
      }

      dataFile.type = 1 // 只显示、排除,'include'/'exclude'
      dataFile.showMore = false // 是否点击显示更多
      this.currentFile = dataFile
      // 显示弹窗
      this.screenVisible = true
      this.isdrag = false
    },
    // 初始化文本列表
    async initTextData(dataFile) {
      // 获取维度对应字段列表
      let params = {
        datamodelId: dataFile.screenTableId,
        resourceType: dataFile.resourceType,
        dimensions: [dataFile]
      }
      let res = await this.$server.screenManage.getDataPick(params)
      // 模型数据被删
      if (res.code === 500 && res.msg === 'IsChanged') {
        this.$message.error('模型数据不存在')
        this.isdrag = false
        return
      }
      if (res.code === 200) {
        // 过滤空字段
        // 拆维度列表
        const list = []
        let hasNull = false
        res.rows.forEach(item => {
          // 需将null值空值也当做条件显示出来
          if (Object.prototype.toString.call(item) === '[object Object]') {
            const value = Object.values(item)
            if (value[0]) {
              list.push(value.toString())
            } else {
              hasNull = true
            }
          } else {
            hasNull = true
          }
        }) // 维度全字段列表
        if (hasNull) list.unshift('')
        dataFile.originList = list
        dataFile.searchList = dataFile.originList
        dataFile.checkedList = [] // 勾选的字段列表
        dataFile.manualList = [] // 手动输入列表
        dataFile.operation = 'list' // 列表/手动,'list'/'manual'
        return dataFile
      } else {
        res.msg && this.$message.error(res.msg)
        this.isdrag = false
      }
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
    // 列表模糊查询
    search() {
      if (!this.listValue) {
        this.currentFile.searchList = this.currentFile.originList
        this.isEmpty = true
        // 不强制刷新的话, 不会触发updated()
        return this.$forceUpdate()
      }
      const keyword = (this.listValue || '').toLowerCase()
      const list = keyword.split(',')
      this.currentFile.searchList = [].concat(this.currentFile.originList.filter(item => {
        let match = false
        list.forEach(k => {
          if ((item || '').indexOf(k) > -1) {
            match = true
          }
        })
        return match
      }))
      // 不强制刷新的话, 不会触发updated()
      this.$forceUpdate()
    },
    // 点击再次打开数据筛选弹窗
    async showSelect(item) {
      this.isExist = true
      this.currentFile = item
      this.listValue = '' // 列表模糊查询输入值
      this.manualValue = '' // 手动输入值
      if (item.dataTypeIsText) {
        let params = {
          datamodelId: this.currentFile.screenTableId,
          resourceType: this.currentFile.resourceType,
          dimensions: [this.currentFile]
        }
        let res = await this.$server.screenManage.getDataPick(params)
        const list = []
        let hasNull = false
        res.rows.forEach(item => {
          // 需将null值空值也当做条件显示出来
          if (Object.prototype.toString.call(item) === '[object Object]') {
            const value = Object.values(item)
            if (value[0]) {
              list.push(value.toString())
            } else {
              hasNull = true
            }
          } else {
            hasNull = true
          }
        }) // 维度全字段列表
        if (hasNull) list.unshift('')
        this.currentFile.originList = list // 维度全字段列表
        this.currentFile.searchList = this.currentFile.originList
        this.onChange()
      }
      this.screenVisible = true
    },
    // 多选框变化的时候重新判断全选
    onChange() {
      this.checkAll =
        this.currentFile.checkedList.length ===
        this.currentFile.originList.length // 判断是否全选
    },
    // 点击全选
    onCheckAllChange(e) {
      this.checkAll = e.target.checked
      this.currentFile.checkedList = e.target.checked
        ? this.currentFile.searchList
        : []
    },
    // 手动，添加字段
    addManualProperty() {
      if (!this.manualValue) {
        this.isEmpty = true
        return
      }
      // 本身不存在就添加进去
      if (this.currentFile.manualList.indexOf(this.manualValue) === -1) {
        this.currentFile.manualList.push(this.manualValue)
      } else {
        this.$message.error(`${this.manualValue}已存在`)
      }
    },
    deleteManualProperty(index) {
      this.currentFile.manualList.splice(index, 1)
    },
    // 度量添加条件
    addCondition() {
      if (this.currentFile.conditionList.length < 5) {
        this.currentFile.conditionList.push({
          condition: 'range', // 条件选择，显示
          action: '', // 条件选择，实际
          firstValue: '',
          secondValue: ''
        })
      } else {
        this.$message.error('限制只能添加5个')
      }
    },
    changeCondition(item, value) {
      // 只有范围有两个输入框
      if (value !== '范围') {
        delete item.secondValue
      }
    },
    delectCondition(index) {
      this.currentFile.conditionList.splice(index, 1)
    },
    // 构造文本类型数据传参
    handleTextData() {
      // 获取筛选列表
      this.currentFile.value =
        this.currentFile.operation === 'list'
          ? this.currentFile.checkedList
          : this.currentFile.manualList
      delete this.currentFile.originList // 不上传，再点击的时候重新获取
      delete this.currentFile.searchList // 不上传，模糊查询用的
    },
    handleNumData() {
      if (
        this.currentFile.conditionList.some(
          item =>
            !item.firstValue ||
            (item.condition === 'range' && !item.secondValue)
        )
      ) {
        this.$message.error('请输入筛选数值')
        return
      }
      // 处理度量筛选数据
      // 如果是排除的，action取补集符号
      this.currentFile.conditionList.forEach(item => {
        if (!item.firstValue) {
          this.$message.error('请输入筛选数值')
          return
        }
        if (item.condition === 'range' && !item.secondValue) {
          this.$message.error('请输入范围第二个筛选数值')
          return
        }
        switch (item.condition) {
          case 'range':
            item.action = item.condition
            break
          case 'more':
            item.action =
              this.currentFile.type === 1 ? item.condition : 'lessOrEqual'
            break
          case 'less':
            item.action =
              this.currentFile.type === 1 ? item.condition : 'moreOrEqual'
            break
          case 'moreOrEqual':
            item.action = this.currentFile.type === 1 ? item.condition : 'less'
            break
          case 'lessOrEqual':
            item.action = this.currentFile.type === 1 ? item.condition : 'more'
            break
          case 'equal':
            item.action =
              this.currentFile.type === 1 ? item.condition : 'notEqual'
            break
          case 'notEqual':
            item.action = this.currentFile.type === 1 ? item.condition : 'equal'
            break
        }
      })
    },
    validConditionList() {
      if (this.currentFile.conditionList.length < 1) {
        this.$message.error('请添加条件')
        return false
      }
      for (const item of this.currentFile.conditionList) {
        if (item.condition === 'range') {
          const { firstValue, secondValue } = item
          if (firstValue === '' || secondValue === '') {
            this.$message.error('请完善添加的条件')
            return false
          } else if (isNaN(firstValue) || isNaN(secondValue)) {
            this.$message.error('请填写正确的数字')
            return false
          } else if (firstValue > secondValue) {
            this.$message.error('范围起始值大于末尾值')
            return false
          }
        } else {
          if (isNaN(item.firstValue)) {
            this.$message.error('请完善添加的条件')
            return false
          }
        }
      }
      return true
    },
    // 构造数值类型数据传参
    async handleOk() {
      if (this.isNoSelectData) {
        return this.$message.error('请添加条件')
      }
      // 度量没有添加条件不能确定
      if (!this.currentFile.dataTypeIsText && !this.validConditionList()) {
        return
      }
      let apiData = deepClone(this.currSelected.setting.api_data)

      // 处理文本类型筛选信息
      if (this.currentFile.dataTypeIsText) {
        this.handleTextData()
      } else {
        // 处理数值类型筛选信息
        this.handleNumData()
      }

      if (this.isExist) {
        let file = this.fileList.find(
          item => item.alias === this.currentFile.alias
        )
        file = this.currentFile
      } else {
        this.fileList.push(this.currentFile)
      }

      // 构造dataDimensionsLimit,dataDimensionsLimit列表
      let { dimensionsLimit, measuresLimit } = this.setParams()
      let options = {
        fileList: this.fileList,
        dimensionsLimit,
        measuresLimit
      }
      apiData.options = { ...apiData.options, ...options }
      this.$store.dispatch('SetSelfDataSource', apiData)

      // 关闭弹窗
      this.screenVisible = false

      await this.updateChartData()
      this.getData()
    },
    setParams() {
      let dimensionsLimit = []
      let measuresLimit = []
      // 构造dataDimensionsLimit,dataDimensionsLimit列表
      this.fileList.forEach(item => {
        if (item.dataTypeIsText) {
          let { pivotschemaId, type, dataType, value, name } = item
          dimensionsLimit.push({
            pivotschemaId,
            type,
            dataType,
            value,
            name
          })
        } else {
          let { pivotschemaId, type, dataType, conditionList, name } = item
          measuresLimit.push({
            pivotschemaId,
            type,
            dataType,
            name,
            value: conditionList
          })
        }
      })
      return { dimensionsLimit, measuresLimit }
    },
    // 删除当前维度或者度量
    async deleteFile(item, index) {
      this.fileList.splice(index, 1)
      let apiData = deepClone(this.currSelected.setting.api_data)
      apiData.options.fileList = this.fileList
      // 文本类型对应维度字段，数值类型对应度量字段
      if (item.dataTypeIsText) {
        _.pullAllBy(apiData.options.dimensionsLimit, [item], 'pivotschemaId')
      } else {
        _.pullAllBy(apiData.options.measuresLimit, [item], 'pivotschemaId')
      }
      this.$store.dispatch('SetSelfDataSource', apiData)
      await this.updateChartData()
      this.getData()
    },
    // 处理isChanged标红
    handleRedList(list, selected) {
      // 如果存在对应列表id，替换成红色
      if (list) {
        selected.setting.api_data.dimensions.forEach(item => {
          if (!list.includes(item.pivotschemaId)) {
            item.isChanged = true
          }
        })
        selected.setting.api_data.measures.forEach(item => {
          if (!list.includes(item.pivotschemaId)) {
            item.isChanged = true
          }
        })
        selected.setting.api_data.options.fileList &&
          selected.setting.api_data.options.fileList.forEach(item => {
            if (!list.includes(item.pivotschemaId)) {
              item.isChanged = true
            }
          })
        selected.setting.api_data.options.sort &&
          selected.setting.api_data.options.sort.forEach(item => {
            if (!list.includes(item.pivotschemaId)) {
              item.isChanged = true
            }
          })
      }
    },
    // 处理不可见字段
    handleInvisible(selected) {
      const {
        modelDimensions = [],
        modelMeasures = []
      } = this.$store.state.options
      const chartFields = selected.setting.api_data.dimensions.concat(
        selected.setting.api_data.measures
      )
      const fieldList = [].concat(modelDimensions).concat(modelMeasures)
      // 校验当前图表的字段是否被隐藏, 隐藏则标红
      chartFields.forEach(item => {
        for (const field of fieldList) {
          if (item.pivotschemaId === field.pivotschemaId) {
            item.isChanged = 'visible' in field && !field.visible
            break
          }
        }
      })
      selected.setting.api_data.options.fileList &&
        selected.setting.api_data.options.fileList.forEach(item => {
          for (const field of fieldList) {
            if (item.pivotschemaId === field.pivotschemaId) {
              item.isChanged = 'visible' in field && !field.visible
              break
            }
          }
        })
    },
    // 根据维度度量获取数据
    async getData() {
      let apiData = deepClone(this.currSelected.setting.api_data)
      let type = this.currSelected.setting.type
      if (type === '1') {
        if (apiData.dimensions.length === 0 || apiData.measures.length === 0) {
          return
        }
        if (
          apiData.dimensions.some(item => item.status === 1) ||
          apiData.measures.some(item => item.status === 1)
        ) {
          return
        }
      }
      if (type === '2') {
        if (apiData.measures.length === 0) {
          return
        }
        if (
          this.currSelected.setting.chartType === 'v-ring' &&
          apiData.measures.length < 2
        ) {
          return
        }
        if (apiData.measures.some(item => item.status === 1)) {
          return
        }
      }
      if (type === '3') {
        if (apiData.tableList.length === 0) {
          return
        }
        if (apiData.tableList.some(item => item.status === 1)) {
          return
        }
      }

      let selected = this.canvasMap.find(
        item => item.id === this.currentSelected
      )

      let loadingInstance = Loading.service({
        lock: true,
        text: '加载中...',
        target: 'body',
        background: 'rgb(255, 255, 255, 0.6)'
      })
      let res = await this.$server.screenManage.getData(selected)
      loadingInstance.close()
      selected.setting.isEmpty = false
      // 数据源被删掉
      if (res.code === 500 && res.msg === 'IsChanged') {
        selected.setting.isEmpty = 'noData'
        this.handleRedList(res.data, selected)
        this.updateChartData()
        return
      }
      if (res.code === 200) {
        // 查不到数据
        if (res.rows.length === 0) {
          // 清空数据
          apiData.source.columns = []
          apiData.source.rows = []
          this.$store.dispatch('SetSelfDataSource', apiData)
          this.updateChartData()
          return
        }
        if (this.currSelected.setting.type === '1' && this.currSelected.setting.chartType !== 'v-map' && this.currSelected.setting.chartType !== 'v-treemap' && res.rows.length && res.rows.length > 50) {
          this.$message.error('当前图表数据量过大, 已截取部分数据展示')
          res.rows.length = 50
        }

        this.handleInvisible(selected)
        let datas = res.rows

        // 处理图表数据
        datas = await handleReturnChartData(datas, this.currSelected.setting)

        // 矩形树图数据处理
        if (this.currSelected.setting.chartType === 'v-treemap') {
          let setting = deepClone(this.currSelected.setting)
          let config = setting.config
          const tree = new TreeGroupBy(
            res.rows,
            setting.api_data.dimensions.map(item => item.alias),
            setting.api_data.measures
          )
          TreeGroupBy.handleLeafValue(tree.tree)
          config.series.data = tree.tree
          config.series.visualMaxList = tree.max
          config.visualMap.max = tree.max[0]

          // 若删除了维度, 且刚好指针指向了维度, 则切换映射类型
          let index = config.series.recDimensionIndex || 0
          if (index === setting.api_data.dimensions.length) {
            config.visualMap.max = config.series.visualMaxList[0]
            config.visualMap.type = 'continuous'
            config.visualMap.inRange.color = config.series.continuousColors
          } else {
            let dimensionIndex = setting.api_data.dimensions.length - index - 1
            dimensionIndex = dimensionIndex < 0 ? 0 : dimensionIndex
            config.visualMap.dimension = dimensionIndex + 1
            config.visualMap.max = config.series.visualMaxList[dimensionIndex]
            config.visualMap.type = 'piecewise'
            config.visualMap.inRange.color = config.series.piecewiseColors
            config.visualMap.pieces = TreeGroupBy.handlePieces(
              config.series.data,
              index
            )
          }
          this.$store.dispatch('SetSelfProperty', config)

          let apiData = deepClone(this.currSelected.setting.api_data)
          apiData.source = tree.tree
          this.$store.dispatch('SetSelfDataSource', apiData)
          this.updateChartData()
          return
        }
        // 文本框
        if (this.currSelected.setting.chartType === 'v-text') {
          this.$set(this.currSelected.setting.api_data, 'refreshData', datas)
          this.currSelected.setting.api_data.source = datas
          return
        }
        if (this.currSelected.setting.chartType === 'v-tables') {
          let columns = []
          apiData.tableList.forEach(item => {
            columns.push({
              title: item.alias,
              dataIndex: item.alias,
              key: item.alias
            })
          })
          let rows = datas
          apiData.source = {
            columns,
            rows
          }
          this.$store.dispatch('SetSelfDataSource', apiData)
        } else if (this.currSelected.setting.chartType === 'v-sun') {
          apiData.source.rows = res.rows
          this.$store.dispatch('SetSelfDataSource', apiData)
          this.updateChartData()
        } else {
          // 仪表盘/环形图 只显示度量
          if (this.currSelected.setting.type === '2') {
            let columns = ['type', 'value'] // 维度固定
            for (let m of apiData.measures) {
              columns.push(m.alias) // 默认columns第二项起为指标
            }
            // 对返回的数据列进行求和
            let total = sum(datas, apiData.measures[0].alias)
            let rows = [
              {
                type: apiData.measures[0].alias,
                value: total
              }
            ]
            // 环形图
            if (this.currSelected.setting.chartType === 'v-ring') {
              let keys = apiData.measures.map(measure => measure.alias)
              // 当前值段
              rows = [
                {
                  type: keys[0],
                  value: datas[0][keys[0]]
                }
              ]
              // 剩余数
              let value = datas[0][keys[1]] - rows[0].value
              value = value > 0 ? value : 0
              // 剩余段,目标值-当前值
              rows.push({
                type: keys[1],
                value
              })
              let config = this.currSelected.setting.config
              config.title.text =
                +((rows[0].value / datas[0][keys[1]]) * 100).toFixed(2) + '%'
              this.$store.dispatch('SetSelfProperty', config)
            }
            apiData.source = {
              columns,
              rows
            }
            // 保存apidata数据
            this.$store.dispatch('SetSelfDataSource', apiData)
            // 如果是仪表盘，第二个度量是目标值（进度条最大值）
            if (
              this.currSelected.setting.chartType === 'v-gauge' &&
              apiData.measures[1]
            ) {
              let goalTotal = sum(datas, apiData.measures[1].alias)
              let config = deepClone(this.currSelected.setting.config)
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
            const apis = deepClone(this.currSelected.setting.apis)
            let level = []
            // 一个维度是一层饼
            dimensionKeys.forEach(item => {
              // 根据当前维度分类得到的列表
              let list = summary(res.rows, item, measureKeys[0]) // 嵌套饼图度量只有一个，直接取第一个数
              rows = rows.concat(list) // 把所有维度分类出来的数组进行拼接（v-charts配置格式要求）

              level.push(list.map(obj => obj.name)) // 按维度分层
            })
            apis.level = level
            this.$store.dispatch('SetApis', apis)
          } else {
            datas.map((item, index) => {
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
            // 雷达图
            if (this.currSelected.setting.chartType === 'v-radar') {
              // 格式例子cloumns:[度量，青瓜，土豆，菜心]
              // rows:[{度量:度量1,青瓜，土豆，菜心},{度量2,青瓜，土豆，菜心}]
              let metricsName = apiData.dimensions[0].alias
              let newColumns = ['measure']
              let newRows = []
              apiData.measures.forEach(measure => {
                let measureName = measure.alias
                let obj = {}
                rows.forEach(row => {
                  newColumns.push(row[metricsName])
                  obj.measure = measureName
                  obj[row[metricsName]] = row[measureName]
                })
                newRows.push(obj)
              })

              columns = newColumns
              rows = newRows
            }
          }

          // 散点图，两个度量分别是x，y轴的值
          if (
            this.currSelected.setting.chartType === 'v-scatter' &&
            apiData.dimensions.length === 1 &&
            apiData.measures.length === 2
          ) {
            let scatterData = {}
            let legendData = []
            let list = []
            let xMax = 0
            let yMax = 0
            rows.forEach(item => {
              if (xMax < item[columns[1]]) {
                xMax = item[columns[1]]
              }
              if (yMax < item[columns[2]]) {
                yMax = item[columns[2]]
              }
              if (!scatterData[item[columns[0]]]) {
                scatterData[item[columns[0]]] = []
                legendData.push(item[columns[0]])
              }
              scatterData[item[columns[0]]].push({
                name: '',
                value: [
                  item[columns[1]], // 度量1
                  item[columns[2]], // 度量2
                  item[columns[0]], // 维度
                  columns[1],
                  columns[2],
                  columns[0]
                ]
              })
            })
            for (let i in scatterData) {
              list.push({
                label: i,
                data: scatterData[i]
              })
            }
            let config = deepClone(this.currSelected.setting.config)
            config.series.data = list
            config.series.dimensions = [columns[1], columns[2], columns[0]]
            config.legend.data = legendData
            this.$store.dispatch('SetSelfProperty', config)

            let apis = deepClone(this.currSelected.setting.apis)
            apis.xMax = xMax
            apis.yMax = yMax
            this.$store.dispatch('SetApis', apis)
          }

          apiData.source = {
            columns,
            rows
          }
          console.log(apiData)
          this.$store.dispatch('SetSelfDataSource', apiData)
        }
        this.updateChartData()
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style></style>
