<template>
  <div class="menu">
    <div class="menu_title">
      <span>数据连接</span>
      <a-dropdown :trigger="['click']" placement="bottomLeft">
        <a class="ant-dropdown-link">
          <a-icon type="plus-square" class="menu_icon" />
        </a>
        <a-menu slot="overlay" class="drow_menu">
          <a-menu-item v-on:click="showModal">
            添加连接
          </a-menu-item>
          <a-modal
            v-model="visible"
            title="添加连接"
            @ok="handleOk"
          >
            <a-row type="flex" justify="space-around">
              <a-col>
                <img src="@/assets/images/icon_excel.png" @click="changeList(1)"/>
              </a-col>
              <a-col>
                <img src="@/assets/images/icon_csv.png" @click="changeList(1)"/>
              </a-col>
              <a-col>
                <img src="@/assets/images/icon_sql_server.png" @click="changeList(3)"/>
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
                <img src="@/assets/images/icon_my_sql.png" @click="changeList(3)"/>
              </a-col>
              <a-col>
                <img src="@/assets/images/icon_db2.png" @click="changeList(3)"/>
              </a-col>
              <a-col>
                <img src="@/assets/images/icon_hive.png" @click="changeList(3)"/>
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
                <img src="@/assets/images/icon_hbase.png" @click="changeList(3)"/>
              </a-col>
              <a-col>
                <img src="@/assets/images/icon_oracle.png" @click="changeList(3)"/>
              </a-col>
              <a-col>
                <img src="@/assets/images/icon_log_file.png" @click="changeList(1)"/>
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
      <a-input placeholder="搜索数据连接名称">
        <a-icon slot="prefix" type="search" />
      </a-input>
    </div>
    <a-menu
      :default-selected-keys="['1']"
      :open-keys.sync="openKeys"
      mode="inline"
    >
      <a-sub-menu>
        <span slot="title"><a-icon type="folder" /><span>珠江测试</span></span>
        <a-menu-item>
          <a-dropdown :trigger="['contextmenu']">
            <div @mouseenter="mouseenter" @mouseleave="mouseleave">
          <img src="@/assets/images/icon_my_sql.png" style="width:15px;height:15px" />
          数据连接1<a-icon type="more" style="margin-left:170px" v-if="icon"/>
            </div>
            <a-menu slot="overlay">
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
            <div @mouseenter="mouseenter" @mouseleave="mouseleave">
          <img src="@/assets/images/icon_csv.png" style="width:15px;height:15px" />
          数据连接2<a-icon type="more" style="margin-left:170px" v-if="icon"/>
            </div>
            <a-menu slot="overlay">
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
            <div @mouseenter="mouseenter" @mouseleave="mouseleave">
          <img
            src="@/assets/images/icon_log_file.png"
            style="width:15px;height:15px"
          />
          数据连接3<a-icon type="more" style="margin-left:170px" v-if="icon"/>
            </div>
            <a-menu slot="overlay">
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
            <div @mouseenter="mouseenter" @mouseleave="mouseleave">
          <img src="@/assets/images/icon_hive.png" style="width:15px;height:15px" />
          数据连接4<a-icon type="more" style="margin-left:170px" v-if="icon"/>
            </div>
            <a-menu slot="overlay">
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
        <span slot="title"><a-icon type="folder" /><span>用户流程</span></span>
        <a-menu-item>
          <a-dropdown :trigger="['contextmenu']">
            <div @mouseenter="mouseenter" @mouseleave="mouseleave">
          <img src="@/assets/images/icon_hbase.png" style="width:15px;height:15px" />
          数据连接1<a-icon type="more" style="margin-left:170px" v-if="icon"/>
            </div>
            <a-menu slot="overlay">
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
            <div @mouseenter="mouseenter" @mouseleave="mouseleave">
          <img
            src="@/assets/images/icon_sql_server.png"
            style="width:15px;height:15px"
          />
          数据连接2<a-icon type="more" style="margin-left:170px" v-if="icon"/>
            </div>
            <a-menu slot="overlay">
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
            <div @mouseenter="mouseenter" @mouseleave="mouseleave">
          <img src="@/assets/images/icon_excel.png" style="width:15px;height:15px" />
          数据连接3<a-icon type="more" style="margin-left:170px" v-if="icon"/>
            </div>
            <a-menu slot="overlay">
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
</template>

<script>
export default {
  props: {
    menuData: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      icon: false,
      current: ['mail'],
      openKeys: ['sub1'],
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }
  },
  mounted() {
    console.log(this.menuData)
  },
  methods: {
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.visible = false
    },
    changeList(i) {
      // console.log('触发了')
      this.$store.commit('dataAccess/set_selectAccess', i)
    },
    mouseenter(icon) {
      this.icon = true
    },
    mouseleave() {
      this.icon = false
    }
  }
}
</script>

<style lang="styl" scope>
@import "./menu.styl";
</style>
