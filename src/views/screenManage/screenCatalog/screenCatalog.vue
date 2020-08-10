<template>
  <div class="screen-catalog">
    <div class="left">
      <div class="menu_title">
        <span>大屏目录</span>
        <a-dropdown :trigger="['click']" placement="bottomLeft">
          <a class="ant-dropdown-link">
            <a-icon type="plus-square" class="menu_icon" />
          </a>
          <a-menu slot="overlay" class="drow_menu">
            <a-menu-item v-on:click="showModal">
              新建大屏
            </a-menu-item>
            <a-modal v-model="visible" title="新建大屏" @ok="handleOk">
              <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-form-item label="大屏名称">
                  <a-input class="mod_input" placeholder="请输入大屏名称" />
                </a-form-item>
                <a-form-item label="保存目录">
                  <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                      <a-menu-item key="1">
                        <a-icon type="user" />1st menu item
                      </a-menu-item>
                      <a-menu-item key="2">
                        <a-icon type="user" />2nd menu item
                      </a-menu-item>
                      <a-menu-item key="3">
                        <a-icon type="user" />3rd item
                      </a-menu-item>
                    </a-menu>
                    <a-button class="mod_btn" @click="e => e.preventDefault()"
                      ><span class="mod_span"> 请选择目录 </span
                      ><a-icon type="down" class="mod_icon" />
                    </a-button>
                  </a-dropdown>
                </a-form-item>
              </a-form>
            </a-modal>
            <a-menu-item key="1">
              新建文件夹
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="menu_search">
        <a-input placeholder="搜索大屏目录">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
      <a-menu
        :default-selected-keys="['1']"
        :open-keys.sync="openKeys"
        mode="inline"
      >
        <a-sub-menu key="sub1">
          <span slot="title"
            ><a-icon type="folder" /><span>数据看板</span></span
          >
          <a-menu-item key="1">
            电视统计
          </a-menu-item>
          <a-menu-item key="2">
            用户统计
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title"
            ><a-icon type="folder" /><span>管理驾驶舱</span></span
          >
          <a-menu-item key="5">
            流失统计
          </a-menu-item>
          <a-menu-item key="6">
            收入统计
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub4">
          <span slot="title"
            ><a-icon type="folder" /><span>收视分析</span></span
          >
          <a-menu-item key="9">
            月度统计
          </a-menu-item>
          <a-menu-item key="10">
            年度统计
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <span slot="title"
            ><a-icon type="folder"/><input
              class="add_input"
              value="新建文件夹"
              onfocus="this.select();"
          /></span>
        </a-sub-menu>
      </a-menu>
    </div>
    <div class="right">
      <span class="nav_title">电视统计大屏</span>
      <a-button class="btn_n1">
        全屏
      </a-button>
      <a-button class="btn_n2">
        刷新数据
      </a-button>
      <a-button type="primary" class="btn_pr" @click="editScreen">
        编辑大屏
      </a-button>
      <div class="contain">
        <div class="empty">
          <img src="@/assets/images/icon_empty_state.png" class="empty_img" />
          <span class="empty_word"> 暂无内容 ， 请先添加大屏目录数据 ~</span>
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
      visible: false
    }
  },
  watch: {
    openKeys(val) {
      console.log('openKeys', val)
    }
  },
  methods: {
    new_window() {
      alert('aaa')
    },
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.visible = false
    },
    // 编辑大屏
    editScreen() {
      this.$router.push({ name: 'admin' })
    }
  }
}
</script>

<style lang="styl" scoped>
@import "./screenCatalog.styl";
</style>
