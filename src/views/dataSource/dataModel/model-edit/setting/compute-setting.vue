<template>
  <a-modal
    :visible="isShow"
    :title="'新建计算字段（' + computeType + '）'"
    width="800px"
    destroyOnClose
    @ok="handleSave"
    @cancel="handleClose"
  >
    <div class="mod">
      <div class="modal_l">
        <div class="set">
          <a-form
            :form="form"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 12 }"
          >
            <a-form-item label="名称">
              <a-input
                style="width: 257px;"
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
                  v-decorator="[
                    'dim',
                    {
                      rules: [
                        { required: true, message: '选择维度' }
                      ]
                    }
                  ]"
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
                  v-decorator="[
                    'mea',
                    {
                      rules: [
                        { required: true, message: '选择度量' }
                      ]
                    }
                  ]"
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
        <a-textarea
          style="width: 88%;margin-left: 24px;height: 130px;resize: unset"
          :auto-size="false"
        />
      </div>
      <div class="modal_r">
        <div class="bar">
          <a-select
            show-search
            placeholder="请输入关键词搜索"
            style="width: 158px"
            option-filter-prop="children"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="filterOption"
            :not-found-content="null"
            @change="change"
          >
            <a-select-option
              v-for="express in expression"
              :key="express.key"
            >
              {{ express.name }}
            </a-select-option>
          </a-select>
        </div>
        <div class="text">
          {{ expression[activeIndex].text }}
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
const expression = [
  {
    name: '求和聚合',
    key: '1',
    text:
      'SUM(表达式) 返回表达式中所有值的总和。SUM 只能用于数字字段。 示例: SUM(销售额)'
  },
  {
    name: '平均聚合',
    key: '2',
    text:
      'AVG(表达式) 返回表达式中所有值的平均值。AVG 只能用于数字字段。 示例: AVG([成本])'
  },
  {
    name: '计数聚合',
    key: '3',
    text: 'COUNT(表达式) 返回组中的项目数。 示例: COUNT([客户名称])'
  },
  {
    name: '去重计数聚合',
    key: '4',
    text: 'COUNT(表达式) 返回组中的项目数。 示例: COUNT([客户名称])'
  },
  {
    name: '中位聚合',
    key: '5',
    text:
      'MEDIAN(表达式) 返回表达式中所有值的中位数。MEDIAN 只能用于数字字段。 示例: MEDIAN([利润])'
  },
  {
    name: '百分位聚合',
    key: '6',
    text:
      'PERCENTILE(表达式, 百分位) 返回表达式中所有值的百分位数。PERCENTILE 只能用于数字字段。 示例: PERCENTILE([利润], 75)'
  },
  {
    name: '最大值聚合',
    key: '7',
    text:
      'MAX(表达式) 返回表达式在所有记录中的最大值。MAX只能用于数字、日期、日期时间字段。 示例: MAX([访问量])s'
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
      form: this.$form.createForm(this, {
        name: 'coordinated'
      })
    }
  },
  methods: {
    change(index) {
      this.activeIndex = index - 1
    },
    filterOption(value, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(value.toLowerCase()) >= 0
    },
    handleSave() {
      this.handleClose()
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
