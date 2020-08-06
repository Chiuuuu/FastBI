<template>
  <div class="model-main">
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
</template>

<script>
export default {
  methods: {
      edit() {
      this.$router.push('/dataSource/Model-Edit')
    }
  }
}
</script>

<style lang="styl" scoped>
  @import "./main.styl";
</style>
