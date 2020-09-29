<template>
  <div class="Model-Edit">
    <div class="left">
      <!-- <div class="menu_title">
        <span>数据链接</span>
      </div>
      <div class="selector">
        <a-select default-value="银行账户" style="width: 94%;">
          <a-select-option value="SQL Server">
            SQL Server
          </a-select-option>
        </a-select>
      </div>
      <a-divider /> -->
      <!-- <div class="menu_database">
        <span class="database_span">数据库</span>
        <a-select default-value="databaseA" style="width: 300px">
          <a-select-option value="databaseA">
            databaseA
          </a-select-option>
          <a-select-option value="databaseB">
            databaseB
          </a-select-option>
          <a-select-option value="databaseC">
            databaseC
          </a-select-option>
          <a-select-option value="databaseD">
            databaseD
          </a-select-option>
        </a-select>
      </div>
      <a-divider /> -->
      <!-- <div class="menu_search">
        <a-select>
          <a-option v-for="database in databaseList" :key="database.id" :value="database.id">
            {{ database.name }}
          </a-option>
        </a-select>
      </div> -->
      <div class="menu_database_name">
        <span>数据库 {{ databaseName }}</span>
      </div>
      <a-divider />
      <div class="menu_search">
        <span class="search_span">表</span>
        <!-- <a-input placeholder="请输入关键词搜索" class="search_input">
          <a-icon slot="prefix" type="search" />
        </a-input> -->
      </div>
      <edit-left
        ref="editLeftRef"
        @on-left-drag-leave="handleLeftDragLeave"
      ></edit-left>
      <!-- <a-divider /> -->
      <!-- <div class="SQL-View"> -->
        <!-- <div class="view-head">
          <span>自定义SQL视图</span>
        </div> -->
        <!-- <div>
          <a-menu
            :default-selected-keys="['1']"
            :open-keys.sync="openKeys"
            mode="inline"
          >
            <a-sub-menu>
              <span slot="title">
                <span class="view-title">自定义SQL视图</span>
              </span>
              <a-menu-item>
                <a-dropdown :trigger="['contextmenu']">
                  <div>
                    银行账户
                    </div>
                  <a-menu slot="overlay">
                    <a-menu-item v-on:click="check">
                      查看表
                    </a-menu-item>
                    <a-menu-item>
                      编辑
                    </a-menu-item>
                    <a-menu-item>
                      删除
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </div> -->
      <!-- </div> -->
    </div>
    <div class="right">
      <div class="header" v-if="model==='edit'">
        <span class="data_con">{{detailInfo.name}}</span>
      </div>
      <div class="data_con_add" v-else-if="model === 'add'">
        <a-form :form="modelForm" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
          <a-form-item label="数据模型名称">
            <a-input
              v-decorator="['name', { rules: [{ required: true, message: '请输入名称!' }] }]"
            />
          </a-form-item>
        </a-form>
      </div>
      <!-- <div class="description">
        <span class="d-s">描述： {{detailInfo.description}}<a-icon type="edit" v-on:click="open"/></span>
        <a-modal v-model="visible1" title="编辑描述" v-on:ok="close">
          <a-textarea
            placeholder="请输入描述内容"
            :auto-size="{ minRows: 7, maxRows: 10 }"
          />
        </a-modal>
      </div> -->
      <a-divider />
      <div class="draw_board">
        <edit-right-top ref='rightTopRef' :detailInfo="detailInfo"></edit-right-top>
      </div>
      <a-divider />
      <div class="detail">
        <div class="detail_header">
          <span>数据模型详情</span>
          <div class="detail_btn">
            <!-- <a-button v-on:click="check">查看宽表</a-button> -->
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
            <!-- <a-button v-on:click="showDrawer">批量编辑字段</a-button> -->
            <a-drawer
              title="字段重命名"
              :width="1150"
              :visible="visible3"
              :body-style="{ paddingBottom: '80px' }"
              @close="onClose"
            >
              <div class="drawer-btn">
                <a-button style="width:110px">设置字段类型</a-button>
                <a-button style="width:110px">设置字段属性</a-button>
                <a-button style="width:110px">设置是否可见</a-button>
              </div>
              <div class="drawer-menu">
                <a-collapse style="width:1110px">
                  <a-collapse-panel key="1" header="订单">
                    <a-table
                      :row-selection="rowSelection"
                      :columns="column"
                      :data-source="setting"
                      bordered
                    >
                      <span slot="other_name">
                        <a-input style="width:186px;height:32px" />
                      </span>
                      <span slot="type">
                        <a-select default-value="数字" style="width:100px;">
                          <a-select-option value="int">
                            整数
                          </a-select-option>
                          <a-select-option value="date">
                            日期时间
                          </a-select-option>
                          <a-select-option value="string">
                            字符串
                          </a-select-option>
                          <a-select-option value="double">
                            小数
                          </a-select-option>
                        </a-select>
                      </span>
                      <span slot="property">
                        <a-select default-value="维度">
                          <a-select-option value="dim">
                            维度
                          </a-select-option>
                          <a-select-option value="mea">
                            度量
                          </a-select-option>
                        </a-select>
                      </span>
                      <span slot="description">
                        <a-input style="width:186px;height:32px" />
                      </span>
                      <span slot="isShow">
                        <a-select default-value="是">
                          <a-select-option value="yes">
                            是
                          </a-select-option>
                          <a-select-option value="no">
                            否
                          </a-select-option>
                        </a-select>
                      </span>
                    </a-table>
                  </a-collapse-panel>
                </a-collapse>
              </div>
              <div
                :style="{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  borderTop: '1px solid #e9e9e9',
                  padding: '10px 16px',
                  background: '#fff',
                  textAlign: 'right',
                  zIndex: 1
                }"
              >
                <a-button :style="{ marginRight: '8px' }">
                  取消
                </a-button>
                <a-button type="primary" @click="onClose">
                  保存
                </a-button>
              </div>
            </a-drawer>
          </div>
        </div>
        <div class="detail_main">
          <div class="dimensionality">
            <span class="dim_span">维度</span>
            <div class="dim_operation">
              <!-- <a v-on:click="dim_mea" style="color:#627CFF;line-height:38px">新建计算维度</a> -->
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
              <a-divider type="vertical" />
              <!-- <a v-on:click="geography" style="color:#627CFF;">设置地理位置</a> -->
              <a-modal
                v-model="visible4"
                title="创建地理字段"
                okText="确定"
                width="750px"
              >
                <div class="cacsader">
                  <span>国家： </span>
                  <a-select
                    :default-value="countryData[0]"
                    style="width: 100px"
                    @change="handlecountryChange"
                  >
                    <a-select-option
                      v-for="country in countryData"
                      :key="country"
                    >
                      {{ country }}
                    </a-select-option>
                  </a-select>
                  <span>省市： </span>
                  <a-select
                    v-model="province"
                    style="width: 100px"
                    @change="handleprovinceChange"
                  >
                    <a-select-option v-for="pro in provinces" :key="pro">
                      {{ pro }}
                    </a-select-option>
                  </a-select>
                  <span>城市： </span>
                  <a-select
                    v-model="city"
                    style="width: 100px"
                    @change="handlecityChange"
                  >
                    <a-select-option v-for="city in cities" :key="city">
                      {{ city }}
                    </a-select-option>
                  </a-select>
                  <span>区县： </span>
                  <a-select v-model="area" style="width: 100px">
                    <a-select-option v-for="area in areas" :key="area">
                      {{ area }}
                    </a-select-option>
                  </a-select>
                </div>
                <div class="geo-contain">
                  <div class="geo-map"></div>
                  <div class="geo-set">
                    <div class="set-head">
                      <span class="g-s-s">地区匹配</span>
                      <span class="g-s-r">(6个未匹配项)</span>
                    </div>
                    <div class="set-select">
                      <div>
                        <span class="s-s-s">请选择匹配字段: </span>
                      </div>
                      <div>
                        <a-select default-value="分公司" style="width: 390px">
                          <a-select-option value="分公司">
                            分公司
                          </a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <div class="set-table">
                      <a-table :columns="colu" :data-source="datas">
                        <span slot="config">
                          <a>请选择配置项</a>
                        </span>
                      </a-table>
                    </div>
                  </div>
                </div>
              </a-modal>
            </div>
            <div class="dim_menu">
              <a-menu mode="inline" v-for="(value, name) in dimensions" :key="name" :default-open-keys="[name]" :inline-collapsed="false">
                <a-sub-menu :key="name">
                  <span slot="title"><span>{{value[0].tableName}}</span></span>
                  <a-menu-item v-for="item in value" :key="item.id">
                    <img
                      src="@/assets/images/icon_dimension.png"
                      style="width:15px;height:15px"
                    />
                    {{item.name}}
                  </a-menu-item>
                </a-sub-menu>
              </a-menu>
            </div>
          </div>
          <div class="measurement">
            <span class="mea_span">度量</span>
            <div class="mea_operation">
              <!-- <a v-on:click="dim_mea" style="color:#627CFF;margin-right:20px;line-height:38px">新建计算度量</a> -->
            </div>
            <div class="mea_menu">
              <a-menu mode="inline" v-for="(value, name) in measures" :key="name" :default-open-keys="[name]" :inline-collapsed="false">
                <a-sub-menu :key="name">
                  <span slot="title"><span>{{value[0].tableName}}</span></span>
                  <a-menu-item v-for="item in value" :key="item.id">
                    <img
                      src="@/assets/images/icon_measure.png"
                      style="width:15px;height:15px"
                    />
                    {{item.name}}
                  </a-menu-item>
                </a-sub-menu>
              </a-menu>
            </div>
          </div>
        </div>
        <div class="submit_btn">
          <a-button>保存并新建报告</a-button>
          <a-button type="primary" @click="handleSave">保 存</a-button>
          <a-button v-on:click="exit">退 出</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EditLeft from './edit-left'
