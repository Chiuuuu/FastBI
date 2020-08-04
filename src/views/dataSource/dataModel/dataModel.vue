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
              <a-modal v-model="visible" title="选择数据链接" @ok="handleOk">
                <div><a-input placeholder="搜索数据链接名称" style="width:60%; margin-left:100px"></a-input></div>
                <a style="margin-left:100px;margin-top:100px">新建数据链接</a>
                <a-menu
                :default-selected-keys="['1']"
                :default-open-keys="['sub1']"
                mode="inline"
                style="width:60%; margin-left:78px"
                >
                  <a-sub-menu>
                    <span slot="title"><a-icon type="folder" /><span>零售数据</span></span>
                    <a-menu-item>
                      <a-icon type="project" />数据模型1
                    </a-menu-item>
                    <a-menu-item>
                      <a-icon type="project" />数据模型2
                    </a-menu-item>
                    <a-menu-item>
                      <a-icon type="project" />数据模型3
                    </a-menu-item>
                  </a-sub-menu>
                </a-menu>
              </a-modal>
            <a-menu-item>
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
        <span class="d-s">描述：-</span>
      </div>
      <div class="draw_board">
        <div class="outer">
          <div class="First">
            <div class="bank-account">
              <span class="f-b-s">银行账户</span>
            </div>
          </div>
          <div class="Second">
            <div class="need">
              <span class="s-n-s">统计需求</span>
            </div>
            <div class="need-01">
              <span class="s-n01-s">统计需求1</span>
            </div>
          </div>
          <div class="Third">
            <div class="account">
              <span class="t-a-s">基本账户</span>
            </div>
            <div class="account-01">
              <span class="t-a01-s">基本账户1</span>
            </div>
            <div class="account-02">
              <span class="t-a02-s">基本账户2</span>
            </div>
            <div class="account-03">
              <span class="t-a03-s">基本账户3</span>
            </div>
          </div>
          <div class="Forth">
            <div class="deal">
              <span class="f-d-s">统结算交易</span>
            </div>
          </div>
        </div>
      </div>
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
