<template>
  <a-modal
    class="modModal"
    :visible="isShow"
    :title="'新建计算字段（' + computeType + '）'"
    width="1000px"
    destroyOnClose
    @ok="handleSave"
    @cancel="handleClose"
  >
    <div class="mod">
      <div class="modal_l">
        <div class="set">
          <a-form
            :form="form"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 20 }"
          >
            <a-form-item label="名称">
              <a-input
                v-decorator="[
                  'note',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your note!'
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
            <a-form-item label="表达式">
              <div class="modal_select">
                <a-select
                  style="width: 110px;"
                  @select="handleSelectDimension"
                  v-model="dimension"
                  placeholder="插入维度"
                >
                  <a-select-option value="aaa">
                    aaa
                  </a-select-option>
                  <a-select-option value="bbb">
                    bbb
                  </a-select-option>
                </a-select>
                <a-select
                  style="width: 110px;"
                  @select="handleSelectMeasure"
                  v-model="measure"
                  placeholder="插入度量"
                >
                  <a-select-option value="ccc">
                    ccc
                  </a-select-option>
                  <a-select-option value="ddd">
                    ddd
                  </a-select-option>
                </a-select>
              </div>
            </a-form-item>
          </a-form>
        </div>
        <div class="u-txtwrap u-code-input">
          <div class="u-txt u-txt-area expshow" ref="js-expshow"></div>
          <div class="dropp">
            <textarea
              id="demo"
              class="u-txt u-txt-area expinput u-code-input"
              row="5"
              spellcheck="false"
              ref="textarea"
              v-model="textareaValue"
              @scroll="handleScroll"
              @blur.stop="handleTextAreaBlur"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="modal_r">
        <div class="bar">
          <a-select
            show-search
            placeholder="请输入关键词搜索"
            style="width: 140px"
            option-filter-prop="children"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="filterOption"
            :not-found-content="null"
            @change="change"
          >
            <a-select-option
              v-for="express in expression"
              :key="express.id"
            >
              {{ express.name }}
            </a-select-option>
          </a-select>
          <ul class="list">
            <li
              class="list-item"
              v-for="express in expression"
              :key="express.id"
            >{{ express.name }}</li>
          </ul>
        </div>
        <div class="text">
          <div class="tit">{{expression[activeIndex].syntax}}</div>
          <div class="des">{{expression[activeIndex].description}}</div>
          <div class="example">
            <span class="title">示例: </span>
            <span v-html="explain"/>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import findIndex from 'lodash/findIndex'
const expression = [
  {
    id: 'SUM',
    name: '求和聚合',
    expression: 'SUM(表达式)',
    description: '返回表达式中所有值的总和。SUM 只能用于数字字段。',
    example: 'SUM([销售额])',
    syntax: 'SUM(表达式)',
    groups: ['aggregator']
  },
  {
    id: 'MAX',
    name: '最大值聚合',
    expression: 'MAX(表达式)',
    description:
      '返回表达式在所有记录中的最大值。MAX只能用于数字、日期、日期时间字段。',
    example: 'MAX([访问量])',
    syntax: 'MAX(表达式)',
    groups: ['aggregator', 'date', 'logic']
  },
  {
    id: 'MIN',
    name: '最小值聚合',
    expression: 'MIN(表达式)',
    description:
      '返回表达式在所有记录中的最小值。MIN只能用于数字、日期、日期时间字段。',
    example: 'MIN([访问量])',
    syntax: 'MIN(表达式)',
    groups: ['aggregator', 'date', 'logic']
  },
  {
    id: '+',
    name: '加法',
    expression: '表达式1 + 表达式2\\\\数值',
    description:
      '当表达式1和表达式2的类型均为数值时，做算术加法；当它们的类型为字符串时，做字符串连接；当表达式1为日期\\\\日期时间时，做日期天数的加法。',
    example:
      '用法1，数值相加：[固定成本] + [非固定成本]；\n用法2，字符串连接：[省份] + "/" + [城市] ；\n用法3，日期\\\\日期时间增加天数：[订单日期]+10。',
    syntax: '表达式1 + 表达式2',
    groups: ['string', 'calculation']
  },
  {
    id: '-',
    name: '减法',
    expression: '表达式1 - 表达式2\\\\数值',
    description:
      '当表达式1和表达式2的类型均为数值时，做算术减法；当表达式1为日期\\\\日期时间时，做日期天数的减法。',
    example:
      '用法1，数值相减：[销售额] - [成本]；\n用法2，日期相减：[发货日期]-[订单日期]，得到日期天数；\n用法3，日期\\\\日期时间减少天数：[订单日期]-10。',
    syntax: '表达式1 - 表达式2',
    groups: ['string', 'calculation']
  },
  {
    id: '*',
    name: '乘法',
    expression: '表达式1 * 表达式2',
    description: '* 作为乘法运算符，只能用于数字字段。',
    example: '[单价] * [个数]',
    syntax: '表达式1 * 表达式2',
    groups: ['calculation']
  },
  {
    id: '/',
    name: '除法',
    expression: '表达式1 / 表达式2',
    description: '/ 作为除法运算符，只能用于数字字段。',
    example: '[总人口] / [城市数量]',
    syntax: '表达式1 / 表达式2',
    groups: ['calculation']
  }
]

export default {
  props: {
    isShow: Boolean,
    computeType: String
  },
  data() {
    return {
      expression,
      activeIndex: 0,
      textareaValue: '',
      form: this.$form.createForm(this, {
        name: 'coordinated'
      }),
      dimension: '',
      measure: ''
    }
  },
  computed: {
    explain() {
      return this.expression[this.activeIndex].example.replace(/\n/gm, '<br/>')
    }
  },
  methods: {
    change(value) {
      this.activeIndex = findIndex(this.expression, {
        id: value
      })
    },
    filterOption(value, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(value.toLowerCase()) >= 0
    },
    handleSelectDimension(value) {
      console.log(value)
      this.dimension = ''
      this.textareaValue += value
    },
    handleSelectMeasure(value) {
      console.log(value)
      this.measure = ''
      this.textareaValue += value
    },
    handleSave() {
      this.handleClose()
    },
    handleClose() {
      this.$emit('close')
    },
    handleTextAreaBlur(e) {
      console.log(window.getSelection())
    },
    handleScroll(event) {
      this.$refs['js-expshow'].scrollLeft = event.target.scrollLeft
      this.$refs['js-expshow'].scrollTop = event.target.scrollTop
    }
  }
}
</script>
<style lang="less" scoped src="./editor.less"></style>
<style lang="less">
.tok-alias {
  // 别名
  color: #0b4cfc;
}
.tok-integer {
  // inter类型
  color: #0c980c;
}
.tok-float {
  // 浮点型
  color: #0c980c;
}
.tok-string {
  // 字符串，双引号
  color: #0c980c;
}
.tok-special {
  // 特殊字符
  color: #9f9f9f;
}
.tok-fname {
  // 运算函数名称
  color: #30a4c4;
}
.tok-aggregator {
  // 聚合函数
  color: #f8b90b;
}
.tok-spaces {
  // 空格
  white-space: pre;
}
.tok-tail {
  //
  white-space: pre;
  color: #f00300;
}
.tok-zone {
  background-color: rgba(0, 153, 255, 0.32);
}
.tok-boundary {
  border-right: 1px solid #000;
}
</style>