import EditRightTop from './edit-right-top'
import { Node, conversionTree } from '../util'
import groupBy from 'lodash/groupBy'

const countryData = ['中国']
const proData = {
  中国: ['广东省', '浙江省']
}
const cityData = {
  广东省: ['广州市', '肇庆市', '深圳市'],
  浙江省: ['宁波市', '温州市', '杭州市']
}
const areaData = {
  广州市: ['海珠区', '越秀区', '荔湾区'],
  深圳市: ['罗湖区', '福田区', '南山区'],
  肇庆市: ['怀集县', '四会市', '封开县'],
  宁波市: ['镇海区', '宁海区', '象山区'],
  温州市: ['文成区', '苍南区', '平阳区'],
  杭州市: ['上城区', '下城区', '富阳区']
}
const columns = [
  {
    title: '序号',
    width: 20,
    dataIndex: 'number',
    key: 'number'
  },
  {
    title: '产品ID',
    width: 25,
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '产品名称',
    dataIndex: 'name',
    key: 'name',
    width: 40
  },
  {
    title: '发货日期',
    dataIndex: 'date',
    key: 'date',
    width: 40
  },
  {
    title: '国家',
    dataIndex: 'country',
    key: 'country',
    width: 20
  },
  {
    title: '地区',
    dataIndex: 'address',
    key: 'address',
    width: 20
  }
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

const column = [
  {
    title: '原名',
    dataIndex: 'last_name'
  },
  {
    title: '别名',
    dataIndex: 'other_name',
    scopedSlots: {
      customRender: 'other_name'
    }
  },
  {
    title: '字段类型',
    dataIndex: 'type',
    scopedSlots: {
      customRender: 'type'
    }
  },
  {
    title: '字段属性',
    dataIndex: 'property',
    scopedSlots: {
      customRender: 'property'
    }
  },
  {
    title: '字段说明',
    dataIndex: 'description',
    scopedSlots: {
      customRender: 'description'
    }
  },
  {
    title: '注释',
    dataIndex: 'annotation',
    scopedSlots: {
      customRender: 'annotation'
    }
  },
  {
    title: '是否可见',
    dataIndex: 'isShow',
    scopedSlots: {
      customRender: 'isShow'
    }
  }
]

const setting = [
  {
    key: '1',
    last_name: 'authorityEntityType'
  }
]

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
const colu = [
  {
    title: '您的数据',
    dataIndex: 'data'
  },
  {
    title: '匹配到',
    dataIndex: 'config',
    scopedSlots: {
      customRender: 'config'
    }
  }
]

const datas = [
  {
    data: '天河'
  },
  {
    data: '海珠'
  }
]
export default {
  components: {
    EditLeft,
    EditRightTop
  },
  provide() {
    return {
      nodeStatus: this.globalStatus
    }
  },
  data() {
    return {
      modelForm: this.$form.createForm(this, { name: 'modelForm' }),
      spinning: false,
      detailInfo: '',
      globalStatus: {
        dragType: '',
        dragNode: {},
        dropNode: {},
        event: null
      },
      measures: '',
      dimensions: '',
      data,
      columns,
      column,
      setting,
      expression,
      countryData,
      proData,
      cityData,
      areaData,
      colu,
      datas,
      activeIndex: 0,
      provinces: proData[countryData[0]],
      province: proData[countryData[0]][0],
      cities: cityData[proData[countryData[0]][0]],
      city: cityData[proData[countryData[0]][0]][0],
      areas: areaData[cityData[proData[countryData[0]][0]][0]],
      area: areaData[cityData[proData[countryData[0]][0]][0]][0],
      current: ['mail'],
      openKeys: ['sub1'],
      visible: false,
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
      visible5: false,
      rules: {
        Function: [
          {
            required: true,
            message: '请选择关联方式'
          }
        ]
      },
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 14
      },
      formLayout: ' horizontal ',
      form: this.$form.createForm(this, {
        name: 'coordinated'
      }),
      dataSource: [
        {
          key: '0',
          name: 'Edward King 0',
          age: '32',
          address: 'London, Park Lane no. 0'
        },
        {
          key: '1',
          name: 'Edward King 1',
          age: '32',
          address: 'London, Park Lane no. 1'
        }
      ],
      count: 2,
      c: [
        {
          title: '表1',
          dataIndex: 'table1',
          width: '30%',
          scopedSlots: {
            customRender: 'table1'
          }
        },
        {
          title: '连接',
          dataIndex: 'link',
          scopedSlots: {
            customRender: 'link'
          }
        },
        {
          title: '表2',
          dataIndex: 'table2',
          scopedSlots: {
            customRender: 'table2'
          }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: {
            customRender: 'operation'
          }
        }
      ],
      databaseList: [] // 数据库列表
    }
  },
  computed: {
    ...mapState({
      modelId: state => state.dataModel.modelId, // 选中的菜单id
      parentId: state => state.dataModel.parentId, // 选中的菜单id
      datasource: state => state.dataModel.datasource, // 数据源
      datasourceId: state => state.dataModel.datasourceId // 数据源
    }),
    rowSelection() {
      return {}
    },
    model() {
      return this.$route.query.type
    },
    databaseName() {
      return this.databaseList.length > 0 ? this.databaseList[0].name : ''
    }
  },
  created() {
    // if (this.model === 'edit') {
    //   this.handleGetDatabase()
    // }
    // this.modelId = this.$route.query.modelId || this.$store.state.dataModel.modelId
  },
  mounted() {
    if (this.model === 'add') {
      this.handleGetAddModelDatamodel()
      this.handleGetDatabase()
    } else if (this.model === 'edit') {
      this.handleGetData(this.$route.query.modelId)
      this.handleGetDatabase()
    }
  },
  beforeDestroy() {
    this.$store.dispatch('dataModel/setModelId', -1)
  },
  methods: {
    /**
     * 新增时获取空模型
     */
    async handleGetAddModelDatamodel() {
      const result = await this.$server.dataModel.getAddModelDatamodel()
      if (result.code === 200) {
        this.detailInfo = result.data
        this.$store.dispatch('dataModel/setModelId', result.data.id)
      } else {
        this.$message.error(result.msg)
      }
    },
    /**
     * 根据数据源获取数据库(暂时只支持显示第一个库)
     */
    async handleGetDatabase() {
      console.log('datasourceId', this.$route.query.datasourceId)
      const result = await this.$server.dataModel.getDataBaseDataInfoList(this.$route.query.datasourceId)

      if (result.code === 200) {
        this.databaseList = result.data
        this.$refs.editLeftRef.handleGetMenuList(result.data[0].id)
        this.$store.dispatch('dataModel/setDatabaseId', result.data[0].id)
        // this.handleDimensions()
        // this.handleMeasures()
      } else {
        this.$message.error(result.msg)
      }
    },

    /**
     * 维度数据处理
    */
    handleDimensions() {
      console.log(groupBy(this.detailInfo.pivotSchema.dimensions, 'tableNo'))
      this.dimensions = groupBy(this.detailInfo.pivotSchema.dimensions, 'tableNo')
    },
    /**
     * 度量数据处理
    */
    handleMeasures() {
      console.log(groupBy(this.detailInfo.pivotSchema.measures, 'tableNo'))
      this.measures = groupBy(this.detailInfo.pivotSchema.measures, 'tableNo')
    },
    /**
     * 编辑时获取模型数据
    */
    async handleGetData(id) {
      this.spinning = true
      const result = await this.$server.dataModel.getDataModelDetailInfo(id)
        .finally(() => {
          this.spinning = false
        })

      if (result.code === 200) {
        this.$message.success('获取数据成功')
        this.detailInfo = result.data
        this.handleDimensions()
        this.handleMeasures()
      } else {
        this.$message.error(result.msg)
      }
    },
    handleLeftDragLeave() {
      this.$refs.rightTopRef.handleMapRemoveClass()
    },
    showModal() {
      this.visible5 = true
    },
    geography() {
      this.visible4 = true
    },
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
    },
    showDrawer() {
      this.visible3 = true
    },
    onClose() {
      this.visible3 = false
    },
    handlecountryChange(value) {
      this.provinces = proData[value]
      this.province = proData[value][0]
    },
    handleprovinceChange(value) {
      this.cities = cityData[value]
      this.city = cityData[value][0]
    },
    handlecityChange(value) {
      this.areas = areaData[value]
      this.area = areaData[value][0]
    },
    change(index) {
      this.activeIndex = index - 1
    },
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },
    onDelete(key) {
      const dataSource = [...this.dataSource]
      this.dataSource = dataSource.filter(item => item.key !== key)
    },
    handleAdd() {
      const { count, dataSource } = this
      const newData = {
        key: count,
        name: `Edward King ${count}`,
        age: 32,
        address: `London, Park Lane no. ${count}`
      }
      this.dataSource = [...dataSource, newData]
      this.count = count + 1
    },
    async handleSave() {
      let formAllRight = true
      if (this.model === 'add') {
        this.modelForm.validateFields((err, values) => {
          if (!err) {
            this.detailInfo.name = values.name
            formAllRight = true
          } else {
            formAllRight = false
          }
        })
      }
      if (!formAllRight) return
      if (formAllRight && this.detailInfo.config.tables.length === 0) {
        this.$message.error('请关联左侧表')
        return
      }

      this.detailInfo.config.tables.map(table => {
        table.alias = table.name
        table.joinType = 1
      })
      const result = await this.$server.dataModel.saveModel({
        ...this.detailInfo,
        parentId: this.parentId
      })

      if (result.code === 200) {
        if (this.model === 'add') {
          await this.handleSaveModelSourceId()
        }
        this.$message.success({
          content: this.model === 'add' ? '保存成功' : '编辑成功',
          duration: 0.5
        }).then(() => {
          this.$store.commit('dataModel/SET_MODELID', result.data.id)
          this.exit()
        })
      } else {
        this.$message.error(result.msg)
      }
      this.$store.dispatch('dataModel/setParentId', '')
    },
    /**
     * 保存模型后再保存关联的数据源信息
     */
    async handleSaveModelSourceId() {
      this.$server.dataModel.saveDatasource({
        sourceDatasourceList: new Array(this.datasource),
        dataModelId: this.modelId
      })
    }
  }
}
</script>

<style lang="styl" scope>
@import "./Model-Edit.styl";
</style>
