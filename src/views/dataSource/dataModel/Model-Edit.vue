<template>
  <div class="Model-Edit">
    <div class="left">
      <div class="menu_title">
        <span>数据链接</span>
      </div>
      <div class="selector">
        <a-select default-value="银行账户" style="width: 94%;">
          <a-select-option value="SQL Server">
            SQL Server
          </a-select-option>
        </a-select>
      </div>
      <a-divider />
      <div class="menu_search">
        <span class="search_span">表</span>
        <a-input placeholder="请输入关键词搜索" class="search_input">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
      <div class="sheet_list">
        <span>银行账户</span>
      </div>
    </div>
    <div class="right">
      <div class="header">
        <span class="data_con">数据模型1</span>
      </div>
      <div class="description">
        <span>描述：<a-icon type="edit" v-on:click="open"/></span>
        <a-modal v-model="visible1" title="编辑描述" v-on:ok="close">
          <a-textarea
            placeholder="请输入描述内容"
            :auto-size="{ minRows: 7, maxRows: 10 }"
          />
        </a-modal>
      </div>
      <div class="draw_board"></div>
      <div class="detail">
        <div class="detail_header">
          <span>数据模型详情</span>
          <div class="detail_btn">
            <a-button v-on:click="check">查看表宽</a-button>
            <a-modal
              v-model="visible"
              title="查看宽表"
              v-on:ok="close"
              width="854px"
              okText="导出宽表"
            >
              <div>
                <a-table
                  :columns="columns"
                  :data-source="data"
                  :scroll="{ x: 1000, y: 300 }"
                >
                  <a slot="action">action</a>
                </a-table>
              </div>
            </a-modal>
            <a-button>批量编辑字段</a-button>
          </div>
        </div>
        <div class="detail_main">
          <div class="dimensionality">
            <span class="dim_span">维度</span>
            <div class="dim_operation">
              <a v-on:click="dim_mea" style="line-height:38px">新建计算维度</a>
              <a-modal
                v-model="visible2"
                title="新建计算字段（维度）"
                width="800px"
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
                      style="width: 88%;margin-left: 24px;"
                      :auto-size="{ minRows: 3, maxRows: 5 }"
                    />
                  </div>
                  <div class="modal_r">
                    <div class="bar">
                      <a-select
                        show-search
                        placeholder="请输入关键词搜索"
                        style="width: 158px"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                      >
                        <a-select-option
                          v-for="express in expression"
                          :key="express.key"
                        >
                          {{ express.name }}
                        </a-select-option>
                      </a-select>
                    </div>
                    <div
                      class="text"
                      v-for="express in expression"
                      :key="express.key"
                    >
                      {{ expression.text }}
                    </div>
                  </div>
                </div>
              </a-modal>
              <a-divider type="vertical" />
              <a>设置地理位置</a>
            </div>
            <div class="dim_menu">
              <a-menu mode="inline">
                <a-sub-menu>
                  <span slot="title"><span>银行账户</span></span>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_dimension.png"
                      style="width:15px;height:15px"
                    />
                    aaa
                  </a-menu-item>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_dimension.png"
                      style="width:15px;height:15px"
                    />
                    bbb
                  </a-menu-item>
                </a-sub-menu>
                <a-sub-menu>
                  <span slot="title"><span>统计需求</span></span>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_dimension.png"
                      style="width:15px;height:15px"
                    />
                    ccc
                  </a-menu-item>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_dimension.png"
                      style="width:15px;height:15px"
                    />
                    ddd
                  </a-menu-item>
                </a-sub-menu>
              </a-menu>
            </div>
          </div>
          <div class="measurement">
            <span class="mea_span">度量</span>
            <div class="mea_operation">
              <a v-on:click="dim_mea" style="line-height:38px">新建计算度量</a>
            </div>
            <div class="mea_menu">
              <a-menu mode="inline">
                <a-sub-menu>
                  <span slot="title"><span>银行账户</span></span>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_measure.png"
                      style="width:15px;height:15px"
                    />
                    aaa
                  </a-menu-item>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_measure.png"
                      style="width:15px;height:15px"
                    />
                    bbb
                  </a-menu-item>
                </a-sub-menu>
                <a-sub-menu>
                  <span slot="title"><span>统计需求</span></span>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_measure.png"
                      style="width:15px;height:15px"
                    />
                    ccc
                  </a-menu-item>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_measure.png"
                      style="width:15px;height:15px"
                    />
                    ddd
                  </a-menu-item>
                </a-sub-menu>
              </a-menu>
            </div>
          </div>
        </div>
        <div class="submit_btn">
          <a-button>保存并新建报告</a-button>
          <a-button type="primary">保 存</a-button>
          <a-button v-on:click="exit">退 出</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: '序号',
    width: 20,
    dataIndex: 'number',
    key: 'number'
  },
  { title: '产品ID', width: 25, dataIndex: 'id', key: 'id' },
  { title: '产品名称', dataIndex: 'name', key: 'name', width: 40 },
  { title: '发货日期', dataIndex: 'date', key: 'date', width: 40 },
  { title: '国家', dataIndex: 'country', key: 'country', width: 20 },
  { title: '地区', dataIndex: 'address', key: 'address', width: 20 }
]

const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    number: i + 1,
    id: '技术0203030' + i,
    name: 'Hewlett 工业技术,书包...',
    date: '2018-10-23  12:12:22',
    country: '中国',
    address: '广东'
  })
}

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
  data() {
    return {
      data,
      columns,
      expression,
      current: ['mail'],
      openKeys: ['sub1'],
      visible: false,
      visible1: false,
      visible2: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      formLayout: ' horizontal ',
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    open() {
      this.visible1 = true
    },
    close() {
      this.visible1 = false
    },
    dim_mea() {
      this.visible2 = true
    },
    check() {
      this.visible = true
    },
    exit() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="styl" scope>
@import "./Model-Edit.styl";
</style>
