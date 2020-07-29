<template>
  <div class="data-model">
    <div class="left">
      <div class="menu_title">
        <span>数据模型</span>
        <a-dropdown :trigger="['click']" placement="bottomLeft">
          <a class="ant-dropdown-link">
            <a-icon type="plus-square" class="menu_icon" />
          </a>
          <a-menu slot="overlay" class="drow_menu">
            <a-menu-item v-on:click="showModal">
              添加连接
            </a-menu-item>
            <a-modal v-model="visible" title="添加连接" @ok="handleOk">
              <a-row type="flex" justify="space-around">
                <a-col>
                  <img src="@/assets/images/icon_excel.png" />
                </a-col>
                <a-col>
                  <img src="@/assets/images/icon_csv.png" />
                </a-col>
                <a-col>
                  <img src="@/assets/images/icon_sql_server.png" />
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-around">
                <a-col>
                  Excel
                </a-col>
                <a-col>
                  CSV
                </a-col>
                <a-col>
                  SQL Server
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-around">
                <a-col>
                  <img src="@/assets/images/icon_my_sql.png" />
                </a-col>
                <a-col>
                  <img src="@/assets/images/icon_db2.png" />
                </a-col>
                <a-col>
                  <img src="@/assets/images/icon_hive.png" />
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-around">
                <a-col>
                  My SQL
                </a-col>
                <a-col>
                  Db2
                </a-col>
                <a-col>
                  Hadoop Hive
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-around">
                <a-col>
                  <img src="@/assets/images/icon_hbase.png" />
                </a-col>
                <a-col>
                  <img src="@/assets/images/icon_oracle.png" />
                </a-col>
                <a-col>
                  <img src="@/assets/images/icon_log_file.png" />
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-around">
                <a-col>
                  Hbase
                </a-col>
                <a-col>
                  Oracle
                </a-col>
                <a-col>
                  日志文件
                </a-col>
              </a-row>
            </a-modal>
            <a-menu-item key="1">
              新建文件夹
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="menu_search">
        <a-input placeholder="搜索数据模型名称">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
      <a-menu
        :default-selected-keys="['1']"
        :open-keys.sync="openKeys"
        mode="inline"
      >
        <a-sub-menu>
          <span slot="title"
            ><a-icon type="folder" /><span>金融行业</span></span
          >
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型1
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
                <a-menu-item>
                  重命名
                </a-menu-item>
                <a-menu-item>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-menu-item>
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型2
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
                <a-menu-item>
                  重命名
                </a-menu-item>
                <a-menu-item>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-menu-item>
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型3
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
                <a-menu-item>
                  重命名
                </a-menu-item>
                <a-menu-item>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-menu-item>
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型4
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
                <a-menu-item>
                  重命名
                </a-menu-item>
                <a-menu-item>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <span slot="title"
            ><a-icon type="folder" /><span>零售数据</span></span
          >
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型1
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
                <a-menu-item>
                  重命名
                </a-menu-item>
                <a-menu-item>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-menu-item>
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型2
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
                <a-menu-item>
                  重命名
                </a-menu-item>
                <a-menu-item>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-menu-item>
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型3
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
                <a-menu-item>
                  重命名
                </a-menu-item>
                <a-menu-item>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <div class="right">
      <div class="header">
        <span class="data_con">数据模型1</span>
        <div class="data_btn">
          <a-button type="primary" v-on:click="edit">编辑模型</a-button>
          <a-button>刷新数据</a-button>
        </div>
      </div>
      <div class="description">
        <span>描述：</span>
      </div>
      <div class="draw_board"></div>
      <div class="detail">
        <div class="detail_header">
          <span>数据模型详情</span>
        </div>
        <div class="detail_main">
          <div class="dimensionality">
            <span class="dim_span">维度</span>
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
          <!-- <a-divider type="vertical" /> -->
          <div class="measurement">
            <span class="mea_span">度量</span>
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: ['mail'],
      openKeys: ['sub1'],
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }
  },
  methods: {
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.visible = false
    },
    edit() {
      this.$router.push('/dataSource/Model-Edit')
    }
  }
}
</script>

<style lang="styl" scoped>
@import "./dataModel.styl";
</style>
