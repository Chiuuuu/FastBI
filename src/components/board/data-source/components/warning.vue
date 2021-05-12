<template>
  <!-- 预警 -->
  <div class="data-Interactive">
    <div class="empty" style="cursor: pointer" @click="openWindow">
      {{
        currSelected.setting.api_data.warning &&
        currSelected.setting.api_data.warning.length > 0
          ? '修改'
          : '设置'
      }}预警规则
    </div>
    <a-modal
      v-model="visible"
      title="数据预警设置"
      :width="560"
      @ok="submit"
      @click.native="closeDown"
    >
      <button class="ant-btn ant-btn-primary" @click="addCondition">
        添加条件
      </button>
      <div class="pick-checkbox-box" style="margin:0;padding:0">
        <b-scrollbar style="height:100%;">
          <br />
          <div
            :class="['pick-condition-box']"
            v-for="(item, index) in conditionList"
            :key="index"
          >
            <!-- 颜色选择 -->
            <div
              class="el-color-picker el-color-picker--small"
              @click.stop="openDown(index)"
            >
              <div class="el-color-picker__trigger">
                <span class="el-color-picker__color"
                  ><span
                    class="el-color-picker__color-inner"
                    :style="{ backgroundColor: item.warnColor }"
                  ></span></span
                ><span class="el-color-picker__icon el-icon-arrow-down"></span>
              </div>
              <!-- 颜色选择下拉 -->
              <div
                class="el-color-dropdown el-color-picker__panel"
                style="position:absolute;width:150px"
                v-show="item.showDown"
              >
                <div class="el-color-predefine__colors">
                  <div
                    :class="[
                      'el-color-predefine__color-selector',
                      { selected: color === item.warnColor }
                    ]"
                    v-for="(color, index) in predefineColors"
                    :key="index"
                    @click.stop="selectColor(item, color)"
                  >
                    <div :style="{ backgroundColor: color }"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 范围选择 -->
            <a-select
              :class="['pick-select', 'has-margin']"
              style="margin-left:10px"
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
          </div>
        </b-scrollbar>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { DEFAULT_COLORS } from '@/utils/defaultColors'
import setWarning from '@/utils/setWarningColor'
import { mapGetters, mapActions } from 'vuex'
import { Icon } from 'ant-design-vue'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2276651_kjhn0ldks1j.js'
}) // 引入iconfont
export default {
  components: { IconFont },
  computed: {
    ...mapGetters([
      'currentSelected',
      'currSelected',
      'canvasMap',
      'selectedModelList'
    ])
  },
  data() {
    return {
      visible: false,
      conditionList: [],
      conditionOptions: [
        { label: '范围', op: 'range' },
        { label: '大于', op: 'more' },
        { label: '小于', op: 'less' },
        { label: '大于等于', op: 'moreOrEqual' },
        { label: '小于等于', op: 'lessOrEqual' },
        { label: '等于', op: 'equal' },
        { label: '不等于', op: 'notEqual' }
      ], // 条件选项
      predefineColors: ['#00008B', '#A52A2A', '#FFFF00', '#FF6347'] // 预警颜色
    }
  },
  methods: {
    ...mapActions(['updateChartData']),
    openWindow() {
      // 获取当前图表预警规则
      this.conditionList = this.currSelected.setting.api_data.warning || []
      this.visible = true
    },
    // 度量添加条件
    addCondition() {
      if (this.conditionList.length < 5) {
        this.conditionList.push({
          warnColor: '#00008B', // 默认第一个颜色
          condition: 'range', // 条件选择，显示
          firstValue: '',
          secondValue: '',
          showDown: false // 下拉框控制
        })
      } else {
        this.$message.error('限制只能添加5个')
      }
    },
    changeCondition(item) {
      // 只有范围有两个输入框
      if (item.condition !== '范围') {
        delete item.secondValue
      }
    },
    delectCondition(index) {
      this.conditionList.splice(index, 1)
    },
    selectColor(item, color) {
      item.warnColor = color
      item.showDown = false
    },
    // 颜色选择显示下拉
    openDown(index) {
      this.conditionList.forEach((val, i) => {
        if (index === i) {
          val.showDown = true
        } else {
          val.showDown = false
        }
      })
    },
    // 点击空白关闭颜色选择下拉
    closeDown() {
      this.conditionList.forEach(item => {
        item.showDown = false
      })
    },
    // 保存预警数据
    submit() {
      if (
        this.conditionList.some(
          item =>
            !item.firstValue ||
            (item.condition === 'range' && !item.secondValue)
        )
      ) {
        this.$message.error('请输入筛选数值')
        return
      }
      this.currSelected.setting.api_data.warning = this.conditionList
      this.$store.dispatch(
        'SetSelfDataSource',
        this.currSelected.setting.api_data
      )
      this.updateChartData()
      this.visible = false
      this.setWarningColor()
    },
    // 设置预警颜色
    setWarningColor() {
      let config = this.currSelected.setting.config
      let val = this.currSelected.setting.api_data
      // 按预警格式化显示颜色
      if (!val.warning) {
        return
      }
      if (val.warning.length === 0) {
        // 重置数据颜色样式
        delete config.series.itemStyle.normal.color
        // 强行渲染
        this.$store.dispatch('SetSelfProperty', config)
        return
      }
      config.series.itemStyle.normal.color = setWarning(
        val,
        this.currSelected.setting.name
      )
      this.$store.dispatch('SetSelfProperty', config)
    }
  }
}
</script>
<style lang="less" scoped>
.el-color-dropdown__main-wrapper {
  display: none;
}
</style>
