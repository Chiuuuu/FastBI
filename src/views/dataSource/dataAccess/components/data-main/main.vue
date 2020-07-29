<template>
  <div class="main">
    <div class="right">
      <div class="header">
        <span class="data_con">数据连接A</span>
        <span class="data_category">（类型：MySQL）</span>
      </div>
      <div class="tab">
        <a-tabs default-active-key="1" :wrapper-col="wrapperCol">
          <a-tab-pane key="1" tab="连接信息">
            <div class="sub_form">
              <a-form-model
                ref="ruleForm"
                :model="form"
                :rules="rules"
                :label-col="labelCol"
              >
                <a-form-model-item label="数据源名称" prop="DataSource">
                  <a-input style="width:528px;" />
                </a-form-model-item>
                <a-form-model-item label="服务器" prop="Server">
                  <a-input style="width:528px;" />
                </a-form-model-item>
                <a-form-model-item label="端口" prop="Port">
                  <a-input style="width:528px;" />
                </a-form-model-item>
                <a-form-model-item label="用户名" prop="UserName">
                  <a-input style="width:528px;" />
                </a-form-model-item>
                <a-form-model-item label="密码" prop="Password">
                  <a-input-password style="width:528px;" />
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                  <a-button disabled style="width:88px;height:30px">
                    连接
                  </a-button>
                </a-form-model-item>
                <a-form-model-item label="默认连接库" prop="DataBase">
                  <a-select default-value="请选择数据库" style="width: 528px">
                    <a-select-option value="SQL Server">
                      SQL Server
                    </a-select-option>
                    <a-select-option value="Oracle">
                      Oracle
                    </a-select-option>
                    <a-select-option value="MySQL">
                      MySQL
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-form-model>
            </div>
            <a-button type="primary" class="btn_sub">
              保存
            </a-button>
          </a-tab-pane>
          <a-tab-pane key="2" tab="库表结构" force-render>
            <div class="search_bar">
              <a-input placeholder="请输入关键词" class="search_input">
                <a-icon slot="prefix" type="search" />
              </a-input>
              <a-select default-value="全部" class="search_select">
                <a-select-option value="aaa">
                  aaa
                </a-select-option>
              </a-select>
            </div>
            <div class="table">
              <a-table :columns="columns" :data-source="data">
                <span slot="config">
                  <a v-on:click="setting">设置</a>
                </span>
              </a-table>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="维度分类">
            Content of Tab Pane 3
          </a-tab-pane>
          <a-tab-pane key="4" tab="操作记录">
            <div class="search_bar">
              <a-input placeholder="请输入关键词" class="search_input">
                <a-icon slot="prefix" type="search" />
              </a-input>
            </div>
            <div class="table">
              <a-table :columns="column" :data-source="datas">
                <span slot="type">
                  <span>-</span>
                </span>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
const column = [
  {
    title: '操作时间',
    dataIndex: 'work_time',
    key: 'work_time'
  },
  {
    title: '操作者',
    dataIndex: 'operator',
    key: 'operator'
  },
  {
    title: '账号',
    dataIndex: 'account',
    key: 'account'
  },
  {
    title: '操作类型',
    key: 'type',
    dataIndex: 'type'
  }
]

const datas = [
  {
    key: '1',
    work_time: '2020-07-12  12:00:00',
    operator: '钟大勇',
    account: 'vfg123456'
  }
]

const columns = [
  {
    title: '表名',
    dataIndex: 'file_name',
    key: 'file_name'
  },
  {
    title: '是否设置字段',
    dataIndex: 'field',
    key: 'field'
  },
  {
    title: '是否抽取',
    dataIndex: 'extract',
    key: 'extract'
  },
  {
    title: '修改时间',
    key: 'time',
    dataIndex: 'time'
  },
  {
    title: '字段配置',
    key: 'config',
    scopedSlots: { customRender: 'config' }
  }
]

const data = [
  {
    key: '1',
    file_name: 'fine_authority',
    field: '否',
    extract: '否',
    time: ' '
  }
]
export default {
  data() {
    return {
      data,
      columns,
      datas,
      column,
      current: ['mail'],
      openKeys: ['sub1'],
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        DataSource: [
          {
            required: true,
            message: '请输入数据源名称'
          }
        ],
        Server: [
          {
            required: true,
            message: '请输入服务器'
          }
        ],
        Port: [{ required: true, message: '请输入端口号' }],
        UserName: [
          {
            required: true,
            message: '请输入用户名'
          }
        ],
        Password: [
          {
            required: true,
            message: '请输入密码'
          }
        ],
        DataBase: [
          {
            required: true,
            message: '请选择数据库'
          }
        ]
      }
    }
  },
  methods: {
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.visible = false
    },
    setting() {
      this.$router.push('/dataSource/dataAccess-setting')
    }
  }
}
</script>

<style lang="styl" scope>
@import "./main.styl";
</style>
